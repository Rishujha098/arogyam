# chatbot/tools/pg_retriever.py
import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")

def _get_pg_conn():
    import psycopg2
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL environment variable not set.")
    return psycopg2.connect(DATABASE_URL)

def retrieve(table: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Retrieve similar rows from Postgres tables using pgvector if available.
    Returns list of dicts: {"id":.., "text":.., "similarity":..}
    """
    if not table or not query:
        return []

    # Try to compute embedding for the query if the environment has SentenceTransformer
    q_emb = None
    try:
        from sentence_transformers import SentenceTransformer
        model_name = os.getenv("EMB_MODEL", "intfloat/multilingual-e5-base")
        model = SentenceTransformer(model_name)
        q_emb = model.encode(query).tolist()
    except Exception as e:
        logger.debug("Embedding model not available or failed to encode: %s", e)

    results = []
    try:
        conn = _get_pg_conn()
        cur = conn.cursor()
        if q_emb is not None:
            # Use vector similarity operator (<#>) if extension present
            try:
                sql = f"""
                    SELECT id,
                           COALESCE(answer, purpose_en, symptom, scheme_name_en, query, '') as text,
                           1 - (embedding <#> %s::vector) AS similarity
                    FROM {table}
                    ORDER BY embedding <#> %s::vector
                    LIMIT %s;
                """
                cur.execute(sql, (q_emb, q_emb, top_k))
                rows = cur.fetchall()
                for r in rows:
                    results.append({
                        "id": r[0],
                        "text": r[1],
                        "similarity": float(r[2]) if r[2] is not None else 0.0
                    })
                cur.close()
                conn.close()
                return results
            except Exception as e:
                logger.debug("pgvector-based retrieval failed, falling back to text search: %s", e)

        # fallback to simple ILIKE search
        try:
            like_q = f"%{query}%"
            sql2 = f"""
                SELECT id, COALESCE(answer, purpose_en, symptom, scheme_name_en, query, '') as text
                FROM {table}
                WHERE COALESCE(answer, purpose_en, symptom, scheme_name_en, query) ILIKE %s
                LIMIT %s;
            """
            cur.execute(sql2, (like_q, top_k))
            rows = cur.fetchall()
            for r in rows:
                results.append({
                    "id": r[0],
                    "text": r[1],
                    "similarity": 0.0
                })
        finally:
            cur.close()
            conn.close()
    except Exception as e:
        logger.error("Database retrieval error: %s", e)
    return results
