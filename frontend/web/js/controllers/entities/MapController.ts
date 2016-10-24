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
        markers = [];
        contents:any;
        filters:any = {
            favorites:true,
            top:true,
            all:true
        };
        timeoutRange:any;

        constructor($config,api,DateService,$rootScope,public $stateParams,public $scope,public $state,$element,$sce,auth,store,public FilesService, public $q){
            super($config,api,DateService,$rootScope,$stateParams,$scope,$state,$element,$sce,auth,store);

            var filters = this.store.get("filters");
            if(filters) {
                this.filters = filters;
            }
        }

        initMap() {
            var self = this;
            var minZoomLevel = 15;
            var lat = this._main.position.lat;
            var lng = this._main.position.lng;
            var myLatLng = {lat: lat, lng: lng};

            // Create a map object and specify the DOM element for display.
            this.map = new google.maps.Map(document.getElementById('map-layer'), {
              center: myLatLng,
              scrollwheel: false,
              disableDefaultUI: true, // a way to quickly hide all controls
              zoomControl: true,
              streetViewControl: true,
              zoom: minZoomLevel,
              //mapTypeId: google.maps.MapTypeId.ROADMAP,
              styles: [
                    {stylers: [{ visibility: 'simplified' }]},
                    //{elementType: 'labels', stylers: [{ visibility: 'off' }]}
                ]
            });


            this.getAll(function() {

                // Bounds for North America
                 var strictBounds = new google.maps.LatLngBounds(
                 new google.maps.LatLng(lat - 0.00001, lng - 0.00001),
                 new google.maps.LatLng(lat + 0.00001, lng + 0.00001));

                // Listen for the dragend event
                google.maps.event.addListener(self.map, 'dragend', function () {
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
                });

                // Limit the zoom level
                google.maps.event.addListener(self.map, 'zoom_changed', function () {
                     if (self.map.getZoom() < minZoomLevel) self.map.setZoom(minZoomLevel);
                });

                self.renderMarker();

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
            icon: {
                path: LOCATION,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '',
                strokeWeight: 0,
                scale:2.5
            },
            map_icon_label: '<span class="map-icon '+classLabel+' "></span>'
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
            var color = "#90caf9"; 
            if(this.filters.favorites && params && params.favorites && params.favorites.length > 0) {
                color = "#66bb6a";
            }
            else if(this.filters.top && params && params.top && params.top.length > 0) {
                color = "#d4e157";
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
            this.api.getAll(this._main.position.lat,this._main.position.lng,this._main.position.range,this._user.deviceId).then((contents: iEntityApirest) => {
                
                if(contents.data) {
                    self.contents = contents.data;
                }

                callback();

            });

            return false;
        }

        isHome() {
            if(this.$state.current.name == 'home' || this.$state.current.name == 'home.inicio' || this.$state.current.name == ''){
                return true;
            }else {
                return false;
            }
        }

    }

}