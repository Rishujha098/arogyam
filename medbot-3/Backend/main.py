import os
import psycopg2
from psycopg2 import pool
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from functools import lru_cache

# 👇 Chatbot import
from chatbot.chatbot import MedChatbot

# Load env variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# FastAPI app
app = FastAPI(title="Arogyam Health Assistant API")

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # abhi sab allow hai
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connection Pool
db_pool = pool.SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    dsn=DATABASE_URL
)

def get_conn():
    try:
        return db_pool.getconn()
    except psycopg2.Error as e:
        raise Exception(f"Database connection failed: {e}")

def release_conn(conn):
    if conn:
        db_pool.putconn(conn)

# Cached embedding model
@lru_cache(maxsize=1)
def get_model():
    return SentenceTransformer("intfloat/multilingual-e5-base")

# Request schema
class QueryInput(BaseModel):
    query: str

# Chatbot request schema
class ChatInput(BaseModel):
    user_id: str
    message: str

# ✅ Global chatbot instance
chatbot = MedChatbot()

# ---------------- Root ----------------
@app.get("/")
def home():
    return {"message": "✅ Arogyam Health Assistant API is running!"}

# ---------------- Chatbot ----------------
@app.post("/chat")
def chat_endpoint(data: ChatInput):
    response = chatbot.handle_message(data.message, data.user_id)
    return {"reply": response}

# ---------------- FAQ ----------------
@app.get("/faq")
def faq_search_get(query: str):
    model = get_model()
    embedding = model.encode(query).tolist()
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT answer, 1 - (embedding <=> %s::vector) AS similarity
                FROM faqs
                ORDER BY similarity DESC
                LIMIT 1;
            """, (embedding,))
            res = cur.fetchone()
    finally:
        release_conn(conn)

    if res:
        answer, similarity = res
        return {"answer": answer, "similarity": float(similarity)}
    return {"answer": "No FAQ found. Please consult a doctor.", "similarity": 0.0}

@app.post("/faq")
def faq_search_post(data: QueryInput):
    return faq_search_get(data.query)

# ---------------- Schemes ----------------
@app.get("/schemes")
@app.get("/scheme")  # alias
def schemes_search_get(query: str):
    model = get_model()
    embedding = model.encode(query).tolist()
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT scheme_name_en, purpose_en, 1 - (embedding <=> %s::vector) AS similarity
                FROM schemes
                ORDER BY similarity DESC
                LIMIT 3;
            """, (embedding,))
            results = cur.fetchall()
    finally:
        release_conn(conn)

    if results:
        return {"results": [
            {"scheme_name": r[0], "purpose": r[1], "similarity": float(r[2])}
            for r in results
        ]}
    return {"results": [], "message": "No schemes found. Please check government portals."}

@app.post("/schemes")
@app.post("/scheme")
def schemes_search_post(data: QueryInput):
    return schemes_search_get(data.query)

# ---------------- Symptoms ----------------
@app.get("/symptoms")
def symptoms_search_get(query: str):
    model = get_model()
    embedding = model.encode(query).tolist()
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT symptom, answer, 1 - (embedding <=> %s::vector) AS similarity
                FROM symptoms
                ORDER BY similarity DESC
                LIMIT 1;
            """, (embedding,))
            res = cur.fetchone()
    finally:
        release_conn(conn)

    if res:
        symptom, answer, similarity = res
        return {"symptom": symptom, "answer": answer, "similarity": float(similarity)}
    return {"symptom": None, "answer": "No symptom info found. Please consult a doctor.", "similarity": 0.0}

@app.post("/symptoms")
def symptoms_search_post(data: QueryInput):
    return symptoms_search_get(data.query)

# ---------------- Risks ----------------
@app.get("/risks")
def risks_search_get(query: str):
    model = get_model()
    embedding = model.encode(query).tolist()
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT risk, answer, 1 - (embedding <=> %s::vector) AS similarity
                FROM risks
                ORDER BY similarity DESC
                LIMIT 1;
            """, (embedding,))
            res = cur.fetchone()
    finally:
        release_conn(conn)

    if res:
        risk, answer, similarity = res
        return {"risk": risk, "answer": answer, "similarity": float(similarity)}
    return {"risk": None, "answer": "No risk info found. Please consult a doctor.", "similarity": 0.0}

@app.post("/risks")
def risks_search_post(data: QueryInput):
    return risks_search_get(data.query)

# ---------------- Consult doctor ----------------
@app.get("/consult")
def consult_doctor():
    return {
        "doctor_link": "https://meet.jit.si/doctor-demo-room",
        "note": "⚠️ For accurate diagnosis, please consult a doctor."
    }
