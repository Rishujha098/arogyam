# chatbot/tools/__init__.py
from .pg_retriever import retrieve

# For backwards compatibility, expose function names used elsewhere
def pg_retrieve(table: str, query: str, top_k: int = 5):
    return retrieve(table=table, query=query, top_k=top_k)

# chatbot/tools/__init__.py
from .faq_tool import search_faq
from .scheme_tool import search_scheme
from .symptom_tool import search_symptom
from .risk_tool import search_risk
