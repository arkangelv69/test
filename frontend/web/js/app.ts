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
/// <reference path="controllers/homes/HomeController.ts" />
/// <reference path="controllers/homes/HomeContenidoByCategoriaController.ts" />
/// <reference path="controllers/homes/HomeContenidoByTagController.ts" />
/// <reference path="controllers/homes/HomeContenidoByHashtagController.ts" />
/// <reference path="controllers/homes/HomeComentariosByContenidoController.ts" />
/// <reference path="controllers/homes/HomeCategoriasController.ts" />
/// <reference path="controllers/homes/HomeSubcategoriasByCategoriaController.ts" />
/// <reference path="controllers/homes/DetailContenidoController.ts" />
/// <reference path="controllers/homes/HomeMiPerfilController.ts" />
/// <reference path="controllers/homes/HomeMiPerfilEditarController.ts" />
/// <reference path="controllers/homes/HomeMiPerfilSeguimientoController.ts" />
/// <reference path="controllers/homes/HomeMiPerfilConversacionesController.ts" />
/// <reference path="controllers/homes/HomeMiPerfilMensajesController.ts" />
/// <reference path="controllers/homes/HomeMiPerfilAjustesController.ts" />
/// <reference path="controllers/homes/HomePerfilController.ts" />
/// <reference path="controllers/homes/HomePerfilSeguimientoController.ts" />
/// <reference path="controllers/homes/HomePublicarPostController.ts" />
/// <reference path="controllers/homes/HomeBuscadorController.ts" />
/// <reference path="controllers/homes/HomeLegalController.ts" />
/// <reference path="controllers/homes/HomeNotificacionController.ts" />
/// <reference path="controllers/homes/HomeBienvenidaController.ts" />
/// <reference path="controllers/homes/HomeNotFoundController.ts" />

/// <reference path="controllers/entities/EntityController.ts" />
/// <reference path="controllers/entities/ContenidoController.ts" />
/// <reference path="controllers/entities/ContenidoSeguimientoController.ts" />
/// <reference path="controllers/entities/ContenidoTagController.ts" />
/// <reference path="controllers/entities/ContenidoBuscadorController.ts" />
/// <reference path="controllers/entities/CategoriaController.ts" />
/// <reference path="controllers/entities/ComentarioController.ts" />
/// <reference path="controllers/entities/CalificacionController.ts" />
/// <reference path="controllers/entities/PerfilController.ts" />
/// <reference path="controllers/entities/SeguimientoController.ts" />
/// <reference path="controllers/entities/BloqueoController.ts" />
/// <reference path="controllers/entities/DenunciaController.ts" />
/// <reference path="controllers/entities/PerfilListController.ts" />
/// <reference path="controllers/entities/ListaDeLecturaController.ts" />
/// <reference path="controllers/entities/PaginaController.ts" />
/// <reference path="controllers/entities/MensajeController.ts" />
/// <reference path="controllers/entities/NotificacionController.ts" />
/// <reference path="controllers/entities/GrupoController.ts" />
/// <reference path="controllers/entities/HashtagController.ts" />
/// <reference path="controllers/entities/TagController.ts" />
/// <reference path="controllers/entities/BuscadorGeneralController.ts" />

/// <reference path="controllers/modals/PerfilModalController.ts" />

/// <reference path="controllers/AlbumController.ts" />
/// <reference path="controllers/CarrouselController.ts" />
/// <reference path="controllers/data/DataJsonController.ts" />

/// <reference path="controllers/modules/slider/SliderController.ts" />
/// <reference path="controllers/modules/compartir/CompartirController.ts" />

