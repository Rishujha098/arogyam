# chatbot/chatbot.py
from chatbot.agent import MedAgent

class MedChatbot:
    def __init__(self):
        self.agent = MedAgent()

    def handle_message(self, message: str, user_id: str):
        return self.agent.handle(message, user_id)
