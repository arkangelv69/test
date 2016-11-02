from py2neo.ogm import GraphObject, Property, RelatedFrom, RelatedTo
import os
import usersauth

class ILoveNode(GraphObject):
    # Create based on class name:
    def factory(type):
        #return eval(type + "()")
        if type == "User": return User()
        if type == "Plate": return Plate()
        if type == "Restaurant": return Restaurant()
        if type == "Menu": return Menu()
        assert 0, "Bad shape creation: " + type
    factory = staticmethod(factory)






###############################################################
#                       USER                                  #
###############################################################
"""

                                            USER

"""





class User(GraphObject):

    type = "User"
    name = ""
    email = ""
    role = ""
    deviceId = Property()
    image = ""

    liked = RelatedTo("Plate", "LIKED")
    admin = RelatedTo("Restaurant", "ADMIN")

    def toJson(self):
        user = {
            "links": {
                "self": "http://"+os.getenv("HOSTAPI","localhost")+":5000/private/plate/" + str(self.__primaryvalue__)
            },
            "data": {
                "type": self.__primarylabel__,
                "id": self.__primaryvalue__,
                "attributes": {
                    "name": self.name,
                    "email": self.email,
                    "role": self.role,
                    "deviceId": self.deviceId,
                    "image":self.image
                }
            }
        }

        return user

    def create(self,json,g):
        #for attribute, value in json["data"]["attributes"].items():
        #    setattr(self,attribute,value)
        setattr(self, "deviceId", json["data"]["attributes"]["deviceId"])
        g.push(self)
        usersauth.createUser(self.__primaryvalue__,json["data"]["attributes"]["deviceId"])


    def update(self, json, g):
        for attribute, value in json["data"]["attributes"].items():
            setattr(self, attribute, value)
        g.push(self)

    def delete(self,g):
        g.run("MATCH (n:" + self.type + ") WHERE ID(n) = " + str(self.__primaryvalue__) + " optional match (n)-[r]-() "" \
                                "" delete r,n")

    def getRestaurants(self):
        restaurants = {}
        for restaurant in self.admin:
            restaurants["r_"+str(restaurant.__primaryvalue__)]=restaurant.toJson()
        return restaurants

    def getMenus(self):
        menus = {}
        for restaurant in self.admin:
            for menu in restaurant.have_menu:
                menus["m_"+str(menu.__primaryvalue__)]=menu.toJson()
        return menus

    def getPlates(self):
        plates = {}
        for restaurant in self.admin:
            for plate in restaurant.have_plate:
                plates["m_"+str(plate.__primaryvalue__)]=plate.toJson()
        return plates




###############################################################
#                       RESTAURANT                            #
###############################################################

"""

                                            RESTAURANT

"""




