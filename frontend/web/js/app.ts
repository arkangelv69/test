/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />
/// <reference path="../typings/parse/parse.d.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angular-ui-router/angular-ui-router.d.ts" />

/// <reference path="config.ts" />
/// <reference path="injectors/ConfigInject.ts" />
/// <reference path="injectors/RunInject.ts" />
/// <reference path="controllers/MainController.ts" />
/// <reference path="controllers/UserController.ts" />
/// <reference path="controllers/homes/HomeController.ts" /> />
/// <reference path="controllers/homes/DetailContenidoController.ts" />
/// <reference path="controllers/homes/HomeNotFoundController.ts" />

/// <reference path="controllers/entities/EntityController.ts" />
/// <reference path="controllers/entities/ContenidoController.ts" />

/// <reference path="controllers/modals/PerfilModalController.ts" />

/// <reference path="controllers/data/DataJsonController.ts" />

/// <reference path="services/EntityApirestService.ts" />
/// <reference path="services/ContenidoApirestService.ts" />
/// <reference path="services/DateService.ts" />

/// <reference path="services/modules/files/service.ts" />

/// <reference path="directives/scrollDirective.ts" />

/// <reference path="filters/GeneralFilter.ts" />

var ILovePlatosApp:any = {};
var Cropper:any;
var basePath;

module ILovePlatos{
    'use strict';

    declare var translationsEN_EN:any;
    declare var translationsES_ES:any;
    declare var configBuho:any;

    // App ILovePlatos.
    ILovePlatosApp = angular.module("ILovePlatos", [
        'ui.router',
        'pascalprecht.translate',
        'ngSanitize',
        'ngAnimate',
        'ngCookies',
        'anim-in-out',
        'auth0',
        'angular-storage',
        'angular-jwt',
        'ngCordova',
        'angular-flippy',
        'angular-progress-button-styles'
    ])
        //Config
        .config(ConfigInject)
        .constant('config',configBuho)
        .run(RunInject)
        // controllers
        .controller("MainController", MainController)
        .controller("UserController", UserController)
        // controllers.home
        .controller("HomeController", HomeController)
        .controller("DetailContenidoController", DetailContenidoController)
        .controller("HomeNotFoundController", HomeNotFoundController)
        //Controller modals
        .controller("PerfilModalController", PerfilModalController)
        // controllers.entidades
        .controller("ContenidoController", ContenidoController)
        //cotroller.modules
        // service service
        .service("ContenidoApirestService", ContenidoApirestService)
        .service("FilesService", FilesService)
        .service("DateService", DateService)
        //Directives
        .directive('scroll', Scroll)
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