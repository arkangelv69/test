from py2neo.ogm import GraphObject, Property, RelatedFrom

class Restaurant(GraphObject):
    __primarykey__ = "name"

    name = Property("NOMBREPRUEBA2")
    desription = Property("PROPERTYPRUEBA2")

    actors = RelatedFrom("Menu", "HAVE")

class User(GraphObject):
    __primarykey__ = "name"

    name = Property()
    email = Property()
