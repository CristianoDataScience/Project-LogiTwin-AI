from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
import os
import random

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("/")
def chat_with_ai(request: ChatRequest):
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # System context: simplified state of operation to keep costs low
        # In a real app, we would query the DB for real-time stats
        context = "Você é o assistente inteligente do sistema LogiTwin AI. Status atual: 34 caminhões ativos, 2 CDs com alta carga, Clima instável na região Sudeste. Responda como um especialista em logística."
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": request.message}
            ],
            max_tokens=150
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        print(f"Chat Error: {e}")
        return {"response": "Desculpe, estou com dificuldades para conectar ao cérebro central agora."}
