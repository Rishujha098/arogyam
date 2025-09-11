# db/load_faqs_and_schemes.py
import os, json
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import psycopg2
from psycopg2.extras import execute_batch
from tqdm import tqdm

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
EMB_MODEL = os.getenv("EMB_MODEL", "intfloat/multilingual-e5-base")
BATCH_SIZE = int(os.getenv("LOAD_BATCH_SIZE", "64"))

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL must be set in .env")

model = SentenceTransformer(EMB_MODEL)
EMB_DIM = model.get_sentence_embedding_dimension()
print("[load_faqs_and_schemes] Using model", EMB_MODEL, "dim", EMB_DIM)

def get_conn():
    return psycopg2.connect(DATABASE_URL)

def create_tables():
    conn = get_conn(); cur = conn.cursor()
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    cur.execute(f"""
    CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        query TEXT,
        intent TEXT,
        entity TEXT,
        answer TEXT,
        language TEXT,
        source TEXT,
        embedding vector({EMB_DIM})
    );""")
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
        embedding vector({EMB_DIM})
    );""")
    conn.commit(); cur.close(); conn.close()
    print("[load_faqs_and_schemes] Tables ready.")

def insert_faqs(path="../data/master_dataset.json"):
    if not os.path.exists(path):
        print("master_dataset.json not found at", path); return
    with open(path, "r", encoding="utf-8") as f:
        items = json.load(f)
    conn = get_conn(); cur = conn.cursor()
    rows = []
    for it in tqdm(items, desc="faqs"):
        q = it.get("query") or it.get("question","")
        ans = it.get("answer","")
        text = (q + " " + ans).strip()
        emb = model.encode(text).tolist()
        rows.append((q, it.get("intent"), it.get("entity"), ans, it.get("language"), it.get("source","N/A"), emb))
        if len(rows) >= BATCH_SIZE:
            execute_batch(cur, """
                INSERT INTO faqs (query,intent,entity,answer,language,source,embedding) VALUES (%s,%s,%s,%s,%s,%s,%s)
            """, rows, page_size=BATCH_SIZE)
            conn.commit(); rows=[]
    if rows:
        execute_batch(cur, """
            INSERT INTO faqs (query,intent,entity,answer,language,source,embedding) VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, rows, page_size=BATCH_SIZE); conn.commit()
    cur.close(); conn.close(); print("[load_faqs_and_schemes] FAQs inserted.")

def insert_schemes(path="../data/govt.scheme.json"):
    if not os.path.exists(path):
        print("govt.scheme.json not found at", path); return
    with open(path, "r", encoding="utf-8") as f:
        items = json.load(f)
    conn = get_conn(); cur = conn.cursor()
    rows=[]
    for it in tqdm(items, desc="schemes"):
        name_en = it.get("scheme_name_en","")
        purpose_en = it.get("purpose_en","")
        text = (name_en + " " + purpose_en).strip()
        if not text:
            text = name_en or it.get("scheme_name_hi","")
        emb = model.encode(text).tolist()
        rows.append((name_en, it.get("scheme_name_hi"), it.get("scheme_name_hinglish"),
                     purpose_en, it.get("purpose_hi"), it.get("purpose_hinglish"),
                     it.get("keywords",[]), emb))
        if len(rows) >= BATCH_SIZE:
            execute_batch(cur, """
               INSERT INTO schemes (scheme_name_en,scheme_name_hi,scheme_name_hinglish,purpose_en,purpose_hi,purpose_hinglish,keywords,embedding)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            """, rows, page_size=BATCH_SIZE); conn.commit(); rows=[]
    if rows:
        execute_batch(cur, """
           INSERT INTO schemes (scheme_name_en,scheme_name_hi,scheme_name_hinglish,purpose_en,purpose_hi,purpose_hinglish,keywords,embedding)
           VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """, rows, page_size=BATCH_SIZE); conn.commit()
    cur.close(); conn.close(); print("[load_faqs_and_schemes] Schemes inserted.")

if __name__ == "__main__":
    create_tables()
    insert_faqs()
    insert_schemes()
    print("✅ Done.")