/// <reference path="services/EntityApirestService.ts" />
/// <reference path="services/ContenidoApirestService.ts" />
/// <reference path="services/ContenidoCardService.ts" />
/// <reference path="services/CategoriaApirestService.ts" />
/// <reference path="services/ComentarioApirestService.ts" />
/// <reference path="services/PerfilApirestService.ts" />
/// <reference path="services/SeguimientoApirestService.ts" />
/// <reference path="services/BloqueoApirestService.ts" />
/// <reference path="services/DenunciaApirestService.ts" />
/// <reference path="services/PerfilListApirestService.ts" />
/// <reference path="services/ListaDeLecturaApirestService.ts" />
/// <reference path="services/PaginaApirestService.ts" />
/// <reference path="services/MensajeApirestService.ts" />
/// <reference path="services/NotificacionApirestService.ts" />
/// <reference path="services/GrupoApirestService.ts" />
/// <reference path="services/HashtagApirestService.ts" />
/// <reference path="services/TagApirestService.ts" />
/// <reference path="services/DateService.ts" />

/// <reference path="services/modules/files/service.ts" />

/// <reference path="directives/scrollDirective.ts" />
/// <reference path="directives/reloadCardDirective.ts" />
/// <reference path="directives/loadedClassDirective.ts" />
/// <reference path="directives/groupsCardsDirective.ts" />
/// <reference path="directives/cardWrapperDirective.ts" />
/// <reference path="directives/cardDirective.ts" />
/// <reference path="directives/contentDirective.ts" />
/// <reference path="directives/heightElementDirective.ts" />
/// <reference path="directives/linkPreviewDirective.ts" />

