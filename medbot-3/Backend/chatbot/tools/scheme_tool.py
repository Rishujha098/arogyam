from db.db_utils import retrieve

def search_scheme(query: str):
    try:
        rows = retrieve("schemes", query, top_k=3)
        # rows: [(id, scheme_name, purpose)]
        return [(rid, f"{scheme}: {purpose}") for rid, scheme, purpose in rows if purpose]
    except Exception as e:
        print(f"[scheme_tool] error in {query}: {e}")
        return []
