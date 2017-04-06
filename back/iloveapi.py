from flask import Flask, jsonify, abort, make_response, request, current_app
from datetime import timedelta
from functools import update_wrapper
from neo4j.v1 import GraphDatabase, basic_auth
import json
import re

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


driver = GraphDatabase.driver("bolt://localhost:7687/",auth=basic_auth("neo4j",".dgonzalez."))
session = driver.session()
#result = session.run("match (movie:Movie{title:'Mystic River'})return movie.title, movie.tagline")

@app.route('/', methods=['GET'])
@crossdomain(origin='*')
def helloWorld():
    return jsonify({'Hello': 'World'})


"""
{
	"links":{
		"self": "http://iloveplatos/plate/12"
	},
	"data":{
		"type":"Plate",
		"name":"Macarrones",
		"description":"Macarrones con chorizo y tomate",
		"image":"http://img.jpg"
	}
}
"""
@app.route('/plate', methods=['POST'])
@crossdomain(origin='*')
def newPlate():
    plate = request.get_json(force=True)
    print plate["links"]["self"]
    result = session.run('create (p:Plate {name:"'+plate["data"]["name"]+'"}) return ID(p) as plateId')
    for record in result:
        print record["plateId"]
    #newPlate = session.run("create (p:Plate"+re.sub(r"\"(\w+)\"\s*:",r'\1:',json.dumps(plate))+") return p")
    #test = newPlate.single()
    #print test["p"]
    return "POST new"

@app.route('/plate/<int:plateId>', methods=['GET','POST'])
@crossdomain(origin='*')
def plate(plateId):
    if request.method == 'GET':
        return 'GET %d' % plateId
    else:
        return "POST update"

@app.route('/createPlate', methods=['POST'])
@crossdomain(origin='*')
def createPlate():
    plate = request.get_json(force=True)
    session.run("create (p:Plate"+re.sub(r"\"(\w+)\"\s*:",r'\1:',json.dumps(plate))+")")
    return "done"

@app.route('/createUser', methods=['POST'])
@crossdomain(origin='*')
def createUser():
    response = -1
    user = request.get_json(force=True)
    userId=session.run("create (p:User"+re.sub(r"\"(\w+)\"\s*:",r'\1:',json.dumps(user))+") return ID(p) as userId")
    for record in userId:
        response=record["userId"]
    return 'Id %d' % response

@app.route('/createRelationship', methods=['POST'])
@crossdomain(origin='*')
def createRelationship():
    rel = request.get_json(force=True)
    session.run('match (p:Plate{name:"'+rel["plate"]+'"}) match (d:User{name:"'+rel["user"]+'"}) create (d)-[:LIKED]->(p)')
    return "done"

@app.route('/getTop', methods=['GET'])
@crossdomain(origin='*')
def getTop():
    top = session.run('MATCH (u:User)-[r:LIKED]->(p:Plate) RETURN p.name, COUNT(r) as points ORDER BY COUNT(r) DESC LIMIT 10')
    for record in top:
        print("%s %s" % (record["p.name"], record["points"]))
    return "ok"

"""
Tus platos favoritos y los de la gente que coincide con tus platos
match (d:User{name:"DavidM"})-[r1:LIKED]->(p:Plate)
match (d:User{name:"DavidM"})-[r2:LIKED]->(op:Plate)<-[]-(o:User)
return d,p,o,op
"""

"""
Hacer un agregado
MATCH (n {name: 'John'})-[:FRIEND]-(friend)
WITH n, count(friend) as friendsCount
SET n.friendCount = friendsCount
RETURN n.friendsCount
"""

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'No esta en cassandra'}), 404)

""" Obtener el top 10
START n=node:user('*:*')
MATCH (n)-[r]->(x)
RETURN n, COUNT(r)
ORDER BY COUNT(r) DESC
LIMIT 10
"""


"""
match (u:User{name:"DavidM"})-[r]->(p:Plate) where type(r)<> "LIKED" return u,r,p
"""


app.run()