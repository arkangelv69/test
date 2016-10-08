module ILovePlatos{
    'use strict';    

    declare var translationsEN_EN:any;
    declare var translationsES_ES:any;
    declare var basePath:any;
    declare var cordova:any;

    export class ConfigInject {
        static $inject = [
            "$interpolateProvider","$locationProvider","$stateProvider","$urlRouterProvider","$translateProvider","authProvider","jwtInterceptorProvider","$httpProvider","$provide","jwtOptionsProvider"
        ];

        constructor($interpolateProvider,$locationProvider,$stateProvider, $urlRouterProvider,$translateProvider,authProvider,jwtInterceptorProvider,$httpProvider,$provide,jwtOptionsProvider){
            $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
            $locationProvider.hashPrefix('!');

            jwtOptionsProvider.config({ whiteListedDomains:["*"]});

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
            authProvider.init({
                domain: configILovePlatos.domain,
                clientID: configILovePlatos.clientID
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

            //-----------<<<<<

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
                 .state('card', {
                    url: "/card/:id",
                    controller: 'HomeCardController',
                    controllerAs:'homecardCtrl',
                    templateUrl: "partials/card.html",
                })
                 .state('restaurant-create', {
                    url: "/restaurant/create",
                    controller: 'HomeRestaurantController',
                    controllerAs:'homerestaurantCtrl',
                    templateUrl: "partials/restaurant-create.html",
                })
                 .state('plate-create', {
                    url: "/plate/create",
                    controller: 'HomePlateController',
                    controllerAs:'homeplateCtrl',
                    templateUrl: "partials/plate-create.html",
                })
                 .state('menu-create', {
                    url: "/menu/create",
                    controller: 'HomeMenuController',
                    controllerAs:'homemenuCtrl',
                    templateUrl: "partials/menu-create.html",
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