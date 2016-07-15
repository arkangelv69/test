from flask import Flask, jsonify, abort, make_response, request, current_app
from datetime import timedelta
from functools import update_wrapper
from py2neo import Graph, Node, Relationship
from pandas import DataFrame
import json
import re

import json
import re
#from Restaurant import Restaurant, User

app = Flask(__name__)

#Descomentar para conectar con cassandra
#cluster = Cluster()
#session = cluster.connect('enron')


@app.route('/', methods=['GET'])
def helloWorld():
    return jsonify({'Hello': 'World'})

app.run()
