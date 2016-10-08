import json
from py2neo import Graph
import test
from py2neo.ogm import GraphObject, Property, RelatedFrom, RelatedTo

class Plate(GraphObject):

    type = "Plate"
    name = Property()
    description = Property()

    liked = RelatedFrom("User", "LIKED")
    have_plate_menu = RelatedFrom("Menu", "HAVE_PLATE")
    have_plate_restaurant = RelatedFrom("Restaurant", "HAVE_PLATE")

    def toJson(self):
        plate = {
            "links": {
                "self": "http://iloveplatos/plate/" + self.name
            },
            "data": {
                "type": "Plate",
                "id": self.name,
                "attributes": {
                    "name": self.name,
                    "description": self.description
                }
            }
        }

        return plate