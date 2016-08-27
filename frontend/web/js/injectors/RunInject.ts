module ILovePlatos{
    'use strict';    

    export class RunInject {
        static $inject = [
            "ContenidoApirestService","config","PaginaApirestService","$rootScope","$state","auth", "store", "jwtHelper"
        ];

        constructor(ContenidoApirestService,config,PaginaApirestService,$rootScope,$state,auth, store, jwtHelper){

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

                //Para mantener la sesión del usuario indefinida------>
                if (!auth.isAuthenticated) {
                  var token = store.get('token');
                  var refreshToken = store.get('refreshToken');
                  if (token) {
                    if (!jwtHelper.isTokenExpired(token)) {
                      auth.authenticate(store.get('profile'), token);
                    } else {
                      if (refreshToken) {
                        return auth.refreshIdToken(refreshToken).then(function(idToken) {
                          store.set('token', idToken);
                          auth.authenticate(store.get('profile'), idToken);
                        });
                      }
                    }
                  }
                }
                //----------<<<<<

            });
    
            //Precarga todas las plantillas de las páginas
            PaginaApirestService.preloadAllTemplateContent();
        }

    }
}