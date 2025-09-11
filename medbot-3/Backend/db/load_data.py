# db/load_data.py
"""
Robust loader: inserts FAQs, schemes and symptoms into Postgres (pgvector).
Uses sentence-transformers for embeddings and psycopg2.extras.execute_values
to perform chunked, efficient bulk inserts with retry logic.
"""

import os
import sys
import json
import time
import math
import psycopg2
from psycopg2.extras import execute_values
from psycopg2 import OperationalError, DatabaseError
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

# Load environment
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set in .env")

# Embedding model
MODEL_NAME = os.getenv("EMB_MODEL", "intfloat/multilingual-e5-base")
print(f"[load_data] Loading embedding model: {MODEL_NAME} ...")
try:
    model = SentenceTransformer(MODEL_NAME)
except Exception as e:
    print(f"[load_data] ERROR loading model {MODEL_NAME}: {e}")
    raise
embedding_dim = model.get_sentence_embedding_dimension()
print(f"[load_data] Using embedding model {MODEL_NAME} (dim={embedding_dim})")

# DB connection helper
def get_conn():
    return psycopg2.connect(DATABASE_URL)

# Resolve project root & data dir (works no matter where script is run)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))  # .../db
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "data")

# Create tables + extension
def create_tables():
    conn = get_conn()
    cur = conn.cursor()
    try:
        # ensure pgvector extension exists
        cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        # faqs
        cur.execute(f"""
        CREATE TABLE IF NOT EXISTS faqs (
            id SERIAL PRIMARY KEY,
            query TEXT NOT NULL,
            intent TEXT,
            entity TEXT,
            answer TEXT,
            language TEXT,
            source TEXT,
            embedding vector({embedding_dim})
        );
        """)
        # schemes
        cur.execute(f"""
        CREATE TABLE IF NOT EXISTS schemes (
            id SERIAL PRIMARY KEY,
            scheme_name_en TEXT,
            scheme_name_hi TEXT,
            scheme_name_hinglish TEXT,
            purpose_en TEXT,
            purpose_hi TEXT,
            purpose_hinglish TEXT,
            keywords TEXT[],
            embedding vector({embedding_dim})
        );
        """)
        # symptoms
        cur.execute(f"""
        CREATE TABLE IF NOT EXISTS symptoms (
            id BIGINT PRIMARY KEY,
            symptom TEXT NOT NULL,
            answer TEXT,
            source TEXT,
            embedding vector({embedding_dim})
        );
        """)
        conn.commit()
        # Optional: create ivfflat index for faster ANN (uncomment and tune lists=n)
        # cur.execute("CREATE INDEX IF NOT EXISTS idx_faqs_embedding ON faqs USING ivfflat (embedding) WITH (lists = 100);")
        # cur.execute("CREATE INDEX IF NOT EXISTS idx_schemes_embedding ON schemes USING ivfflat (embedding) WITH (lists = 100);")
        # cur.execute("CREATE INDEX IF NOT EXISTS idx_symptoms_embedding ON symptoms USING ivfflat (embedding) WITH (lists = 100);")
        # conn.commit()
        print("[create_tables] Tables (and extension) ensured.")
    finally:
        cur.close()
        conn.close()

# util: chunking
def chunked(seq, size):
    for i in range(0, len(seq), size):
        yield seq[i:i + size]

# safe bulk insert using execute_values with template that casts last field to vector
def safe_insert(conn, cur, insert_sql_template, rows, batch_size=100, max_retries=3, retry_backoff=2.0):
    """
    - conn, cur: active psycopg2 connection & cursor
    - insert_sql_template: "INSERT INTO table (c1,c2,c3,embedding) VALUES %s"
    - rows: list of tuples where the last element is a vector literal string like "[0.1,0.2,...]"
    - batch_size: number rows per execute_values call
    """
    if not rows:
        return 0

    # template: map row tuple to SQL values; last column cast to vector
    # Example: "(%s, %s, %s, %s::vector)"
    # Number of %s must match number of columns in the tuple
    num_cols = len(rows[0])
    if num_cols < 1:
        raise ValueError("Rows must have at least one column")

    # build template where last placeholder is cast to vector
    placeholders = ", ".join(["%s"] * num_cols)
    # replace last %s with %s::vector
    placeholders = placeholders.rsplit("%s", 1)
    template = "(" + placeholders[0] + "%s::vector" + ")"

    total_inserted = 0
    for chunk in chunked(rows, batch_size):
        attempt = 0
        while True:
            try:
                # execute_values will fill VALUES %s with many tuples using the template
                execute_values(cur, insert_sql_template, chunk, template=template)
                conn.commit()
                total_inserted += len(chunk)
                break
            except (OperationalError, DatabaseError) as e:
                attempt += 1
                conn.rollback()
                print(f"[safe_insert] DB error (attempt {attempt}/{max_retries}): {e}")
                if attempt >= max_retries:
                    print("[safe_insert] Max retries reached — re-raising.")
                    raise
                # try to reconnect if connection closed
                try:
                    cur.close()
                except Exception:
                    pass
                try:
                    conn.close()
                except Exception:
                    pass
                time.sleep(retry_backoff * attempt)
                # recreate connection & cursor
                conn = get_conn()
                cur = conn.cursor()
    return total_inserted

