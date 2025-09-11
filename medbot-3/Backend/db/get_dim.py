# db/get_dim.py
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
load_dotenv()
model_name = "intfloat/multilingual-e5-base"
m = SentenceTransformer(model_name)
print("Embedding dimension:", m.get_sentence_embedding_dimension())
