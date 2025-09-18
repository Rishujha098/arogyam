<h1> Arogyam Chatbot </h1>

Arogyam Chatbot is an AI-powered conversational health assistant that helps users with basic medical queries, symptom guidance, and health information. 
It is designed to provide instant, reliable, and user-friendly interaction for patients.

🚀 Features

✅ Natural Language Understanding – Users can ask questions in plain English/Hindi
✅ Symptom Guidance – Provides initial awareness based on inputs
✅ Prescription Query Support – Helps interpret basic medicine/prescription details
✅ WhatsApp/Frontend Integration – Accessible via web & messaging apps
✅ Scalable API Design – Ready for future healthcare integrations

🏗️ System Architecture
graph TD
    U[User] -->|Chat/Voice| F[Frontend / WhatsApp API]
    F --> B[FastAPI Backend]
    B --> NLP[LLM / NLP Model]
    NLP --> DB[(Knowledge Base / Medical Info)]
    DB --> NLP
    NLP --> B
    B --> F

🛠️ Tech Stack

Backend → FastAPI (Python)

Frontend Integration → React.js / WhatsApp API (Twilio / Meta)

NLP → Hugging Face Transformers / OpenAI API / LLaMA2

Database → PostgreSQL / MongoDB

Deployment → Uvicorn + Docker

⚡ Getting Started
1️⃣ Clone the repository
git clone https://github.com/Rishujha098/arogyam.git
cd arogyam-chatbot

2️⃣ Setup environment
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
pip install -r requirements.txt

3️⃣ Run the chatbot backend
uvicorn main:app --reload

4️⃣ Access the API

Visit:
http://127.0.0.1:8000/docs

🔮 Future Scope

🌍 Multilingual support (Hindi, English, Hinglish)
🔔 Real-time health alerts (WhatsApp, SMS, Email)
🧠 Personalized recommendations using user history
👨‍💻 Contributors

Rishu Kumar Jha –  NLP & Chatbot
Ayush - Backend
Kumar Kartikey - frontend
⭐ Support

If you like this project, give it a ⭐ and connect with me on LinkedIn
https://www.linkedin.com/in/rishu-jha-0637a7325/