# helper to convert embedding (ndarray/list) to pgvector literal string
def emb_to_literal(emb):
    # ensure Python floats and stable formatting
    return "[" + ",".join(str(float(x)) for x in emb) + "]"

# Insert FAQs
def insert_faqs(batch_size=200):
    path = os.path.join(DATA_DIR, "master_dataset.json")
    if not os.path.isfile(path):
        print(f"[insert_faqs] File not found: {path}")
        return
    with open(path, "r", encoding="utf-8") as f:
        faqs = json.load(f)

    print(f"[insert_faqs] Inserting {len(faqs)} FAQs...")
    rows = []
    for item in tqdm(faqs, desc="faqs", ncols=100):
        q = item.get("query")
        a = item.get("answer")
        if not q or not a:
            continue
        intent = item.get("intent")
        entity = item.get("entity")
        lang = item.get("language")
        src = item.get("source", "N/A")
        # Use combined text optionally (query+answer) for embedding — change as needed
        text_for_emb = q + " " + (a or "")
        emb = model.encode(text_for_emb)
        emb_lit = emb_to_literal(emb)
        rows.append((q, intent, entity, a, lang, src, emb_lit))

    if not rows:
        print("[insert_faqs] No rows to insert.")
        return

    conn = get_conn()
    cur = conn.cursor()
    try:
        insert_sql = "INSERT INTO faqs (query, intent, entity, answer, language, source, embedding) VALUES %s"
        inserted = safe_insert(conn, cur, insert_sql, rows, batch_size=batch_size)
        print(f"[insert_faqs] Inserted {inserted} faq rows.")
    finally:
        try:
            cur.close()
            conn.close()
        except Exception:
            pass

# Insert Schemes
def insert_schemes(batch_size=50):
    path = os.path.join(DATA_DIR, "govt.scheme.json")
    if not os.path.isfile(path):
        print(f"[insert_schemes] File not found: {path}")
        return
    with open(path, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    print(f"[insert_schemes] Inserting {len(schemes)} schemes...")
    rows = []
    for item in tqdm(schemes, desc="schemes", ncols=100):
        name_en = item.get("scheme_name_en")
        name_hi = item.get("scheme_name_hi")
        name_hing = item.get("scheme_name_hinglish")
        purpose_en = item.get("purpose_en")
        purpose_hi = item.get("purpose_hi")
        purpose_hing = item.get("purpose_hinglish")
        keywords = item.get("keywords", [])
        text_for_emb = (name_en or "") + " " + (purpose_en or "")
        emb = model.encode(text_for_emb)
        emb_lit = emb_to_literal(emb)
        rows.append((name_en, name_hi, name_hing, purpose_en, purpose_hi, purpose_hing, keywords, emb_lit))

    if not rows:
        print("[insert_schemes] No rows to insert.")
        return

    conn = get_conn()
    cur = conn.cursor()
    try:
        insert_sql = """
        INSERT INTO schemes (
            scheme_name_en, scheme_name_hi, scheme_name_hinglish,
            purpose_en, purpose_hi, purpose_hinglish, keywords, embedding
        ) VALUES %s
        """
        inserted = safe_insert(conn, cur, insert_sql, rows, batch_size=batch_size)
        print(f"[insert_schemes] Inserted {inserted} scheme rows.")
    finally:
        try:
            cur.close()
            conn.close()
        except Exception:
            pass

# Insert Symptoms
def insert_symptoms(batch_size=200):
    path = os.path.join(DATA_DIR, "symptoms.json")
    if not os.path.isfile(path):
        print(f"[insert_symptoms] File not found: {path}")
        return
    with open(path, "r", encoding="utf-8") as f:
        symptoms = json.load(f)

    print(f"[insert_symptoms] Inserting {len(symptoms)} symptoms...")
    rows = []
    for item in tqdm(symptoms, desc="symptoms", ncols=100):
        symptom_text = item.get("query") or item.get("symptom")
        if not symptom_text:
            continue
        answer_text = item.get("answer", "")
        source_text = item.get("source", "")
        # use provided id if present, else compute a hash-based id to avoid collisions
        provided_id = item.get("id")
        if provided_id is None:
            # create stable numeric id from hash if id missing
            provided_id = abs(hash(symptom_text)) % (10 ** 12)
        emb = model.encode(symptom_text)
        emb_lit = emb_to_literal(emb)
        rows.append((provided_id, symptom_text, answer_text, source_text, emb_lit))

    if not rows:
        print("[insert_symptoms] No rows to insert.")
        return

    conn = get_conn()
    cur = conn.cursor()
    try:
        insert_sql = """
        INSERT INTO symptoms (id, symptom, answer, source, embedding)
        VALUES %s
        ON CONFLICT (id) DO NOTHING
        """
        inserted = safe_insert(conn, cur, insert_sql, rows, batch_size=batch_size)
        print(f"[insert_symptoms] Inserted {inserted} symptom rows.")
    finally:
        try:
            cur.close()
            conn.close()
        except Exception:
            pass

if __name__ == "__main__":
    create_tables()
    insert_faqs()
    insert_schemes()
    insert_symptoms()
    print("✅ All data insertion attempts finished.")
