import requests

BASE_URL = "http://127.0.0.1:8000"  # FastAPI backend ka URL

def search_faq(query: str):
    try:
        r = requests.get(f"{BASE_URL}/faq", params={"query": query}, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data.get("answer"):
                return [(query, data["answer"])]
    except Exception as e:
        print("FAQ API error:", e)
    return []

def search_scheme(query: str):
    try:
        r = requests.get(f"{BASE_URL}/schemes", params={"query": query}, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if "results" in data and data["results"]:
                return [(query, data["results"][0]["purpose"])]
    except Exception as e:
        print("Scheme API error:", e)
    return []

def search_symptom(query: str):
    try:
        r = requests.get(f"{BASE_URL}/symptoms", params={"query": query}, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data.get("answer"):
                return [(query, data["answer"])]
    except Exception as e:
        print("Symptom API error:", e)
    return []

def search_risk(query: str):
    try:
        r = requests.get(f"{BASE_URL}/risks", params={"query": query}, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data.get("answer"):
                return [(query, data["answer"])]
    except Exception as e:
        print("Risk API error:", e)
    return []