class Restaurant(GraphObject):

    type = "Restaurant"
    name = Property()
    description = Property()
    image_original = Property()
    image_main= Property()
    image_square = Property()
    image_landscape = Property()
    latitude = Property()
    longitude = Property()
    address = Property()

    have_menu = RelatedTo("Menu", "HAVE_MENU")
    have_plate = RelatedTo("Plate", "HAVE_PLATE")
    admin = RelatedFrom("User", "ADMIN")

    def create(self,json,g):
        for attribute, value in json["data"]["attributes"].items():
            if (attribute == "images"):
                #for nameImage, image in json["data"]["attributes"]["images"].items():
                setattr(self, "image_original", json["data"]["attributes"]["images"]["original"]["url"])
                setattr(self, "image_main", json["data"]["attributes"]["images"]["thumbnails"]["main"]["url"])
                setattr(self, "image_square", json["data"]["attributes"]["images"]["thumbnails"]["square"]["url"])
                setattr(self, "image_landscape", json["data"]["attributes"]["images"]["thumbnails"]["landscape"]["url"])
            else:
                setattr(self,attribute,value)

        for userId in json["data"]["relationships"]["relatedFrom"]["admin"]:
            user = User.select(g,userId).first()
            self.admin.add(user)

        g.push(self)
        """TODO: Add without match"""
        g.run("MATCH (r:Restaurant) WHERE ID(r)= "+str(self.__primaryvalue__)+" WITH collect(r) as restaurants "" \
                ""CALL spatial.addNodes('Restaurants',restaurants) YIELD node RETURN count(*)")

    def update(self, json, g):
        for attribute, value in json["data"]["attributes"].items():
            if (attribute == "images"):
                #for nameImage, image in json["data"]["attributes"]["images"].items():
                setattr(self, "image_original", json["data"]["attributes"]["images"]["original"]["url"])
                setattr(self, "image_main", json["data"]["attributes"]["images"]["thumbnails"]["main"]["url"])
                setattr(self, "image_square", json["data"]["attributes"]["images"]["thumbnails"]["square"]["url"])
                setattr(self, "image_landscape", json["data"]["attributes"]["images"]["thumbnails"]["landscape"]["url"])
            else:
                setattr(self,attribute,value)
        g.push(self)

    def delete(self,g):
        g.run("MATCH (n:" + self.type + ") WHERE ID(n) = " + str(self.__primaryvalue__) + " optional match (n)-[r]-() "" \
                                "" delete r,n")

    def getMenus(self):
        return self.have_menu

    def toJson(self):
        restaurant = {
            "links": {
                "self": "http://"+os.getenv("HOSTAPI","localhost")+":5000/private/restaurant/" + str(self.__primaryvalue__)
            },
            "data": {
                "type": self.__primarylabel__,
                "id": self.__primaryvalue__,
                "attributes": {
                    "name": self.name,
                    "description": self.description,
                    "images": {
                        "type": "images",
                        "original": {
                            "url":self.image_original
                        },
                        "thumbnails":{
                            "main":{
                                "url": self.image_main
                            },
                            "square": {
                                "url": self.image_square
                            },
                            "landscape": {
                                "url": self.image_landscape
                            }
                        }
                    },
                    "latitude": self.latitude,
                    "longitude": self.longitude,
                    "address": self.address
                }
            }
        }
        return restaurant

    @staticmethod
    def nodeToJson(id,node):
        restaurant = {
            "links": {
                "self": "http://" + os.getenv("HOSTAPI", "localhost") + ":5000/private/restaurant/" + str(id)
            },
            "data": {
                "type": "Restaurant",
                "id": id,
                "attributes": {
                    "name": node["name"],
                    "description": node["description"],
                    "images": {
                        "type": "images",
                        "original": {
                            "url": node["image_original"]
                        },
                        "thumbnails":{
                            "main":{
                                "url": node["image_main"]
                            },
                            "square": {
                                "url": node["image_square"]
                            },
                            "landscape": {
                                "url": node["image_landscape"]
                            }
                        }
                    },
                    "latitude": node["latitude"],
                    "longitude": node["longitude"],
                    "address": node["address"]
                },
                "relationships": {
                    "top": [],
                    "favorites": []
                }
            }
        }
        return restaurant





###############################################################
#                       MENU                                  #
###############################################################
"""

                                            MENU

"""




