from db.db_utils import retrieve

def search_risk(query: str):
    try:
        rows = retrieve("risks", query, top_k=3)
        # rows: [(id, risk, answer)]
        return [(rid, ans) for rid, risk, ans in rows if ans]
    except Exception as e:
        print(f"[risk_tool] error in {query}: {e}")
        return []
