# db/db_utils.py
import os
import logging
import psycopg2
import numpy as np
import ast  #  to safely parse embedding strings
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")

_model = None
def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("intfloat/multilingual-e5-base")
        logger.info("[db_utils] Using model intfloat/multilingual-e5-base")
    return _model

def _parse_embedding(raw):
    """Convert DB embedding (string or list) to numpy array."""
    if raw is None:
        return None
    if isinstance(raw, list) or isinstance(raw, np.ndarray):
        return np.array(raw, dtype=float)
    if isinstance(raw, str):
        try:
            parsed = ast.literal_eval(raw)  # safely parse "[0.1,0.2,...]"
            return np.array(parsed, dtype=float)
        except Exception:
            logger.error(f"[db_utils] failed to parse embedding string: {raw[:50]}...")
            return None
    return None

def retrieve(table: str, query: str, top_k: int = 3):
    try:
        model = get_model()
        q_emb = model.encode([query])[0]

        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        table_map = {
            "symptoms": ("id", "symptom", "answer"),
            "faqs": ("id", "query", "answer"),
            "schemes": ("id", "scheme_name_en", "purpose_en"),
            "risks": ("id", "risk", "answer"),
        }
        if table not in table_map:
            logger.error(f"[db_utils] Invalid table requested: {table}")
            return []

        id_col, text_col, ans_col = table_map[table]

        cur.execute(f"SELECT {id_col}, {text_col}, {ans_col}, embedding FROM {table}")
        rows = cur.fetchall()
        cur.close()
        conn.close()

        sims = []
        for rid, text, ans, emb in rows:
            emb_vec = _parse_embedding(emb)
            if emb_vec is None or not text:
                continue
            sim = np.dot(q_emb, emb_vec) / (np.linalg.norm(q_emb) * np.linalg.norm(emb_vec) + 1e-9)
            sims.append((sim, rid, str(text).strip(), str(ans or "").strip()))

        sims.sort(reverse=True, key=lambda x: x[0])
        top = sims[:top_k]

        return [(rid, text, ans) for _, rid, text, ans in top]

    except Exception as e:
        logger.error(f"[db_utils] retrieve error in {table}: {e}")
        return []
