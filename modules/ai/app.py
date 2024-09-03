from setup import Config
from urllib.parse import unquote

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit

from src.agent import Agent
from src.helper import Utils
from src.enums import Event

from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig, chain
from langgraph.prebuilt import create_react_agent
from src.prompt import system_instruction, prompt



# memory = config.memory()
# utils = Utils()
# thread_id = "abc123"

config = Config()
model = config.genai("gemini-1.5-flash", 0.3, 0.95, 64, 8192)


memory = MemorySaver()
search = TavilySearchResults(max_result=2)
tools = [search]
model_with_tools = model.bind_tools(tools)
llm =  prompt | model_with_tools

# agent = create_react_agent(llm, tools, checkpointer=memory)
config = {"configurable": {"thread_id": "abc123"}}

@chain
def tool_chain(user_input: str, config: RunnableConfig):
  input_ = { "user_input": user_input }
  ai_msg = llm.invoke(input_, config=config)
  tool_msgs = search.batch(ai_msg.tool_calls, config=config)
  return llm.invoke({**input_, "messages": [ai_msg, *tool_msgs]}, config=config)



def create_app():
  # embeddings = config.embedding_model("models/embedding-001")

  app = Flask(__name__)
  app.config['SECRET_KEY'] = config.secret_key
  socketio = SocketIO(app, cors_allowed_origins=['http://127.0.0.1:5173', 'http://localhost:5173'])

  # loader = utils.json_loader("questions.json")
  # docs = loader.load()
  # agent = Agent(llm, embeddings, 1000, 200, docs)

  # retriever = agent.create_retriever()
  # retriever_tool = agent.retriever_tool(retriever)
  # tavily_tool = agent.tavily_search_tool(5, "advanced")
  # tools = [tavily_tool]

  # agent.create(tools, memory)

  # memory = SqliteSaver.from_conn_string(":memory:")

  @socketio.on('connect')
  def handle_connect():
    print("Client connected")

  @socketio.on('disconnect')
  def handle_disconnect():
    print("Client disconnected")

  @socketio.on('send_message')
  def handle_send_message(data):
    prompt_content = data["content"]
    prompt_content = unquote(prompt_content)

    resp = tool_chain.invoke(prompt_content)
    print(resp)

    # for chunk in agent.stream(
    #   {
    #     "messages": [
    #     HumanMessage(content=prompt_content)]
    #   }, config
    # ):
    #   resp = chunk["agent"]["messages"][0].content
    #   data = {
    #     "content": resp,
    #     "sender": "asap"
    #   }

    #   emit("new_message", data)



    # prompt = data["content"]
    # prompt = unquote(prompt)
    # print(prompt)

    # chat_session = model.start_chat(
    #   history=[]
    # )
    # print(chat_session.history)
    # response = chat_session.send_message(prompt)
    # print(chat_session.history)

    # print("resp", response.text)
    # data = {
    #   "content": response.text,
    #   "sender": "asap"
    # }

    # emit(Event.NEW_MESSAGE, data)


  @app.route("/symptom-checker", methods=['POST'])
  def symptom_checker():

    if request.method == 'POST':
      prompt = request.json['message']
      prompt = unquote(prompt)

    chat_session = llm.start_chat(
      history=[]
    )

    print(chat_session.history)

    response = chat_session.send_message(prompt)
    print(chat_session.history)

    return jsonify({
      "message": response.text
    })

  return (socketio, app)

if __name__ == "__main__":
  socketio, app = create_app()
  socketio.run(app)
