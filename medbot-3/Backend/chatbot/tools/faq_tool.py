from db.db_utils import retrieve

def search_faq(query: str):
    try:
        rows = retrieve("faqs", query, top_k=3)
        # rows: [(id, query, answer)]
        return [(rid, ans) for rid, q, ans in rows if ans]
    except Exception as e:
        print(f"[faq_tool] error in {query}: {e}")
        return []
