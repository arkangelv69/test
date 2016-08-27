module ILovePlatos{
    'use strict';    

    declare var translationsEN_EN:any;
    declare var translationsES_ES:any;
    declare var basePath:any;
    declare var cordova:any;

    export class ConfigInject {
        static $inject = [
            "$interpolateProvider","$locationProvider","$stateProvider","$urlRouterProvider","$translateProvider","authProvider","jwtInterceptorProvider","$httpProvider","$provide"
        ];

        constructor($interpolateProvider,$locationProvider,$stateProvider, $urlRouterProvider,$translateProvider,authProvider,jwtInterceptorProvider,$httpProvider,$provide){
            $interpolateProvider.startSymbol('{{').endSymbol('}}');
            $locationProvider.hashPrefix('!');

            //Si estamos en una aplicación cordova y para ios.
            if(typeof(cordova) != 'undefined' && typeof(cordova) == 'object') {
                basePath = window.location.pathname;
                if(basePath.search("index-ios.html") != -1) {
                    basePath = basePath.replace("index-ios.html","");
                    angular.element('base').attr("href",basePath);
                }
                else if(basePath.search("index-android.html") != -1) {
                    basePath = basePath.replace("index-android.html","");
                    angular.element('base').attr("href",basePath);
                }
                console.log(basePath);
            }
            
            $locationProvider.html5Mode({
              enabled: false,
              requireBase: true
            });

            //Para mantener la sesión del usuario indefinida------>
            /*authProvider.init({
                domain: configBuho.domain,
                clientID: configBuho.clientID
            });

            authProvider.on('loginSuccess', ["$location", "profilePromise", "idToken", "refreshToken", "store",function($location, profilePromise, idToken, refreshToken, store) {
                store.set('token', idToken);
                store.set('refreshToken', refreshToken);
                profilePromise.then(function(profile) {
                  store.set('profile', profile);
                });
            }]);

            var refreshingToken = null;
            jwtInterceptorProvider.tokenGetter = ["store", "jwtHelper", "auth",function(store, jwtHelper, auth) {
                var idToken = store.get('token');
                var refreshToken = store.get('refreshToken');
                if(idToken && !refreshToken) {
                  store.remove('profile');
                  store.remove('token');
                  store.remove('refreshToken');
                  var url = window.location;
                  window.location = url;
                }
                if (!idToken || !refreshToken) {
                  return null;
                }
                if (jwtHelper.isTokenExpired(idToken)) {
                  return auth.refreshIdToken(refreshToken).then(function(idToken) {
                    store.set('token', idToken);
                    return idToken;
                  });
                } else {
                  return idToken;
                }
            }];

            $httpProvider.interceptors.push('jwtInterceptor');
            //-----------------------<<<<<

            //Por seguridad de auth------------>
            $provide.factory('redirect', ['$q', 'auth', 'store', '$location',function($q, auth, store, $location) {
              return {
                responseError: function(rejection) {

                  if (rejection.status === 401) {
                    auth.signout();
                    store.remove('profile');
                    store.remove('token');
                    $location.path('/');
                  }
                  return $q.reject(rejection);
                }
              }
            }]);
            $httpProvider.interceptors.push('redirect');
            //-----------<<<<<*/

            $stateProvider
                .state('home', {
                    url: "?reset",
                    controller: 'HomeController',
                    controllerAs:'home',
                    templateUrl: "partials/home.html"
                })
                .state('home.inicio', {
                    url: "/?reset"
                })
                .state('home.index', {
                    url: "/index.html"
                })
                .state('home.indexAndroid', {
                    url: "/index-android.html",
                    absolute:true
                })
                .state('home.indexIOS', {
                    url: "/index-ios.html",
                    absolute:true
                })
                .state('home.preview', {
                    url: "/home/preview?reset",
                })
                .state('categorias_tmp', {
                    url: "/categorias?reset",
                    controller: 'HomeCategoriasController',
                    controllerAs:'homecategoriaCtrl',
                    templateUrl: "partials/categorias.html"
                })
                .state('categorias', {
                    url: "/contenidos?reset",
                    controller: 'HomeCategoriasController',
                    controllerAs:'homecategoriaCtrl',
                    templateUrl: "partials/categorias.html"
                })
                .state('filtrosubcategoria', {
                    url: "/contenidos/:categoria/filtros?reset",
                    controller: 'HomeSubcategoriasByCategoriaController',
                    controllerAs:'homesubcategoriasCtrl',
                    templateUrl: "partials/subcategorias-by-categoria.html"
                })
                .state('contenidosbycategoria_tmp', {
                    url: "/contenidos/categoria/:id?reset",
                    controller: 'HomeContenidoByCategoriaController',
                    controllerAs:'homecontenidoCtrl',
                    templateUrl: "partials/contenido-by-categoria.html"
                })
                .state('contenidosbycategoria', {
                    url: "/contenidos/:id?reset",
                    controller: 'HomeContenidoByCategoriaController',
                    controllerAs:'homecontenidoCtrl',
                    templateUrl: "partials/contenido-by-categoria.html"
                })
                .state('contenido', {
                    url: "/contenidos/:categoria/:slug/:id?reset",
                    controller: 'DetailContenidoController',
                    controllerAs:'detailCtrl',
                    templateUrl: "partials/page/contenido.html"
                })
                .state('bienvenida', {
                    url: "/bienvenido-a-buho",
                    controller: 'HomeBienvenidaController',
                    controllerAs:'homebienvenidaCtrl',
                    templateUrl: "partials/bienvenida.html"
                })
                .state('tags', {
                    url: "/tags?reset",
                    controller: 'HomeContenidoByTagController',
                    controllerAs:'homecontenidoCtrl',
                    templateUrl: "partials/contenido-by-tag.html"
                })
                .state('contenidosbytag', {
                    url: "/tags/:id?reset",
                    controller: 'HomeContenidoByTagController',
                    controllerAs:'homecontenidoCtrl',
                    templateUrl: "partials/contenido-by-tag.html"
                })
                .state('hashtags', {
                    url: "/hashtags?reset",
                    controller: 'HomeContenidoByHashtagController',
                    controllerAs:'homecontenidoCtrl',
                    templateUrl: "partials/contenido-by-hashtag.html"
                })
                .state('contenidosbyhashtag_tmp', {
                    url: "/contenidos/hashtags/:id?reset",
                    controller: 'HomeContenidoByHashtagController',
                    controllerAs:'homecontenidoCtrl',
                    templateUrl: "partials/contenido-by-hashtag.html"
                })
                .state('contenidosbyhashtag', {
                    url: "/hashtags/:id?reset",
                    controller: 'HomeContenidoByHashtagController',
                    controllerAs:'homecontenidoCtrl',
                    templateUrl: "partials/contenido-by-hashtag.html"
                })
                .state('comentariosbycontenido', {
                    url: "/comentarios/:categoria/:slug/:id?focus",
                    controller: 'HomeComentariosByContenidoController',
                    controllerAs:'homecomentarioCtrl',
                    templateUrl: "partials/comentario-by-contenido.html"
                })
                .state('mi-perfil', {
                    url: "/mi-perfil?reset",
                    controller: 'HomeMiPerfilController',
                    controllerAs:'homemiperfilCtrl',
                    templateUrl: "partials/mi-perfil.html",
                    data: { requiresLogin: true }
                })
                .state('mi-perfil-editar', {
                    url: "/mi-perfil/editar?reset",
                    controller: 'HomeMiPerfilEditarController',
                    controllerAs:'homemiperfilEditarCtrl',
                    templateUrl: "partials/mi-perfil-editar.html",
                    data: { requiresLogin: true }
                })
                .state('mi-perfil-seguimiento', {
                    url: "/mi-perfil/seguimiento?reset&tab",
                    controller: 'HomeMiPerfilSeguimientoController',
                    controllerAs:'homeperfilCtrl',
                    templateUrl: "partials/mi-perfil-seguimiento.html"
                })
                .state('mi-perfil-conversaciones', {
                    url: "/mi-perfil/conversaciones?reset&tab",
                    controller: 'HomeMiPerfilConversacionesController',
                    controllerAs:'homeperfilCtrl',
                    templateUrl: "partials/mi-perfil-conversaciones.html"
                })
                .state('mi-perfil-mensajes', {
                    url: "/mi-perfil/mensajes/:username?reset&tab",
                    controller: 'HomeMiPerfilMensajesController',
                    controllerAs:'homeperfilCtrl',
                    templateUrl: "partials/mi-perfil-mensajes.html"
                })
                .state('mi-perfil-ajustes', {
                    url: "/mi-perfil/ajustes",
                    controller: 'HomeMiPerfilAjustesController',
                    controllerAs:'homeperfilCtrl',
                    templateUrl: "partials/mi-perfil-ajustes.html"
                })
                .state('perfil', {
                    url: "/perfil/:username?reset",
                    controller: 'HomePerfilController',
                    controllerAs:'homeperfilCtrl',
                    templateUrl: "partials/perfil.html"
                }) 
                .state('perfil-seguimiento', {
                    url: "/perfil/:username/seguimiento?reset&tab",
                    controller: 'HomePerfilSeguimientoController',
                    controllerAs:'homeperfilCtrl',
                    templateUrl: "partials/perfil-seguimiento.html"
                })
                .state('notificaciones', {
                    url: "/notificaciones",
                    controller: 'HomeNotificacionController',
                    controllerAs:'homenotificacionesCtrl',
                    templateUrl: "partials/notificaciones.html"
                })            
                .state('buscador', {
                    url: "/buscador",
                    controller: 'HomeBuscadorController',
                    controllerAs:'homebuscadorCtrl',
                    templateUrl: "partials/buscador.html"
                })
                .state('publicarpost', {
                    url: "/publicar-post",
                    controller: 'HomePublicarPostController',
                    controllerAs:'homepublicarpostCtrl',
                    templateUrl: "partials/publicar-post.html"
                })
                .state('editarpost', {
                    url: "/editar-post/:id",
                    controller: 'HomePublicarPostController',
                    controllerAs:'homepublicarpostCtrl',
                    templateUrl: "partials/editar-post.html"
                })
                .state('legal', {
                    url: "/legal?reset",
                    controller: 'HomeLegalController',
                    controllerAs:'homelegalCtrl',
                    templateUrl: "partials/legal.html"
                })
                .state('signin', {
                    url: "/iniciar-sesion?reset&redirectState&backName",
                    controller: 'HomeMiPerfilController',
                    params: {redirectParams: null,customClass:null},
                    controllerAs:'homemiperfilCtrl',
                    templateUrl: "partials/signin.html"
                })
                .state('signup', {
                    url: "/registrarse?reset&redirectState&backName",
                    controller: 'HomeMiPerfilController',
                    params: {redirectParams: null,customClass:null},
                    controllerAs:'homemiperfilCtrl',
                    templateUrl: "partials/signup.html"
                })
                .state('signup-end', {
                    url: "/terminar-registro?reset&redirectState&backName",
                    controller: 'HomeMiPerfilController',
                    params: {redirectParams: null,customClass:null},
                    controllerAs:'homemiperfilCtrl',
                    templateUrl: "partials/signup-end.html"
                })
                .state('landings', {
                    url: "/landings/:client/:slug",
                    controller: 'HomeLandingController',
                    controllerAs:'homelandingCtrl',
                    templateUrl: "partials/landing.html"
                })
                .state('landingsaction', {
                    url: "/landings/:client/:slug/:action",
                    controller: 'HomeLandingController',
                    controllerAs:'homelandingCtrl',
                    templateUrl: "partials/landing.html"
                })
                .state('notfound', {
                    url: "/not-found",
                    controller: 'HomeNotFoundController',
                    controllerAs:'homenotfoundCtrl',
                    templateUrl: "partials/404.html"
                });

                if(!window.location.hash || window.location.hash.search('#!')  == -1) {
                    $urlRouterProvider.otherwise('/not-found');
                }

                $translateProvider.useSanitizeValueStrategy(null);
                $translateProvider.translations('en', translationsEN_EN);
                $translateProvider.translations('es', translationsES_ES);
                $translateProvider.preferredLanguage('es');
        }

    }
}