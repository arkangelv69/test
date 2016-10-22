import json
import re
import base64
import os
import requests
import jwt


from collections import defaultdict
from flask import Flask, jsonify, abort, make_response, request, current_app, _request_ctx_stack
from flask.ext.cors import cross_origin
from functools import wraps
from datetime import timedelta
from functools import update_wrapper
from py2neo import Graph, Node, Relationship
from pandas import DataFrame
from werkzeug.local import LocalProxy
from dotenv import Dotenv
from model import *
from flasgger import Swagger
import sys

###############################################################
#                   VARIABLES DE ENTORNO                      #
###############################################################
env = None

try:
    env = Dotenv('env/.env')
    client_id = env["AUTH0_CLIENT_ID"]
    client_secret = env["AUTH0_CLIENT_SECRET"]
except IOError:
  env = os.environ


app = Flask(__name__)
Swagger(app)
###############################################################
#                   AUTHENTICATION                            #
###############################################################

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

###############################################################
#                   COMMON FUNCTIONS                          #
###############################################################

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

###############################################################
#                       TESTS                                 #
###############################################################

# Controllers API
@app.route("/ping")
@cross_origin(headers=['Content-Type', 'Authorization'])
def ping():
    return "All good. You don't need to be authenticated to call this " + os.getenv('HOSTAPI',"MICASA")

@app.route("/secured/ping")
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
@requires_auth
def securedPing():
    return "All good. You only get this message if you're authenticated"


###############################################################
#                   CONNECTION NEO4J                          #
###############################################################

graph = Graph(host="neo4j",password=".dgonzalez.")


@app.route('/', methods=['GET'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
def helloWorld():
    """
    Api is up?
    Prueba de concepto para generar acceso al api mediante html
    ---
    tags:
      - Api is up?
    responses:
      500:
        description: Error The language is not awesome!
      200:
        description: Yeah!!
        schema:
    """

    return "API is UP"


@app.route('/private/<string:type>', methods=['PUT','POST'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
def newNode(type):
    """
        Get and Delete
        Obtener y elemininar elementos
        ---
        tags:
          - Post/Put
        parameters:
          - name: type
            in: path
            type: string
            required: true
            description: Type of node (plate,restaurant,user,menu)
        responses:
          500:
            description: Error The language is not awesome!
          200:
            description: Crear/actualizar
            schema:
        """
    if request.method == 'POST':
        myJson = request.get_json(force=True)
        i = ILoveNode.factory(type.title())
        i.create(myJson, graph)
        return json.dumps(i.toJson())

    elif request.method == 'PUT':
        myJson = request.get_json(force=True)
        i = eval(type.title()).select(graph, myJson["data"]["id"]).first()
        i.update(myJson,graph)
        return json.dumps(i.toJson())

@app.route('/private/<string:type>/<int:id>', methods=['GET','DELETE'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
def getNode(type,id):
    """
        Get and Delete
        Obtener y elemininar elementos
        ---
        tags:
          - Get/Delete
        parameters:
          - name: type
            in: path
            type: string
            required: true
            description: Type of node (plate,restaurant,user,menu)
          - name: id
            in: path
            type: integer
            description: Element id
        responses:
          500:
            description: Error The language is not awesome!
          200:
            description: Yeah!!
            schema:
              links:
                type: object
                properties:
                  self:
                    type: string
              data:
                type: object
                properties:
                  id:
                    type: int
                  type:
                    type: string
                  attributes:
                    type: object
                    properties:
                      name:
                        type: string
                      description:
                        type: string
                      image:
                        type: string
        """

    if request.method == 'GET':
        i = eval(type.title()).select(graph, id).first()
        return json.dumps(i.toJson())

    elif request.method == 'DELETE':
        i = eval(type.title()).select(graph, id).first()
        i.delete(graph)
        return "deleted"

@app.route('/private/plate/likes/<int:id>', methods=['GET'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
@requires_auth
def getLikes(id):
    if request.method == 'GET':
        i = Plate.select(graph, id).first()
        return str(i.getLikes())

@app.route('/private/user/restaurant/<int:id>', methods=['GET'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
def getRestaurants(id):
    if request.method == 'GET':
        i = User.select(graph, id).first()
        return json.dumps(i.getRestaurants())

@app.route('/public/restaurant/<string:lat>/<string:lon>/<string:r>/<string:deviceId>', methods=['GET'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
def restaurantsUser(lat,lon,r,deviceId):
    """ Si necesito operar
    try:
        lat, long, r = float(lat), float(long), float(r)
    except ValueError:
        abort(404)
    """

    ilove = TodayLove();
    return json.dumps(ilove.getToday(lat,lon,r,deviceId,graph))

@app.route('/public/restaurant/today/<int:id>', methods=['POST'])
#@crossdomain(origin='*')
@cross_origin(headers=['Content-Type', 'Authorization'])
@cross_origin(headers=['Access-Control-Allow-Origin', '*'])
#@requires_auth
def restaurant(id):
    """ Si necesito operar
    try:
        lat, long, r = float(lat), float(long), float(r)
    except ValueError:
        abort(404)
    """

    ilove = TodayLove();
    return json.dumps(ilove.getRestaurant(graph,id))

app.run(host='0.0.0.0')