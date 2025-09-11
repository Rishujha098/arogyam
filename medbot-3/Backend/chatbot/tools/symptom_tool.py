from db.db_utils import retrieve

def search_symptom(query: str):
    try:
        rows = retrieve("symptoms", query, top_k=3)
        # rows: [(id, symptom, answer)]
        return [(rid, ans) for rid, sym, ans in rows if ans]
    except Exception as e:
        print(f"[symptom_tool] error in {query}: {e}")
        return []
