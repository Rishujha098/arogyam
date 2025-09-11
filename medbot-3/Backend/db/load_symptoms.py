# db/load_symptoms.py
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

model = SentenceTransformer(EMB_MODEL)
EMB_DIM = model.get_sentence_embedding_dimension()
print("[load_symptoms] Using embedding model", EMB_MODEL, "dim=", EMB_DIM)

def get_conn():
    return psycopg2.connect(DATABASE_URL)

def create_table():
    conn = get_conn(); cur=conn.cursor()
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    cur.execute(f"""
    CREATE TABLE IF NOT EXISTS symptoms (
        id SERIAL PRIMARY KEY,
        symptom TEXT,
        answer TEXT,
        source TEXT,
        embedding vector({EMB_DIM})
    );""")
    conn.commit(); cur.close(); conn.close(); print("[load_symptoms] Table ready.")

def insert_data(path="../data/symptoms.json"):
    if not os.path.exists(path):
        print("symptoms.json not found at", path); return
    with open(path, "r", encoding="utf-8") as f:
        items = json.load(f)
    conn = get_conn(); cur = conn.cursor()
    rows = []
    for it in tqdm(items, desc="symptoms"):
        symptom_text = it.get("query") or it.get("symptom") or ""
        ans = it.get("answer","")
        emb = model.encode(symptom_text).tolist()
        rows.append((symptom_text, ans, it.get("source",""), emb))
        if len(rows) >= BATCH_SIZE:
            execute_batch(cur, "INSERT INTO symptoms (symptom,answer,source,embedding) VALUES (%s,%s,%s,%s)", rows, page_size=BATCH_SIZE)
            conn.commit(); rows=[]
    if rows:
        execute_batch(cur, "INSERT INTO symptoms (symptom,answer,source,embedding) VALUES (%s,%s,%s,%s)", rows, page_size=BATCH_SIZE)
        conn.commit()
    cur.close(); conn.close(); print("[load_symptoms] Data inserted.")

if __name__ == "__main__":
    create_table()
    insert_data()
