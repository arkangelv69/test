/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="EntityController.ts" />

module ILovePlatos{

    declare var google:any;
    declare var Marker:any;

    export class MapController extends EntityController{
        static $inject = [
            "config",
            "RestaurantApirestService",
            "DateService",
            "$rootScope",
            "$stateParams",
            "$scope",
            "$state",
            "$element",
            "$sce",
            "auth",
            "store",
            "FilesService",
            "$q"
        ];

        map:any;
        rangeCircle:any;
        markers = [];
        contents:any;
        filters:any = {
            favorites:true,
            top:true,
            all:true
        };
        timeoutRange:any;
        favorites = [];
        top = [];
        restaurants = [];

        constructor($config,api,DateService,$rootScope,public $stateParams,public $scope,public $state,$element,$sce,auth,store,public FilesService, public $q){
            super($config,api,DateService,$rootScope,$stateParams,$scope,$state,$element,$sce,auth,store);

            var filters = this.store.get("filters");
            if(filters) {
                this.filters = filters;
            }
        }

        mapIncluded = false;

        setMapIncluded() {
            this.mapIncluded = true;            
        }
        
        isMapIncluded() {
            return this.mapIncluded;
        }

        getZoom() {
            var zoom = 16;
            if(this._main.position.range <= 0.5) {
                zoom = 16;
            }
            else if(this._main.position.range > 0.5 && this._main.position.range <= 0.9) {
                zoom = 15;
            }
            else if(this._main.position.range > 0.9 && this._main.position.range <= 1.4) {
                zoom = 14;
            }
            else if(this._main.position.range > 1.4 && this._main.position.range <= 2) {
                zoom = 13;
            }
            return zoom;
        }

        initMapInterval() {
            if(this._main.isSetLocation) {
                this.initMap();
            }else {
                var i = 0;
                var self = this;
                var interval = setInterval(function() {
                    if(i > 10) {
                        self._main.setLocation();
                    }
                    if(self._main.isSetLocation) {
                        self.initMap();
                        clearInterval(interval);
                    }
                    i++;
                },300);
            }
        }

