import json
import re
import jwt
import base64
import os
import requests

from collections import defaultdict
from flask import Flask, jsonify, abort, make_response, request, current_app, _request_ctx_stack
from functools import wraps
from datetime import timedelta
from functools import update_wrapper
from py2neo import Graph, Node, Relationship
from pandas import DataFrame
from werkzeug.local import LocalProxy
from dotenv import Dotenv
from flask.ext.cors import cross_origin

env = None

try:
    env = Dotenv('./.env')
    client_id = env["AUTH0_CLIENT_ID"]
    client_secret = env["AUTH0_CLIENT_SECRET"]
except IOError:
  env = os.environ

app = Flask(__name__)

def split(string, brackets_on_first_result = False):
    matches = re.split("[\[\]]+", string)
    matches.remove('')
    return matches

def mr_parse(params):
    results = {}
    for key in params:
        if '[' in key:
            key_list = split(key)
            d = results
            for partial_key in key_list[:-1]:
                if partial_key not in d:
                    d[partial_key] = dict()
                d = d[partial_key]
            d[key_list[-1]] = params[key]
        else:
            results[key] = params[key]
    return results

# Format error response and append status code.
def handle_error(error, status_code):
  resp = jsonify(error)
  resp.status_code = status_code
  return resp

def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return handle_error({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}, 401)

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return handle_error({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}, 401)
    elif len(parts) == 1:
      return handle_error({'code': 'invalid_header', 'description': 'Token not found'}, 401)
    elif len(parts) > 2:
      return handle_error({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}, 401)

    token = parts[1]
    try:
        payload = jwt.decode(
            token,
            base64.b64decode(client_secret.replace("_","/").replace("-","+")),
            audience=client_id
        )
    except jwt.ExpiredSignature:
        return handle_error({'code': 'token_expired', 'description': 'token is expired'}, 401)
    except jwt.InvalidAudienceError:
        return handle_error({'code': 'invalid_audience', 'description': 'incorrect audience, expected: ' + client_id}, 401)
    except jwt.DecodeError:
        return handle_error({'code': 'token_invalid_signature', 'description': 'token signature is invalid'}, 401)
    except Exception:
        return handle_error({'code': 'invalid_header', 'description':'Unable to parse authentication token.'}, 400)

    _request_ctx_stack.top.current_user = user = payload
    return f(*args, **kwargs)

  return decorated

# Controllers API
@app.route("/ping")
@cross_origin(headers=['Content-Type', 'Authorization'])
def ping():
    return "All good. You don't need to be authenticated to call this"

@app.route("/secured/ping")
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
@requires_auth
def securedPing():
    return "All good. You only get this message if you're authenticated"


#Descomentar para conectar con cassandra
#cluster = Cluster()
#session = cluster.connect('enron')


#driver = GraphDatabase.driver("bolt://localhost:7687/",auth=basic_auth("neo4j",".dgonzalez."))
#graph = Graph("http://neo4j:.dgonzalez.@neo4j:7474/")
#graph = Graph("http://neo4j:.dgonzalez.@neo4j:7474/")
graph = Graph(host="neo4j",password=".dgonzalez.")


@app.route('/', methods=['GET'])
#@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
def helloWorld():
    #testDic = request.args.get('test')
    testDic = mr_parse(request.args)
    #return testDic["filter"]["a"]
    return "ok"

#return jsonify({'Hello': request.args.get["test"]})

