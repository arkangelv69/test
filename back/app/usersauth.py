import requests
import os,json
from dotenv import Dotenv


env = None

try:
    env = Dotenv('env/.env')
    client_id = env["AUTH0_CLIENT_ID"]
    client_secret = env["AUTH0_CLIENT_SECRET"]
except IOError:
  env = os.environ

def createUser(userId,deviceId):
    url = "https://iloveplatos.eu.auth0.com/dbconnections/signup"
    data = {
        "client_id": client_id,
        "email": "mail_" + str(userId) + "_" + str(deviceId) +"@mail.com",
        "password": str(deviceId)+"_password",
        "connection": "Username-Password-Authentication"
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url,data=json.dumps(data),headers=headers)
    return response