        initMap() {
            var self = this;
            var minZoomLevel = 13;
            var zoom = this.getZoom();
            
            var lat = this._main.position.lat;
            var lng = this._main.position.lng;
            var myLatLng = {lat: lat, lng: lng};

            jQuery("#map").addClass("loading");

            var styles = [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#b5cbe4"}]},{"featureType":"landscape","stylers":[{"color":"#efefef"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#83a5b0"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#bdcdd3"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e3eed3"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}];

            var styledMap = new google.maps.StyledMapType(styles,
            {name: "Styled Map"});

            // Create a map object and specify the DOM element for display.
            this.map = new google.maps.Map(document.getElementById('map-layer'), {
              center: myLatLng,
              scrollwheel: false,
              disableDefaultUI: true, // a way to quickly hide all controls
              zoomControl: true,
              streetViewControl: true,
              zoom: zoom,
              mapTypeControlOptions: {
                  mapTypeIds: ['map_style']
              },
              //mapTypeId: google.maps.MapTypeId.ROADMAP,
              styles: [
                    {stylers: [{ visibility: 'simplified' }]},
                    //{elementType: 'labels', stylers: [{ visibility: 'off' }]}
                ]
            });

            this.map.mapTypes.set('map_style', styledMap);
            this.map.setMapTypeId('map_style');

            this.renderRangeCircle();

            this.getAll(function() {

                // Bounds for North America
                 var strictBounds = new google.maps.LatLngBounds(
                 new google.maps.LatLng(lat - 0.00001, lng - 0.00001),
                 new google.maps.LatLng(lat + 0.00001, lng + 0.00001));

                // Listen for the dragend event
                /*google.maps.event.addListener(self.map, 'dragend', function () {
                     if (strictBounds.contains(self.map.getCenter())) return;

                     // We're out of bounds - Move the map back within the bounds

                     var c = self.map.getCenter(),
                         x = c.lng(),
                         y = c.lat(),
                         maxX = strictBounds.getNorthEast().lng(),
                         maxY = strictBounds.getNorthEast().lat(),
                         minX = strictBounds.getSouthWest().lng(),
                         minY = strictBounds.getSouthWest().lat();

                     if (x < minX) x = minX;
                     if (x > maxX) x = maxX;
                     if (y < minY) y = minY;
                     if (y > maxY) y = maxY;

                     self.map.setCenter(new google.maps.LatLng(y, x));
                });*/

                // Limit the zoom level
                google.maps.event.addListener(self.map, 'zoom_changed', function () {
                     if (self.map.getZoom() < minZoomLevel) self.map.setZoom(minZoomLevel);
                });

                self.renderMarker();

                self.setMapIncluded();

                jQuery("#map").removeClass("loading");

            });
        }

        renderRangeCircle() {
            var lat = this._main.position.lat;
            var lng = this._main.position.lng;
            var myLatLng = {lat: lat, lng: lng};

            this.rangeCircle = new google.maps.Circle({
                  strokeColor: '#26a69a',
                  strokeOpacity: 0.6,
                  strokeWeight: 2,
                  fillColor: '#26a69a',
                  fillOpacity: 0.1,
                  map: this.map,
                  center: myLatLng,
                  radius: this._main.position.range * 1000
                });
        }

        renderMarker() {
            var self = this;
            angular.forEach(self.contents,function(restaurant,id) {

                var attributes = restaurant.data.attributes;
                var relationships = restaurant.data.relationships;

                if( 
                    (self.filters.all) ||
                    (!self.filters.all && self.filters.favorites && self.hasFavorites(restaurant.data)) ||
                    (!self.filters.all && self.filters.top && self.hasTop(restaurant.data)) &&
                    attributes.name && 
                    attributes.latitude && 
                    attributes.longitude
                ) {

                    var position = {lat: attributes.latitude, lng: attributes.longitude};
                    var title = attributes.name;
                    var favorites = relationships.favorites || [];
                    var top = relationships.top || [];
                    // Create a marker and set its position.
                    self.addMarker({
                        position:position,
                        title:title,
                        id:id,
                        favorites:favorites,
                        top:top
                    });
                }

            });
        }

        reloadMap() {
            this.rangeCircle.setRadius(this._main.position.range * 1000);
            this.map.setZoom(this.getZoom());
            this.map.setCenter(this._main.position.lat,this._main.position.lng);
            this.clearMarkers();
            this.renderMarker();
            this.store.set("filters",this.filters);
            this.store.set("range",this._main.position.range);
        }

        reloadRangeMap() {
            var self = this;
            clearTimeout(this.timeoutRange);
            this.timeoutRange = setTimeout(function() {
                console.log('pidiendo nuevos datos');
                self.getAll(function() {
                    self.reloadMap();
                });
            },400);
        }

        addMarker(params) {
            var self = this;

            var LOCATION = "M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z";
            var color = this.getColorMarkerForFilter(params);
            var classLabel = this.getClassLabelMarkerForFilter(params);

          var marker = new Marker({
            position: params.position,
            map: this.map,
            title: params.title,
            /*icon: {
                path: LOCATION,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '#000000',
                strokeWeight: 1,
                scale:2.5
            },*/
            icon: "/images/placeholder-for-map-"+color+".png"
            //map_icon_label: '<span class="map-icon '+classLabel+' "></span>'
          });

          var paramsUrl = {
            id:params.id,
            favorites:params.favorites,
            top:params.top
          };
          marker.addListener('click', function() {
            self.$state.go('card',paramsUrl);
          });

          this.markers.push(marker);
        }

        clearMarkers() {
          this.setMapOnAll(null);
        }

        setMapOnAll(map) {
          for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
          }
        }

        showMarkers() {
          this.setMapOnAll(this.map);
        }


        deleteMarkers() {
          this.clearMarkers();
          this.markers = [];
        }

