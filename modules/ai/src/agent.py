from langchain_text_splitters import RecursiveJsonSplitter
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.tools.retriever import create_retriever_tool
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_chroma import Chroma
from flask_socketio import emit
from src.enums import Event

class Agent:
    def __init__(self, model, embeddings, chunk_size, chuck_overlap, docs) -> None:
        self.llm = model
        self.embeddings = embeddings,
        self.chuck_size = chunk_size
        self.chunk_overlap = chuck_overlap
        self.docs = docs
        self.config = {
          "configurable": {
            "thread_id": "abc123"
          }
        }

    def create(self, tools, memory):
      self.agent = create_react_agent(self.llm, tools, checkpointer=memory)


    def stream(self, prompt):
      for chunk in self.agent.stream(
        {"messages": [HumanMessage(content=prompt)]},
        self.config
      ):
        print("output", chunk)

    def create_retriever(self):
      # text_splitter = RecursiveJsonSplitter(self.chuck_size, self.chunk_overlap)
      # splits = text_splitter.split_json(json_data=self.docs, convert_lists=True)
      # print(splits)
      # for chunk in splits[:3]:
      #     print(chunk)

      store = Chroma.from_documents(documents=self.docs, embedding=self.embeddings)
      retriever = store.as_retriever()

      return retriever

    def retriever_tool(self, retriever):
      tool = create_retriever_tool(
        retriever,
        "symptom_retriever",
        "Provides possible symptoms based on different parts of the body. Used for understanding the kinds of questions to ask the user to pin point the most dominant symptom",
      )

      return tool

    def tavily_search_tool(self, max_result, depth):
      tool = TavilySearchResults(
        max_result=max_result,
        search_depth=depth,
        include_answer=True,
        include_raw_content=True,
        include_images=True,
      )


      return tool
