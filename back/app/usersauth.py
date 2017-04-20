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

def getToken():
    url = "https://iloveplatos.eu.auth0.com/oauth/token"
    client_id = "CKtvKpwjAuihyrWryiFyTwiHBTl58Sm5"
    client_secret = "a3wo7AnFouMIzgM6fIQIwFoW4-dnsD8z7nM_BSOGTI6nIOkmkDc3m48TzCwuw48H"
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "audience": "https://iloveplatos.eu.auth0.com/api/v2/",
        "grant_type": "client_credentials"
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=json.dumps(data), headers=headers)
    string = response.content.decode('utf-8')
    json_obj = json.loads(string)
    return json_obj["access_token"]

def createUser(userId,deviceId):
    token = getToken()
    url = "https://iloveplatos.eu.auth0.com/api/v2/users"
    #"username": "username_"+str(deviceId),
    data = {
        "connection": "Username-Password-Authentication",
        "email": "mail_" + str(userId) + "_" + str(deviceId) + "@mail.com",
        "password": str(deviceId)+"_password",
        "user_metadata": {
            "neo_id": userId
        },
        "email_verified": True,
        "verify_email": False,
        "app_metadata": {}
    }

    headers = {'Content-Type': 'application/json',
               'Authorization': 'Bearer '+token}
    response = requests.post(url,data=json.dumps(data),headers=headers)
    return response

"""
{
  "connection": "Initial-Connection",
  "email": "john.doe@gmail.com",
  "username": "johndoe",
  "password": "secret",
  "phone_number": "+199999999999999",
  "user_metadata": {},
  "email_verified": false,
  "verify_email": false,
  "phone_verified": false,
  "app_metadata": {}
}
"""
"""
{
  "connection": "Username-Password-Authentication",
  "email": "john.doe@gmail.com",
  "password": "secret",
  "user_metadata": {
        "deviceId":"asdfadsfafs"
  },
  "email_verified": false,
  "app_metadata": {}
}

AUTH0_USER_CREATE_TOKEN
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJJcGJjRjBXVGJoQkIwMjl4TThGRUpnaWs5TXNGeno2NCIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImNyZWF0ZSJdfX0sImlhdCI6MTQ3NzQyNDM0OSwianRpIjoiYTdlODkwMjAzNDRiMDU5Zjg3MTc5MmM2ZjlhMWIzZjYifQ.PueCpOXgptaqSDpU3jgKWacGIAt4GAM0CFpfH7gcyQc
"""