# chatbot/llm_client.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

DISCLAIMER = "\n\nThis is not a substitute for professional medical advice."

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY must be set in .env")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)

def ask_gemini(prompt: str, history: list = None) -> str:
    try:
        if history:
            response = model.generate_content([*history, {"role": "user", "parts": [prompt]}])
        else:
            response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"[Gemini error: {e}]"

def stream_gemini(prompt: str):
    try:
        for chunk in model.generate_content(prompt, stream=True):
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"[Gemini stream error: {e}]"
