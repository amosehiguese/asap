import os
import sqlite3
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langgraph.graph import StateGraph
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.checkpoint.memory import MemorySaver

from dotenv import load_dotenv

load_dotenv()

class Config:
    def __init__(self):
        self.secret_key = os.getenv("SECRET_KEY")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.tavily_api_key = os.getenv("TAVILY_API_KEY")
        self.apimedic_username = os.getenv("APIMEDIC_USERNAME")
        self.apimedic_password = os.getenv("APIMEDIC_PASSWORD")
        self.apimedic_health_url = os.getenv("APIMEDIC_HEALTH_URL")
        self.apimedic_auth_url = os.getenv("APIMEDIC_AUTH_URL")
        self.apimedic_language = os.getenv("APIMEDIC_LANG")

    def genai(self, model,temp, p, k, max_tokens):
        llm = ChatGoogleGenerativeAI(model=model, google_api_key=self.gemini_api_key, temperature=temp, top_p=p, top_k=k, max_output_tokens=max_tokens)
        return llm

    def embedding_model(self, model):
        embeddings = GoogleGenerativeAIEmbeddings(model=model, google_api_key=self.gemini_api_key)
        return embeddings

    def memory(self):
      workflow = StateGraph(dict)
      conn = sqlite3.connect(":memory:")
      memory = SqliteSaver(conn)
      workflow.compile(checkpointer=memory)
      config = {
          "configurable": {
            "thread_id": "1"
          }
      }
      workflow.get_state(config)
      return memory