@app.route('/public/plate', methods=['GET'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
def allPlates():
    return "all plates"

"""
{
    "links": {
        "self": "/public/contenidos?view%5Blayout%5D=home",
        "next": "/public/contenidos?view[layout]=regular&page[start]=18"
    },
    "data": [
"""

@app.route('/private/plate', methods=['PUT','POST'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
def newPlate():
    """
    new plate
    :return:
    """
    if request.method == 'POST':
        plate = request.get_json(force=True)
        plateNode = Node(plate["data"]["type"],name=plate["data"]["attributes"]["name"]
                     ,description=plate["data"]["attributes"]["description"],image=plate["data"]["attributes"]["image"])
        graph.create(plateNode)
        plateId = graph.run('match (p:Plate{name:"'+plateNode["name"]+'"}) return ID(p) as id').evaluate()
        plate["links"]["self"]="http://iloveplatos/plate/" + str(plateId)
        plate["data"]["id"]=plateId

        return json.dumps(plate)
    elif request.method == 'PUT':
        plate = request.get_json(force=True)
        plateNode = graph.node(plate["data"]["id"])
        plateNode["name"] = plate["data"]["attributes"]["name"]
        plateNode["description"] = plate["data"]["attributes"]["description"]
        plateNode["image"] = plate["data"]["attributes"]["image"]
        plateNode.push()
        return json.dumps(plate)



@app.route('/private/plate/<int:plateId>', methods=['GET'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
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
                            "id":plateId,
                            "attributes":{
                                "name":record["p.name"],
                                "description":record["p.description"],
                                "image":record["p.image"]
                            }
                        }
                    }
        if 'plate' in locals():
            return json.dumps(plate)
        else:
            return "no esta"


@app.route('/private/relationship', methods=['POST'])
#@crossdomain(origin='*')
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
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
    userN = graph.node(relationship["from"]["user_id"])
    plateN = graph.node(relationship["to"]["plate_id"])
    graph.create(Relationship(userN,relationship["data"]["type"],plateN,test=relationship["data"]["test"]))
    return "ok"



@app.route('/public/user', methods=['GET'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
def allUsers():
    return "all users"

"""
{
    "links": {
        "self": "/public/contenidos?view%5Blayout%5D=home",
        "next": "/public/contenidos?view[layout]=regular&page[start]=18"
    },
    "data": [
"""

@app.route('/private/user', methods=['PUT','POST'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
def newUser():
    """
    new user
    :return:
    """
    if request.method == 'POST':
        user = request.get_json(force=True)
        userNode = Node(user["data"]["type"],name=user["data"]["attributes"]["name"]
                     ,email=user["data"]["attributes"]["email"],device_id=user["data"]["attributes"]["device_id"])
        graph.create(userNode)
        userId = graph.run('match (p:User{device_id:"'+userNode["device_id"]+'"}) return ID(p) as id').evaluate()
        user["links"]["self"]="http://iloveplatos/private/user/" + str(userId)
        user["data"]["id"]=userId

        return json.dumps(user)
    elif request.method == 'PUT':
        user = request.get_json(force=True)
        userNode = graph.node(user["data"]["id"])
        userNode["name"] = user["data"]["attributes"]["name"]
        userNode["email"] = user["data"]["attributes"]["email"]
        userNode["device_id"] = user["data"]["attributes"]["device_id"]
        userNode.push()
        return json.dumps(user)



@app.route('/private/user/<int:userId>', methods=['GET'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
def user(userId):
    """
    get user and return user
    :param userId:
    :return:
    """

    if request.method == 'GET':
        cursor = graph.run('match (p:User) where ID(p) = '+str(userId)+' return p.name, p.email, p.device_id, ID(p) as id').data()
        for record in cursor:
            user = {
                        "links":{
                            "self": "http://iloveplatos/private/user/" + str(userId)
                        },
                        "data":{
                            "type":"User",
                            "id":userId,
                            "attributes":{
                                "name":record["p.name"],
                                "email":record["p.email"],
                                "device_id":record["p.device_id"]
                            }
                        }
                    }
        if 'user' in locals():
            return json.dumps(user)
        else:
            return "no esta"


#@app.route('/public/restaurant/<float:lat>/<float:lon>/<float:r>', methods=['GET'])
@app.route('/public/restaurant/<string:lat>/<string:lon>/<string:r>', methods=['GET'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
def restaurants(lat,lon,r):
    """
    try:
        lat, long, r = float(lat), float(long), float(r)
    except ValueError:
        abort(404)
    """
    """
    r = requests.post('http://localhost:7474/db/data/ext/SpatialPlugin/graphdb/findGeometriesWithinDistance', auth=('neo4j', '.dgonzalez.'),json={"pointX":-3.490169657737401,"pointY":40.39707680663439,"distanceInKm":1,"layer":"Restaurants"})

    myRestaurants = []
    for restaurant in r.json():
        myRestaurants += [restaurant["metadata"]["id"]]

    cursor = graph.run('match (r:Restaurant) where ID(r) IN ' + str(myRestaurants) + ' return r.name').data()
    """
    cursor = graph.run('MATCH (r:Restaurant) WHERE distance(point(r),point({latitude:'+
                       lat+',longitude:'+ lon +'})) < '+ r+'*1000 RETURN r.name').data()
    for record in cursor:
        print record["r.name"]

    return "listo: lat"+str(lat)

app.run(host='0.0.0.0',debug="true")

"""
match (u:User{name:"David"})-[re:LIKED]->(p:Plate)<-[:HAVE]-(m:Menu)<-[:HAVE]-(r:Restaurant)
where ID(r) IN [38]
return p
"""


""" Obtener los restaurantes
MATCH (r:Restaurant)
WHERE distance(point(r),point({latitude:40.39682978190974,longitude:-3.4897354662994173})) < 2*1000
RETURN r
"""

""" Obtener los restaurantes y los favoritos
MATCH (r:Restaurant)
MATCH (u:User{name:"David"})-[r2:LIKED]->(p:Plate)<-[]-(m:Menu)<-[r3:HAVE]-(r4)
WHERE distance(point(r),point({latitude:40.39726896121282,longitude:-3.491032314358118})) < 0.2*1000
AND r3.active = true
RETURN r,p,-1
"""

""" Obtener el top 10
START n=node:user('*:*')
MATCH (n)-[r]->(x)
RETURN n, COUNT(r)
ORDER BY COUNT(r) DESC
LIMIT 10
"""


""" TODO JUNTO
MATCH (u:User)-[r4]->(p:Plate)<-[]-(m:Menu)<-[r3:HAVE]-(r)
WHERE distance(point(r),point({latitude:40.39726896121282,longitude:-3.491032314358118})) < 0.2*1000 and r3.active = true
RETURN r,p, COUNT(r4) as top
ORDER BY COUNT(r4) DESC
limit 3
UNION
WITH -1 as top
MATCH (r:Restaurant)
MATCH (u:User{name:"David"})-[r2:LIKED]->(p:Plate)<-[]-(m:Menu)<-[r3:HAVE]-(r4)
WHERE distance(point(r),point({latitude:40.39726896121282,longitude:-3.491032314358118})) < 0.2*1000
AND r3.active = true
RETURN r,p,top
"""