/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />

/// <reference path="config.ts" />
/// <reference path="injectors/ConfigInject.ts" />
/// <reference path="injectors/RunInject.ts" />
/// <reference path="controllers/MainController.ts" />
/// <reference path="controllers/UserController.ts" />
/// <reference path="controllers/homes/HomeController.ts" />
/// <reference path="controllers/homes/HomeCardController.ts" />
/// <reference path="controllers/homes/HomeRestaurantController.ts" />
/// <reference path="controllers/homes/HomePlateController.ts" />
/// <reference path="controllers/homes/HomeMenuController.ts" />

/// <reference path="controllers/entities/MapController.ts" />
/// <reference path="controllers/entities/CardController.ts" />
/// <reference path="controllers/entities/RestaurantController.ts" />
/// <reference path="controllers/entities/PlateController.ts" />
/// <reference path="controllers/entities/MenuController.ts" />

// <reference path="controllers/entities/PerfilController.ts" />

/// <reference path="controllers/data/DataJsonController.ts" />

/// <reference path="services/RestaurantApirestService.ts" />
/// <reference path="services/PlateApirestService.ts" />
/// <reference path="services/MenuApirestService.ts" />
/// <reference path="services/PerfilApirestService.ts" />
/// <reference path="services/DateService.ts" />

/// <reference path="services/modules/files/service.ts" />

/// <reference path="directives/scrollDirective.ts" />
/// <reference path="directives/modules/fileimage/directive.ts" />
/// <reference path="directives/modules/map/map.ts" />

/// <reference path="filters/GeneralFilter.ts" />

var ILovePlatosApp:any = {};
var Cropper:any;
var basePath;

module ILovePlatos{
    'use strict';

    declare var translationsEN_EN:any;
    declare var translationsES_ES:any;
    declare var configILovePlatos:any;

    // App ILovePlatos.
    ILovePlatosApp = angular.module("ILovePlatos", [
        'ui.router',
        'pascalprecht.translate',
        'ngSanitize',
        'ngAnimate',
        'ngCookies',
        //'anim-in-out',
        'auth0',
        'angular-storage',
        'angular-jwt',
        'ngCordova',
        //'angular-flippy',
        'angular-progress-button-styles',
        'ngMeta'
    ])
        //Config
        .factory('httpRequestInterceptor', ["store", function(store) {
          return {
            request: function (config) {

                var token = null;

                var idToken = store.get('token');
                var refreshToken = store.get('refreshToken');

                if(idToken && !refreshToken) {
                  store.remove('profile');
                  store.remove('token');
                  store.remove('refreshToken');
                  var url = window.location;
                  location.reload();
                }
                else if (!idToken || !refreshToken) {
                  token = null;
                }
                else {
                  token = idToken;
                }

                if(token) {
                    config.headers['Authorization'] = 'Bearer '+token;
                }

              return config;
            }
          };
        }])
        .config(ConfigInject)
        .constant('config',configILovePlatos)
        .run(RunInject)
        // controllers
        .controller("MainController", MainController)
        .controller("UserController", UserController)
        // controllers.home
        .controller("HomeController", HomeController)
        .controller("HomeCardController", HomeCardController)
        .controller("HomeRestaurantController", HomeRestaurantController)
        .controller("HomePlateController", HomePlateController)
        .controller("HomeMenuController", HomeMenuController)
        // controllers.entidades
        .controller("MapController", MapController)
        .controller("CardController", CardController)
        .controller("RestaurantController", RestaurantController)
        .controller("PlateController", PlateController)
        .controller("MenuController", MenuController)
        //.controller("PerfilController", PerfilController)
        //cotroller.modules
        // service service
        .service("RestaurantApirestService", RestaurantApirestService)
        .service("PlateApirestService", PlateApirestService)
        .service("MenuApirestService", MenuApirestService)
        .service("PerfilApirestService", PerfilApirestService)
        .service("FilesService", FilesService)
        .service("DateService", DateService)
        //Directives
        .directive('scroll', Scroll)
        .directive('fileimage', FileImageDirective)
        .directive('map', ['$compile','$http', '$templateCache',MapDirective])
        //Modulos
        //Filter
        .filter('excerpt', Excerpt)
        .filter('stringdate', ["$filter","DateService",StringDate])
        .filter('reverse', Reverse)
        .filter('hextorgb', HexToRgb)
        .filter('minusculas', Minusculas)
        .filter('clean', Clean)
        .filter('concatenar', Concatenar);

}