class Menu(GraphObject):

    type = "Menu"
    name = Property()
    description = Property()
    image = Property()
    price = Property()
    bread = Property()
    wine = Property()
    dessert = Property()
    coffe = Property()
    daily = Property()
    scheduled = Property()

    have_plate = RelatedTo("Plate", "HAVE_PLATE")
    have_menu = RelatedFrom("Restaurant", "HAVE_MENU")

    def create(self,json,g):
        for attribute, value in json["data"]["attributes"].items():
            setattr(self,attribute,value)

        for restaurantId in json["data"]["relationships"]["relatedFrom"]["have_menu"]:
            restaurant = Restaurant.select(g,restaurantId).first()
            self.have_menu.add(restaurant)

        """for plateId in json["data"]["relationships"]["relatedTo"]["have_plate"]["entrantes"]:
            plate = Plate.select(g,plateId).first()
            self.have_plate.add(plate,"tipo"=a)

        for plateId in json["data"]["relationships"]["relatedTo"]["have_plate"]["primeros"]:
            plate = Plate.select(g,plateId).first()
            self.have_plate.add(plate)"""

        g.push(self)

    def update(self,json,g):
        for attribute, value in json["data"]["attributes"].items():
            setattr(self,attribute,value)

        #Pendiente ver si en el update hay que actualizar las relaciones
        """for restaurantId in json["data"]["relationships"]["relatedFrom"]["have_menu"]:
            restaurant = Restaurant.select(g,restaurantId).first()
            self.have_menu.add(restaurant)"""

        g.push(self)

    def delete(self,g):
        g.run("MATCH (n:"+self.type+") WHERE ID(n) = " + str(self.__primaryvalue__) + " optional match (n)-[r]-() "" \
                        "" delete r,n")

    def getPlates(self):
        return self.have_plate

    def toJson(self):
        menu = {
            "links": {
                "self": "http://"+os.getenv("HOSTAPI","localhost")+":5000/private/menu/" + str(self.__primaryvalue__)
            },
            "data": {
                "type": self.__primarylabel__,
                "id": self.__primaryvalue__,
                "attributes": {
                    "name": self.name,
                    "description": self.description,
                    "image": self.image,
                    "price": self.price,
                    "bread": self.bread,
                    "wine": self.wine,
                    "dessert": self.dessert,
                    "coffe": self.coffe,
                    "daily": self.daily,
                    "scheduled": self.image
                }
            }
        }

        menu["data"]["relationships"]={}
        menu["data"]["relationships"]["first"] = []
        menu["data"]["relationships"]["second"] = []
        menu["data"]["relationships"]["dessert"] = []
        menu["data"]["relationships"]["incoming"] = []

        for p in self.have_plate:
            menu["data"]["relationships"][self.have_plate.get(p,"type")].append(p.toJson())

        return menu




###############################################################
#                       PLATE                                 #
###############################################################
"""

                                            PLATE

"""




class Plate(GraphObject):

    type = "Plate"
    name = Property()
    description = Property()
    image_original = Property()
    image_square = Property()
    image_landscape = Property()

    liked = RelatedFrom("User", "LIKED")
    have_plate_menu = RelatedFrom("Menu", "HAVE_PLATE")
    have_plate_restaurant = RelatedFrom("Restaurant", "HAVE_PLATE")

    @staticmethod
    def nodeToJson(id,node,**kwargs):
        plate = {
            "links": {
                "self": "http://" + os.getenv("HOSTAPI", "localhost") + ":5000/private/plate/" + str(id)
            },
            "data": {
                "type": "Plate",
                "id": id,
                "attributes": {
                    "name": node["name"],
                    "description": node["description"],
                    "images": {
                        "type": "images",
                        "original": {
                            "url": node["image_original"]
                        },
                        "thumbnails": {
                            "square": {
                                "url": node["image_square"]
                            },
                            "landscape": {
                                "url": node["image_landscape"]
                            }
                        }
                    }
                }
            }
        }
        for k, v in kwargs.items():
            plate["data"]["attributes"][k] = v
        return plate

    def toJson(self):
        plate = {
            "links": {
                "self": "http://"+os.getenv("HOSTAPI","localhost")+":5000/private/plate/" + str(self.__primaryvalue__)
            },
            "data": {
                "type": self.__primarylabel__,
                "id": self.__primaryvalue__,
                "attributes": {
                    "name": self.name,
                    "description": self.description,
                    "images": {
                        "type": "images",
                        "original": {
                            "url":self.image_original
                        },
                        "thumbnails":{
                            "square": {
                                "url": self.image_square
                            },
                            "landscape": {
                                "url": self.image_landscape
                            }
                        }
                    }
                }
            }
        }

        return plate

    def create(self,json,g):
        for attribute, value in json["data"]["attributes"].items():
            if (attribute == "images"):
                #for nameImage, image in json["data"]["attributes"]["images"].items():
                setattr(self, "image_original", json["data"]["attributes"]["images"]["original"]["url"])
                setattr(self, "image_square", json["data"]["attributes"]["images"]["thumbnails"]["square"]["url"])
                setattr(self, "image_landscape", json["data"]["attributes"]["images"]["thumbnails"]["landscape"]["url"])
            else:
                setattr(self,attribute,value)

        for restaurantId in json["data"]["relationships"]["relatedFrom"]["have_plate_restaurant"]:
            restaurant = Restaurant.select(g,restaurantId).first()
            self.have_plate_restaurant.add(restaurant)

        g.push(self)

    def update(self,json,g):
        for attribute, value in json["data"]["attributes"].items():
            if (attribute == "images"):
                #for nameImage, image in json["data"]["attributes"]["images"].items():
                setattr(self, "image_original", json["data"]["attributes"]["images"]["original"]["url"])
                setattr(self, "image_square", json["data"]["attributes"]["images"]["thumbnails"]["square"]["url"])
                setattr(self, "image_landscape", json["data"]["attributes"]["images"]["thumbnails"]["landscape"]["url"])
            else:
                setattr(self,attribute,value)

        #Pendiente ver si en el update hay que actualizar las relaciones
        """for restaurantId in json["data"]["relationships"]["relatedFrom"]["have_menu"]:
            restaurant = Restaurant.select(g,restaurantId).first()
            self.have_menu.add(restaurant)"""

        g.push(self)

    def delete(self,g):
        g.run("MATCH (n:" + self.type + ") WHERE ID(n) = " + str(self.__primaryvalue__) + " optional match (n)-[r]-() "" \
                                "" delete r,n")

    def getLikes(self):
        return len(self.liked)

    def addLike(self,userId,g):
        user = User.select(g,userId).first()
        self.liked.add(user)
        g.push(self)


