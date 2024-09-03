import os
import json
import uuid
from langchain_community.document_loaders import JSONLoader


class Utils:

  def json_loader(self, name):
    path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', name)
    loader = JSONLoader(file_path=path, jq_schema=".", text_content=False)
    return loader

  def gen_thread_id(self):
    return str(uuid.uuid4())
