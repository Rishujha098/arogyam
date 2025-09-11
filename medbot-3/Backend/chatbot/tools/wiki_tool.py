# chatbot/tools/wiki_tool.py
# Use wikipedia library only for very general info fallback (non-medical or public info).
try:
    import wikipedia
except Exception:
    wikipedia = None

def search_wiki(q: str):
    if not wikipedia:
        return None
    try:
        return wikipedia.summary(q, sentences=2, auto_suggest=True, redirect=True)
    except Exception:
        return None
