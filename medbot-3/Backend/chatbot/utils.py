import re
from langdetect import detect

# Standard disclaimer
DISCLAIMER = "\n\nThis is not a substitute for professional medical advice."


def normalize_text(text: str) -> str:
    """Normalize input text (lowercase + strip + collapse spaces)."""
    return re.sub(r"\s+", " ", text.lower()).strip()


def detect_language_tight(text: str) -> str:
    """
    Detect user language in a strict way:
    - 'hi' → Hindi only (Devanagari script)
    - 'hinglish' → Romanized Hindi/mixture
    - 'en' → English
    """
    text_strip = text.strip()

    # Hindi script (Devanagari)
    if re.search(r"[\u0900-\u097F]", text_strip):
        return "hi"

    # Hinglish (Roman script but Hindi words)
    hinglish_words = [
        "hai", "nahi", "acha", "kya", "kaise", "thoda", "bimari", "bukhar", "dard"
    ]
    if any(w in text_strip.lower() for w in hinglish_words):
        return "hinglish"

    # Fallback to langdetect
    try:
        lang = detect(text_strip)
        if lang == "hi":
            return "hi"
        return "en"
    except Exception:
        return "en"


def detect_language_simple(text: str) -> str:
    """Old fallback detector (kept for compatibility with older code)."""
    try:
        lang = detect(text)
        if lang == "hi":
            return "hi"
        return "en"
    except Exception:
        return "en"


def format_response(text: str, lang: str) -> str:
    """
    Format bot reply according to detected language:
    - Hindi → pure Hindi
    - Hinglish → casual Hinglish
    - English → formal English
    """
    if lang == "hi":
        return text  # pure Hindi
    elif lang == "hinglish":
        return text  # casual Hinglish
    else:
        return text  # formal English
