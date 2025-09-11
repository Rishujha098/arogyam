from chatbot import utils
from chatbot.llm_client import ask_gemini, DISCLAIMER
# from chatbot.tools import faq_tool, scheme_tool, symptom_tool, risk_tool
from chatbot import api_client as faq_tool
from chatbot import api_client as scheme_tool
from chatbot import api_client as symptom_tool
from chatbot import api_client as risk_tool


class MedAgent:
    def __init__(self):
        self.state = {}

    def handle(self, message: str, user_id: str):
        msg_norm = utils.normalize_text(message)
        lang = utils.detect_language_tight(message)

        # --- Greeting ---
        if msg_norm in ["hi", "hello", "hey", "namaste", "hola"]:
            return utils.format_response(
                "Hello 👋, I'm Arogyam. Aap mujhe apne symptoms bata sakte ho, ya phir health schemes ke baare mein puch sakte ho.",
                lang
            )

        # --- Continue flow (if user already in conversation) ---
        if user_id in self.state and "awaiting" in self.state[user_id]:
            return self._continue_flow(message, user_id, lang)

        # --- Intent classification ---
        if any(word in msg_norm for word in ["scheme", "yojana", "pm-jay", "eligibility", "insurance", "coverage"]):
            return self._handle_scheme(message, msg_norm, lang)

        if any(word in msg_norm for word in ["fever", "bukhar", "dard", "pain", "thakan", "fatigue", "khansi", "cough", "symptom", "headache"]):
            return self._handle_symptom(message, msg_norm, user_id, lang)

        # --- FAQ + Risk fallback ---
        faq_hits = faq_tool.search_faq(msg_norm) or []
        if faq_hits:
            return utils.format_response(faq_hits[0][1], lang)

        risk_hits = risk_tool.search_risk(msg_norm) or []
        if risk_hits:
            return utils.format_response(risk_hits[0][1], lang)

        # --- Pure LLM fallback ---
        lang_instruction = self._lang_instruction(lang)
        return ask_gemini(
            f"You are a medical assistant. User said: {message}. "
            f"{lang_instruction} Give a helpful, safe, friendly reply."
        ) + DISCLAIMER

    # ---------------- Scheme flow ----------------
    def _handle_scheme(self, message: str, msg_norm: str, lang: str):
        scheme_hits = scheme_tool.search_scheme(msg_norm) or []
        if scheme_hits:
            scheme_text = scheme_hits[0][1]
            lang_instruction = self._lang_instruction(lang)

            prompt = f"""
            You are a government health scheme assistant.
            User asked: "{message}"
            Scheme info: "{scheme_text}"

            Task: Respond in the same language as the user.
            {lang_instruction}
            - Explain the scheme briefly (2 lines).
            - Mention eligibility conditions (age, income, rural/urban, special groups).
            - Mention main benefits (insurance cover, free medicines, cashless treatment).
            - Keep tone supportive and user-friendly.
            """
            return ask_gemini(prompt) + DISCLAIMER

        return utils.format_response("Mujhe is scheme ki info nahi mili.", lang)

    # ---------------- Symptom flow ----------------
    def _handle_symptom(self, message: str, msg_norm: str, user_id: str, lang: str):
        sym_hits = symptom_tool.search_symptom(msg_norm) or []
        if sym_hits:
            fact_text = sym_hits[0][1]
            self.state[user_id] = {"last_fact": fact_text, "awaiting": "duration", "lang": lang}

            lang_instruction = self._lang_instruction(lang)
            prompt = f"""
            You are a friendly medical assistant.
            User said: "{message}"
            Retrieved medical info: "{fact_text}"

            Task: Respond naturally in the same language as the user.
            {lang_instruction}
            - Keep it short and caring.
            - End by asking: "Ye problem kab se hai? (e.g. '3 din se')"
            """
            return ask_gemini(prompt) + DISCLAIMER

        return utils.format_response("Mujhe is symptom ki info nahi mili.", lang)

    # ---------------- Continue follow-ups ----------------
    def _continue_flow(self, message: str, user_id: str, lang: str):
        st = self.state[user_id]

        if st["awaiting"] == "duration":
            st["duration"] = message
            st["awaiting"] = "severity"
            return utils.format_response("Severity kaisi hai? (mild / moderate / severe)", lang)

        elif st["awaiting"] == "severity":
            st["severity"] = message
            st["awaiting"] = "symptoms"
            return utils.format_response("Aur koi symptoms hai? (jaise cough, body pain, nausea?)", lang)

        elif st["awaiting"] == "symptoms":
            st["extra_symptoms"] = message
            fact_text = st.get("last_fact", "user’s health issue")
            duration = st.get("duration", "?")
            severity = st.get("severity", "?")
            extra = st.get("extra_symptoms", "not specified")
            lang = st.get("lang", "en")

            # ✅ Always clear state before final reply
            del self.state[user_id]

            lang_instruction = self._lang_instruction(lang)
            prompt = f"""
            You are a friendly medical assistant.
            User problem: "{fact_text}"
            Duration: "{duration}"
            Severity: "{severity}"
            Extra symptoms: "{extra}"

            Task: Respond in the same language as the user.
            {lang_instruction}
            - Summarize user case briefly.
            - Suggest possible cause.
            - Suggest suitable specialist.
            - Provide safe advice (home remedies + when to consult doctor).
            - Keep reply short (3–4 lines), empathetic and clear.
            """
            return ask_gemini(prompt) + DISCLAIMER

        # ✅ Reset if mismatch
        del self.state[user_id]
        return utils.format_response("Mujhe samajh nahi aaya.", lang)

    # ---------------- Language lock ----------------
    def _lang_instruction(self, lang: str) -> str:
        if lang == "hi":
            return "Reply strictly in Hindi only."
        elif lang == "hinglish":
            return "Reply in casual Hinglish (Roman Hindi + English mix)."
        else:
            return "Reply in formal English, like a doctor."
