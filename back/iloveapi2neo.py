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

# Funcion para habilitar el cross domain
def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)

    return decorator


#driver = GraphDatabase.driver("bolt://localhost:7687/",auth=basic_auth("neo4j",".dgonzalez."))
#graph = Graph("http://neo4j:.dgonzalez.@localhost:7474/")
graph = Graph(password=".dgonzalez.")


@app.route('/', methods=['GET'])
@crossdomain(origin='*')
def helloWorld():
    return jsonify({'Hello': 'World'})

@app.route('/plate', methods=['POST'])
@crossdomain(origin='*')
def newPlate():
    """
    new plate
    :return:
    """
    plate = request.get_json(force=True)
    plateNode = Node(plate["data"]["type"],name=plate["data"]["name"]
                     ,description=plate["data"]["description"],image=plate["data"]["image"])
    graph.create(plateNode)
    plateId = graph.run('match (p:Plate{name:"'+plateNode["name"]+'"}) return ID(p) as id').evaluate()
    plate["links"]["self"]="http://iloveplatos/plate/" + str(plateId)
    plate["data"]["id"]=plateId

    return json.dumps(plate)

@app.route('/plate/<int:plateId>', methods=['GET','POST','PUT'])
@crossdomain(origin='*')
def plate(plateId):
    """
    get plate and return plate
    :param plateId:
    :return:
    """
    if request.method == 'GET':
        cursor = graph.run('match (p:Plate) where ID(p) = '+str(plateId)+' return p.name, p.description, p.image, ID(p) as id').data()
        for record in cursor:
            plate = {
	                    "links":{
		                    "self": "http://iloveplatos/plate/" + str(plateId)
	                    },
                        "data":{
                            "type":"Plate",
                            "name":record["p.name"],
                            "description":record["p.description"],
                            "image":record["p.image"]
                        }
                    }
        return json.dumps(plate)
    else:
        plate = request.get_json(force=True)
        plateNode = graph.node(plateId)
        plateNode["name"] = plate["data"]["name"]
        plateNode["description"] = plate["data"]["description"]
        plateNode["image"] = plate["data"]["image"]
        plateNode.push()
        return json.dumps(plate)

@app.route('/relationship', methods=['POST'])
@crossdomain(origin='*')
def newRelationship():
    """
    json post:
    {
        user_id:213,
        plate_id:123,
        type:"LIKED"
    }
    new plate
    :return:
    """
    relationship = request.get_json(force=True)
    print relationship["user_id"]
    userN = graph.node(relationship["user_id"])
    plateN = graph.node(relationship["plate_id"])
    graph.create(Relationship(userN,relationship["type"],plateN))

    return "ok"




app.run()

