# run_chatbot.py
from chatbot.chatbot import MedChatbot

def main():
    print("🤖 AROGYAM CLI — type 'quit' to exit")
    bot = MedChatbot()
    user_id = "cli_user"

    while True:
        try:
            msg = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n👋 Goodbye! Stay healthy.")
            break

        if not msg:
            continue
        if msg.lower() in ("quit", "exit"):
            print("👋 Goodbye! Stay healthy.")
            break

        resp = bot.handle_message(msg, user_id)
        print(f"Arogyam: {resp}\n")

if __name__ == "__main__":
    main()