        getColorMarkerForFilter(params) {
            //var color = "#90caf9"; 
            var color = "blue"; 
            if(this.filters.favorites && params && params.favorites && params.favorites.length > 0) {
                //color = "#66bb6a";
                color = "green";
            }
            else if(this.filters.top && params && params.top && params.top.length > 0) {
                //color = "#ffeb3b";
                color = "yellow";
            }
            /*else if(this.filters.top || this.filters.favorites) {
                color = '#e0e0e0';
            }*/

            return color;
        }

        getClassLabelMarkerForFilter(params) {
            var classLabel = "";
            if(this.filters.favorires && params && params.favorites && params.favorites.length > 0) {
                classLabel += " map-icon-favorites";
            }
            if(this.filters.top && params && params.top && params.top.length > 0) {
                var numberPlatesInTop = 0;
                angular.forEach(params.top,function(top,index) {
                    if(top && top.data.attributes && top.data.attributes.ranking == 1) {
                        classLabel += " map-icon-ranking-1";
                        numberPlatesInTop++;
                    }
                    else if(top && top.data.attributes && top.data.attributes.ranking == 2) {
                        classLabel += " map-icon-ranking-2";
                        numberPlatesInTop++;
                    }
                    else if(top && top.data.attributes && top.data.attributes.ranking == 3) {
                        classLabel += " map-icon-ranking-3";
                        numberPlatesInTop++;
                    }
                });
                if(numberPlatesInTop > 0) {
                    classLabel += " map-icon-ranking-plates-"+numberPlatesInTop;
                }

                return classLabel;
            }
        }

        hasFavorites(restaurant) {
            if(restaurant && restaurant.relationships && restaurant.relationships.favorites && restaurant.relationships.favorites.length > 0) {
                return true;
            }
            return false;
        }

        hasTop(restaurant) {
            if(restaurant && restaurant.relationships && restaurant.relationships.top && restaurant.relationships.top.length > 0) {
                return true;
            }
            return false;
        }

        getAll(callback) {
            var self = this;
            this.api.getAll(this._main.position.lat,this._main.position.lng,this._main.position.range*1,this._user.deviceId).then((contents: iEntityApirest) => {
                
                if(contents.data) {
                    self.contents = contents.data;

                    self.setFavorites();
                    self.setTop();
                    self.setRestaurants();
                }

                callback();

            });

            return false;
        }

        setFavorites() {
            var self = this;
            this.favorites = [];
            if(self.contents) {
                angular.forEach(self.contents,function(restaurant,id) {
                    if(restaurant.data && restaurant.data.relationships && restaurant.data.relationships.favorites && restaurant.data.relationships.favorites.length > 0) {
                        angular.forEach(restaurant.data.relationships.favorites,function(favorite,index) {
                            favorite.data.attributes.restaurantId = id;
                            self.favorites.push(favorite.data);
                        });
                    }
                });
            }
        }

        setTop() {
            var self = this;
            this.top = [];
            if(self.contents) {
                angular.forEach(self.contents,function(restaurant,id) {
                    if(restaurant.data && restaurant.data.relationships && restaurant.data.relationships.top && restaurant.data.relationships.top.length > 0) {
                        angular.forEach(restaurant.data.relationships.top,function(top,index) {
                            top.data.attributes.restaurantId = id;
                            self.top.push(top.data);
                        });
                    }
                });
            }
        }

        setRestaurants() {
            var self = this;
            this.restaurants = [];
            if(self.contents) {
                angular.forEach(self.contents,function(restaurant,id) {
                    restaurant.data.attributes.restaurantId = id;
                    self.restaurants.push(restaurant.data);
                });
            }
        }

        haveFavorites() {
            if(this.favorites && this.favorites.length > 0) {
                return true;
            }
            return false;
        }

        haveTop() {
            if(this.top && this.top.length > 0) {
                return true;
            }
            return false;
        }

        haveRestaurants() {
            if(this.restaurants && this.restaurants.length > 0) {
                return true;
            }
            return false;
        }

        initMapTabs(selector) {
            setTimeout(function() {
                $(selector).tabs();
            },50);
        }

    }

}