from py2neo.ogm import GraphObject, Property, RelatedFrom, RelatedTo

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

class Plate(GraphObject):

    type = "Plate"
    name = Property()
    description = Property()
    image = Property()

    liked = RelatedFrom("User", "LIKED")
    have_plate_menu = RelatedFrom("Menu", "HAVE_PLATE")
    have_plate_restaurant = RelatedFrom("Restaurant", "HAVE_PLATE")

    def toJson(self):
        plate = {
            "links": {
                "self": "http://iloveplatos/plate/" + str(self.__primaryvalue__)
            },
            "data": {
                "type": self.__primarylabel__,
                "id": self.__primaryvalue__,
                "attributes": {
                    "name": self.name,
                    "description": self.description,
                    "image": self.image
                }
            }
        }

        return plate

    def create(self,json,g):
        for attribute, value in json["data"]["attributes"].iteritems():
            setattr(self,attribute,value)

        for restaurantId in json["relationships"]["relatedFrom"]["have_plate_restaurant"]:
            restaurant = Restaurant.select(g,restaurantId).first()
            self.have_plate_restaurant.add(restaurant)

        g.push(self)

    def update(self,json,g):
        for attribute, value in json["data"]["attributes"].iteritems():
            setattr(self,attribute,value)

        #Pendiente ver si en el update hay que actualizar las relaciones
        """for restaurantId in json["relationships"]["relatedFrom"]["have_menu"]:
            restaurant = Restaurant.select(g,restaurantId).first()
            self.have_menu.add(restaurant)"""

        g.push(self)

    def delete(self,g):
        g.delete(self)

    def getLikes(self):
        return len(self.liked)

    def addLike(self,userId,g):
        user = User.select(g,userId).first()
        self.liked.add(user)
        g.push(self)

""" MENU """

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
        for attribute, value in json["data"]["attributes"].iteritems():
            setattr(self,attribute,value)

        for restaurantId in json["relationships"]["relatedFrom"]["have_menu"]:
            restaurant = Restaurant.select(g,restaurantId).first()
            self.have_menu.add(restaurant)

        """for plateId in json["relationships"]["relatedTo"]["have_plate"]["entrantes"]:
            plate = Plate.select(g,plateId).first()
            self.have_plate.add(plate,"tipo"=a)

        for plateId in json["relationships"]["relatedTo"]["have_plate"]["primeros"]:
            plate = Plate.select(g,plateId).first()
            self.have_plate.add(plate)"""

        g.push(self)

    def update(self,json,g):
        for attribute, value in json["data"]["attributes"].iteritems():
            setattr(self,attribute,value)

        #Pendiente ver si en el update hay que actualizar las relaciones
        """for restaurantId in json["relationships"]["relatedFrom"]["have_menu"]:
            restaurant = Restaurant.select(g,restaurantId).first()
            self.have_menu.add(restaurant)"""

        g.push(self)

    def delete(self,g):
        g.delete(self)

    def toJson(self):
        menu = {
            "links": {
                "self": "http://iloveplatos/menu/" + str(self.__primaryvalue__)
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

        return menu

class User(GraphObject):

    type = "User"
    name = Property()
    email = Property()
    role = Property()
    deviceId = Property()
    image = Property()

    liked = RelatedTo("Plate", "LIKED")
    admin = RelatedTo("Restaurant", "ADMIN")

    def toJson(self):
        user = {
            "links": {
                "self": "http://iloveplatos/plate/" + str(self.__primaryvalue__)
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
        for attribute, value in json["data"]["attributes"].iteritems():
            setattr(self,attribute,value)
        g.push(self)


    def update(self, json, g):
        for attribute, value in json["data"]["attributes"].iteritems():
            setattr(self, attribute, value)
        g.push(self)

    def delete(self,g):
        g.delete(self)

class Restaurant(GraphObject):

    type = "Restaurant"
    name = Property()
    description = Property()
    image = Property()
    latitude = Property()
    longitude = Property()
    address = Property()

    have_menu = RelatedTo("Menu", "HAVE_MENU")
    have_plate = RelatedTo("Plate", "HAVE_PLATE")
    admin = RelatedFrom("User", "ADMIN")

    def create(self,json,g):
        for attribute, value in json["data"]["attributes"].iteritems():
            setattr(self,attribute,value)

        for userId in json["relationships"]["relatedFrom"]["admin"]:
            user = User.select(g,userId).first()
            self.admin.add(user)

        g.push(self)


    def delete(self,g):
        g.delete(self)

    def toJson(self):
        restaurant = {
            "links": {
                "self": "http://iloveplatos/restaurant/" + str(self.__primaryvalue__)
            },
            "data": {
                "type": self.__primarylabel__,
                "id": self.__primaryvalue__,
                "attributes": {
                    "name": self.name,
                    "description": self.description,
                    "image": self.image,
                    "latitude": self.latitude,
                    "longitude": self.longitude,
                    "address": self.address
                }
            }
        }
        return restaurant