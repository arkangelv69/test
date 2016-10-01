from model import *
import json
from py2neo import Graph
from py2neo.ogm import GraphObject, Property, RelatedFrom, RelatedTo

graph = Graph(host="neo4j",password=".dgonzalez.")

#u = User.select(graph,42).first()

#u = User.select(graph).where(name="David").first()





#p.liked.add(u,image="esta es mi imagen")

#print p.__primaryvalue__

#for user in p.liked:
#    print(user.name)

#graph.push(p)

user = {
            "data": {
                "type": "User",
                "attributes":{
                    "name": "Dani2",
                    "email": "dgalbandea@gmail.com2",
                    "device_id": "aaaaa2"
                }
            },
            "links": {
                "self": ""
            }
}

plate = {
            "data": {
                "type": "Plate",
                "id": 21,
                "attributes":{
                    "name": "Croquetas de jamon",
                    "image": "http://img.jpg",
                    "description": "las cambio asi yo"
                }
            },
            "links": {
 	            "self": ""
            }
}

p = eval("Plate").select(graph,80).first()


p.addLike(43,graph)
print p.getLikes()


restaurant = {
	"data":{
    	"type":"Restaurant",
        "attributes":{
        	"name":"Restaurante David2",
            "latitude":123.12
        },
        "relationships":{
        	"relatedFrom":{
            	"admin": [42]
            }
        }
    }
}

#i = ILoveNode.factory("User")
#i.create(user,graph)

#j = ILoveNode.factory("Plate")
#j.create(plate,graph)

#i = ILoveNode.factory("Restaurant")
#i.create(restaurant,graph)




#print json.dumps(p.toJson())