class TodayLove:
    restaurants = {"data":{}}

    def getToday(self,lat,lon,r,deviceId,graph):
        self.restaurants = {"data":{}}

        cursor = graph.run(
            "CALL spatial.withinDistance('Restaurants', {latitude:" + lat + ",longitude:" + lon + "}, " + r + ") YIELD node AS r RETURN ID(r) as restaurantId, r").data()
        for restaurant in cursor:
            self.restaurants["data"]["r_" + str(restaurant["restaurantId"])] = Restaurant.nodeToJson(
                restaurant["restaurantId"], restaurant["r"])

        cypherQuery = "CALL spatial.withinDistance('Restaurants', {latitude:" + lat + ",longitude:" + lon + "}, " + r + ") YIELD node AS r"" \
            ""MATCH (r)-[:HAVE_MENU{active:true}]->(m)-[]->(p)<-[x:LIKED]-(u:User)"" \
            ""RETURN ID(r) as restaurantId, ID(p) as plateId, p, COUNT(x) as points"" \
            ""ORDER BY COUNT(x) DESC"" \
            ""LIMIT 10"
        cursor = graph.run(cypherQuery).data()

        i = 1
        for record in cursor:
            jsonIdRestaurant = "r_" + str(record["restaurantId"])
            self.restaurants["data"][jsonIdRestaurant]["data"]["relationships"]["top"].append(
                Plate.nodeToJson(record["plateId"], record["p"], points=record["points"], ranking=i)
            )
            i = i + 1

        cypherQuery = "CALL spatial.withinDistance('Restaurants', {latitude:" + lat + ",longitude:" + lon + "}, " + r + ") YIELD node AS r"" \
                ""MATCH (r)-[:HAVE_MENU{active:true}]->(m)-[]->(p)<-[x:LIKED]-(u:User{deviceId:" + deviceId + "})"" \
                ""RETURN ID(r) as restaurantId, ID(p) as plateId,p"

        cursor = graph.run(cypherQuery).data()

        for record in cursor:
            jsonIdRestaurant = "r_" + str(record["restaurantId"])
            self.restaurants["data"][jsonIdRestaurant]["data"]["relationships"]["favorites"].append(
                Plate.nodeToJson(record["plateId"], record["p"])
            )

        return self.restaurants

    def getRestaurant(self,graph,restaurantId,json={"top":[],"favorites":[]}):
        restaurant = {}

        i = Restaurant.select(graph, restaurantId).first()
        restaurant = i.toJson()
        restaurant["data"]["relationships"]={}
        restaurant["data"]["relationships"]["menus"]={}

        menus = i.getMenus()
        for m in menus:
            restaurant["data"]["relationships"]["menus"]["m_"+str(m.__primaryvalue__)] = m.toJson()

        restaurant["data"]["relationships"]["top"] = []
        restaurant["data"]["relationships"]["favorites"] = []

        for attribute, value in json.items():
            for i in value:
                p = Plate.select(graph, i).first()
                restaurant["data"]["relationships"][attribute].append(p.toJson())

        return restaurant