/// <reference path="../../../typings/angularjs/angular.d.ts" />

module ILovePlatos{

    declare var google:any;

    export class MapController {
        static $inject = [
            "config",
        ];

        constructor(public $config) {
        }

        init() {
            $(".button-collapse").sideNav();
        }

        initMap() {
            var minZoomLevel = 15;
            var lat = 40.4284285;
            var lng = -3.5306863;
            var myLatLng = {lat: lat, lng: lng};

            // Create a map object and specify the DOM element for display.
            var map = new google.maps.Map(document.getElementById('map-layer'), {
              center: myLatLng,
              scrollwheel: false,
              disableDefaultUI: true, // a way to quickly hide all controls
              zoomControl: true,
              streetViewControl: true,
              zoom: minZoomLevel
            });

            // Create a marker and set its position.
            var marker = new google.maps.Marker({
              map: map,
              position: myLatLng,
              title: 'Hello World!'
            });

            // Bounds for North America
             var strictBounds = new google.maps.LatLngBounds(
             new google.maps.LatLng(lat - 0.00001, lng - 0.00001),
             new google.maps.LatLng(lat + 0.00001, lng + 0.00001));

            // Listen for the dragend event
            google.maps.event.addListener(map, 'dragend', function () {
                 if (strictBounds.contains(map.getCenter())) return;

                 // We're out of bounds - Move the map back within the bounds

                 var c = map.getCenter(),
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

                 map.setCenter(new google.maps.LatLng(y, x));
            });

            // Limit the zoom level
            google.maps.event.addListener(map, 'zoom_changed', function () {
                 if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
            });

            marker.addListener('click', function() {
              console.log(this);
            });
        }

    }

}