/// <reference path="directives/modules/calificacion/directive.ts" />
/// <reference path="directives/modules/denuncia/directive.ts" />
/// <reference path="directives/modules/listadelectura/directive.ts" />
/// <reference path="directives/modules/compartir/directive.ts" />
/// <reference path="directives/modules/fileimage/directive.ts" />
/// <reference path="directives/modules/filevideo/directive.ts" />
/// <reference path="directives/modules/slider/directive.ts" />
/// <reference path="directives/modules/login/directive.ts" />
/// <reference path="directives/modules/repost/directive.ts" />
/// <reference path="directives/modules/buscador-general/directive.ts" />
/// <reference path="directives/modules/buscador-perfiles/directive.ts" />

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
        'angular-progress-button-styles',
        'react'
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
        .controller("HomeContenidoByCategoriaController", HomeContenidoByCategoriaController)
        .controller("HomeContenidoByTagController", HomeContenidoByTagController)
        .controller("HomeContenidoByHashtagController", HomeContenidoByHashtagController)
        .controller("HomeComentariosByContenidoController", HomeComentariosByContenidoController)
        .controller("HomeCategoriasController", HomeCategoriasController)
        .controller("HomeSubcategoriasByCategoriaController", HomeSubcategoriasByCategoriaController)
        .controller("DetailContenidoController", DetailContenidoController)
        .controller("HomeMiPerfilController", HomeMiPerfilController)
        .controller("HomeMiPerfilEditarController", HomeMiPerfilEditarController)
        .controller("HomeMiPerfilSeguimientoController", HomeMiPerfilSeguimientoController)
        .controller("HomeMiPerfilConversacionesController", HomeMiPerfilConversacionesController)
        .controller("HomeMiPerfilMensajesController", HomeMiPerfilMensajesController)
        .controller("HomeMiPerfilAjustesController", HomeMiPerfilAjustesController)
        .controller("HomePerfilController", HomePerfilController)
        .controller("HomePerfilSeguimientoController", HomePerfilSeguimientoController)        
        .controller("HomePublicarPostController", HomePublicarPostController)
        .controller("HomeBuscadorController", HomeBuscadorController)
        .controller("HomeLegalController", HomeLegalController)
        .controller("HomeNotificacionController", HomeNotificacionController)
        .controller("HomeBienvenidaController", HomeBienvenidaController)
        .controller("HomeNotFoundController", HomeNotFoundController)
        //Others controllers
        .controller("CarrouselController", CarrouselController)
        .controller("AlbumController", AlbumController)
        //Controller modals
        .controller("PerfilModalController", PerfilModalController)
        // controllers.entidades
        .controller("ContenidoController", ContenidoController)
        .controller("ContenidoSeguimientoController", ContenidoSeguimientoController)
        .controller("ContenidoTagController", ContenidoTagController)
        .controller("ContenidoBuscadorController", ContenidoBuscadorController)
        .controller("CategoriaController", CategoriaController)
        .controller("ComentarioController", ComentarioController)
        .controller("CalificacionController", CalificacionController)
        .controller("PerfilController", PerfilController)
        .controller("SeguimientoController", SeguimientoController)
        .controller("BloqueoController", BloqueoController)
        .controller("DenunciaController", DenunciaController)
        .controller("PerfilListController", PerfilListController)
        .controller("ListaDeLecturaController", ListaDeLecturaController)
        .controller("PaginaController", PaginaController)
        .controller("MensajeController", MensajeController)
        .controller("NotificacionController", NotificacionController)
        .controller("GrupoController", GrupoController)
        .controller("HashtagController", HashtagController)
        .controller("TagController", TagController)
        .controller("BuscadorGeneralController", BuscadorGeneralController)
        //cotroller.modules
        .controller("SliderController", SliderController)
        .controller("CompartirController", CompartirController)
        // service service
        .service("ContenidoApirestService", ContenidoApirestService)
        .service("ContenidoCardService", ContenidoCardService)
        .service("CategoriaApirestService", CategoriaApirestService)
        .service("ComentarioApirestService", ComentarioApirestService)
        .service("CalificacionApirestService", CalificacionApirestService)
        .service("PerfilApirestService", PerfilApirestService)
        .service("SeguimientoApirestService", SeguimientoApirestService)
        .service("BloqueoApirestService", BloqueoApirestService)
        .service("DenunciaApirestService", DenunciaApirestService)
        .service("PerfilListApirestService", PerfilListApirestService)
        .service("ListaDeLecturaApirestService", ListaDeLecturaApirestService)
        .service("PaginaApirestService", PaginaApirestService)
        .service("MensajeApirestService", MensajeApirestService)
        .service("NotificacionApirestService", NotificacionApirestService)
        .service("GrupoApirestService", GrupoApirestService)
        .service("HashtagApirestService", HashtagApirestService)
        .service("TagApirestService", TagApirestService)
        .service("FilesService", FilesService)
        .service("DateService", DateService)
        //Directives
        .directive('scroll', Scroll)
        .directive('reloadcard', ReloadCard)
        .directive('loadedclass', loadedClass)
        .directive('card', ['$compile','$http', '$templateCache','reactDirective','ContenidoCardService',Card])
        .directive('test', ['$compile','$http', '$templateCache','reactDirective','ContenidoCardService',GroupsCard])
        .directive('cardWrapper', ['$compile','$http', '$templateCache','reactDirective','ContenidoCardService',CardWrapper])
        .directive('content', ['$compile','$http', '$templateCache',Content])
        .directive('heightVideo', [HeightElement])
        .directive('linkPreview', ['$compile', '$http', '$sce', 'config', linkPreview])
        //Modulos
        .directive('calificacion', ['$compile','$http', '$templateCache',CalificacionDirective])
        .directive('denuncia', ['$compile','$http', '$templateCache',DenunciaDirective])
        .directive('listadelectura', ['$compile','$http', '$templateCache',ListadelecturaDirective])
        .directive('compartir', ['$compile','$http', '$templateCache',CompartirDirective])
        .directive('fileimage', ['$compile','$http', '$templateCache',FileImageDirective])
        .directive('filevideo', ['$compile','$http', '$templateCache',FileVideoDirective])
        .directive('slider', ['$compile','$http', '$templateCache',SliderDirective])
        .directive('login', ['$compile','$http', '$templateCache',LoginDirective])
        .directive('repost', ['$compile','$http', '$templateCache',RepostDirective])
        .directive('buscadorGeneral', ['$compile','$http', '$templateCache',BuscadorGeneralDirective])
        .directive('buscadorPerfiles', ['$compile','$http', '$templateCache',BuscadorPerfilesDirective])
        //Filter
        .filter('excerpt', Excerpt)
        .filter('stringdate', ["$filter","DateService",StringDate])
        .filter('reverse', Reverse)
        .filter('hextorgb', HexToRgb)
        .filter('minusculas', Minusculas)
        .filter('clean', Clean)
        .filter('concatenar', Concatenar);

}