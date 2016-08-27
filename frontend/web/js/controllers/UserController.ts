/// <reference path="../../typings/angularjs/angular.d.ts" />

module ILovePlatos{

    export class UserController implements iUserModel{

        static $inject = [
            "config",
            "$rootScope",
            "$scope",
            "$state",
            "$window",
            "$stateParams",
            "PerfilApirestService",
            "auth",
            "store",
            "jwtHelper",
            "DateService",
            "$filter"
        ];

        _main:IMainScope;
        currentUser:any;
        userId:string;
        username:string;
        nickname:string;
        description:string;
        email:string;
        connection:string;
        ageBirth:any = {};
        colorBackground:string;
        imageBackground:string;
        imagePerfil:string;
        colorPerfil:string;
        privacidad:string;
        enviarNotificacionesAlEmail:string;
        promocode:string;
        completeRegister:boolean;
        alreadyLoggedIn:boolean;
        isSubmit = false;

        constructor(private $config:any,$rootScope: IBuhoRootScopeService,private $scope:any,
                    private $state:any,private $window:any,private $stateParams:any,private svc,
                    private auth,private store, jwtHelper,private DateService,private $filter){
            var self = this;

            this._main = $rootScope.$$childHead.mainCtrl;
            this._main._user = this;

              var token = store.get('token');
              if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                  if (!auth.isAuthenticated) {
                    auth.authenticate(store.get('profile'), token);

                    //Seteo de forma temporal el perfill
                    self.setUserProfile(auth.profile);
                    //Pregunto por si se ha actualizado de nuevo el perfil
                    auth.profilePromise.then(function(profile) {
                      if(profile) {
                        self.setUserProfile(profile);
                        self.store.set('profile', profile);
                      }
                    });
                  }
                }
              }
        }

        login() {
          var self = this;
          angular.element('.login').append('<div id="hiw-login-container"></div>');
          this.auth.signin({
              authParams: {
                scope: 'openid offline_access'
              },
              dict: 'es',closable: false/*,container: 'hiw-login-container'*/,gravatar: false,disableSignupAction: false
            }, function (profile, token) {
              // Success callback
              self.store.set('profile', profile);
              self.store.set('token', token);

              if(profile) {

                self.setUserProfile(profile);
                self._main._user = self;
                self._main.deleteAllCache();
                self.$scope.$emit('activeNumberNotificacionesInterval');

                if( !self.$scope.$$phase  ) {
                  self.$scope.$apply();
                }

                if(!profile.user_metadata || !profile.user_metadata.alreadyLoggedIn) {
                  if(self.ageBirth && self.ageBirth.day && self.ageBirth.month && self.ageBirth.year) {
                    self.updateMeta('ageBirth',self.ageBirth);
                  }
                  self.updateMeta('privacidad','PUBLICO');
                  self.updateMeta('enviarNotificacionesAlEmail','TRUE');

                  if(profile.identities[0].provider != 'auth0') {
                    //Si existen parámetros de redirección redirigimos a la página
                    var params = {};
                     if(self.$stateParams.redirectState) {
                      params = self.$stateParams;
                     }

                    self.$state.go('signup-end',{params});
                  }else {
                    if(self.$stateParams.redirectState) {
                      self.redirect();
                    }else {
                      self.$state.go('bienvenida');
                    }
                  }
                }else {
                   if(self.$stateParams.redirectState) {
                    self.redirect();
                   }else {
                    self.$state.go('home');
                   }
                }

              }

            }, function () {
              // Error callback
            });
        }

        signup() {
          var self = this;
          angular.element('.login').append('<div id="hiw-login-container"></div>');
          this.auth.signup({
              authParams: {
                scope: 'openid offline_access'
              },
              dict: 'es',closable: false/*,container: 'hiw-login-container'*/,gravatar: false
            }, function (profile, token) {
              // Success callback
              self.store.set('profile', profile);
              self.store.set('token', token);

              if(profile) {
                self.setUserProfile(profile);
                self._main._user = self;
                self._main.deleteAllCache();

                self.$scope.$emit('activeNumberNotificacionesInterval');

                if( !self.$scope.$$phase  ) {
                  self.$scope.$apply();
                }

                if(!profile.user_metadata || !profile.user_metadata.alreadyLoggedIn) {
                  if(self.ageBirth && self.ageBirth.day && self.ageBirth.month && self.ageBirth.year) {
                    self.updateMeta('ageBirth',self.ageBirth);
                  }
                  self.updateMeta('privacidad','PUBLICO');
                  self.updateMeta('enviarNotificacionesAlEmail','TRUE');

                  if(profile.identities[0].provider != 'auth0') {
                    //Si existen parámetros de redirección redirigimos a la página
                    var params = {};
                     if(self.$stateParams.redirectState) {
                      params = self.$stateParams;
                     }

                    self.$state.go('signup-end',params);
                  }else {
                    self.completeRegister = true;
                    self.updateMeta('completeRegister',true);

                   //Si existen parámetros de redirección redirigimos a la página
                   if(self.$stateParams.redirectState) {
                    self.redirect();
                   }else {
                    self.$state.go('bienvenida');
                   }

                  }

                }else {
                   if(self.$stateParams.redirectState) {
                    self.redirect();
                   }else {
                    self.$state.go('home');
                   }
                }

              }

            }, function () {
              // Error callback
            });
        }

        signupPopUp() {
          var self = this;
          angular.element('.login').append('<div id="hiw-login-container"></div>');
          this.auth.signin({
              authParams: {
                scope: 'openid offline_access'
              },
              dict: 'es',closable: true/*,container: 'hiw-login-container'*/,gravatar: false,disableSignupAction: false,
              popup:true
            }, function (profile, token) {
              // Success callback
              self.store.set('profile', profile);
              self.store.set('token', token);

              if(profile) {

                self.setUserProfile(profile);
                self._main._user = self;
                self._main.deleteAllCache();
                self.$scope.$emit('activeNumberNotificacionesInterval');

                if( !self.$scope.$$phase  ) {
                  self.$scope.$apply();
                }

                if(!profile.user_metadata || !profile.user_metadata.alreadyLoggedIn) {
                  if(self.ageBirth && self.ageBirth.day && self.ageBirth.month && self.ageBirth.year) {
                    self.updateMeta('ageBirth',self.ageBirth);
                  }
                  self.updateMeta('privacidad','PUBLICO');
                  self.updateMeta('enviarNotificacionesAlEmail','TRUE');

                  if(profile.identities[0].provider != 'auth0') {
                    //Si existen parámetros de redirección redirigimos a la página
                    var params = {};
                     if(self.$stateParams.redirectState) {
                      params = self.$stateParams;
                     }

                    self.$state.go('signup-end',{params});
                  }else {
                    if(self.$stateParams.redirectState) {
                      self.redirect();
                    }else {
                      self.$state.go('bienvenida');
                    }
                  }
                }else {
                   if(self.$stateParams.redirectState) {
                    self.redirect();
                   }else {
                    self.$state.go('home');
                   }
                }

              }

            }, function () {
              // Error callback
            });
        }

        visitPageBienvenida() {
          if(!this.alreadyLoggedIn) {
            this.updateMeta('alreadyLoggedIn',true);
          }
        }

        redirect() {
          var redirectState = this.$stateParams.redirectState;
          var redirectParams = this.$stateParams.redirectParams;
          this.$state.go(redirectState+'action' ,redirectParams);
        }

        updateProfile(attributes) {
          var profile = this.auth.profile;
          if(profile && profile.user_metadata && attributes) {
            profile.user_metadata = jQuery.extend( profile.user_metadata,attributes);
          }
        }

        saveUserInStorageLocal() {          
          var profile = this.auth.profile;
          this.store.set('profile', profile);
        }

        logout() {
          var self = this;
          self.currentUser = null;
          self.username = null;
          self.colorBackground = null;
          self.email = null;
          self.auth.profile = null;
          self.store.remove('profile');
          self.store.remove('token');
          self.store.remove('refreshToken');
          self._main.deleteAllCache();
          self.auth.signout();

          setTimeout(function(){
            self.$state.go('home', {}, {reload: true});
          },100);
        }

        isLogged() {
          if(this.currentUser && !this.alreadyLoggedIn && this.completeRegister && this.$state.current.name == 'signup-end') {
            if(this.$stateParams.redirectState) {
              this.redirect();
            }else {
              this.$state.go('bienvenida');
            }
          }
          else if(this.currentUser && this.alreadyLoggedIn && this.completeRegister && this.$state.current.name == 'signup-end') {
            this.$state.go('mi-perfil');
          }
          else if(this.currentUser && !this.completeRegister && 
            this.$state.current.name && 
            this.$state.current.name != 'signup-end' && 
            this.$state.current.name != 'bienvenida' && 
            this.$state.current.name != 'signup' &&
            this.$state.current.name != 'signin'
          ) {
            this.$state.go('signup-end');
          }
          else {
            return this.currentUser;
          }
        }

        watchSession() {
          var self = this;
          setInterval(function() {
            if(!self.existSession()){
              self._main.resetMessages();
              self._main.setMessage({type:'danger',text:'Me parece que te haz quedado dormid@, recarga la página de nuevo.'});
            }else{
              console.log('Existe session');
            }
          },3000);
        }

        existSession() {
          if(this.currentUser) {
            return true;
          }else {
            return false;
          }
        }

        isCurrenUser(userId) {
          if(this.existSession && userId == this.username) {
            return true;
          }else {
            return false;
          }
        }

        isCheckedPrivacidad() {
          if(this.privacidad == 'PUBLICO') {
            return true;
          }else {
            return false;
          }
        }

        isCheckedEnviarNotificacionesAlEmail() {
          if(this.enviarNotificacionesAlEmail === 'TRUE') {
            return true;
          }else {
            return false;
          }
        }

        isMine(user) {
          if(user && user.id == this.username) {
            return true;
          }else {
            return false;
          }
        }

        isBuho(user) {
          if(user && ( user.id == 'buho' || user.id == 'buhocms' || user.id == 'admin' || user.id == 'adminbuho') ) {
            return true;
          }else {
            return false;
          }
        }

        isMyPageByUrl() {
          if(this.$stateParams && this.$stateParams.username == this.username) {
            return true;
          }else {
            return false;
          }
        }

        isBuhoPageByUrl() {
          if(this.$stateParams && ( this.$stateParams.username == 'buho' || this.$stateParams.username == 'buhocms' || this.$stateParams.username == 'admin' || this.$stateParams.username == 'adminbuho') ) {
            return true;
          }else {
            return false;
          }
        }

        toogleMetaPrivacidad(event) {
          event.preventDefault();
          if(this.privacidad == 'PUBLICO') {
            this.privacidad = 'PRIVADO';
          }else {
            this.privacidad = 'PUBLICO';
          }
          this.updateMeta('privacidad',this.privacidad);
        }

        toogleMetaEnviarNotificacionesAlEmail(event) {
          event.preventDefault();
          if(this.enviarNotificacionesAlEmail === 'TRUE') {
            this.enviarNotificacionesAlEmail = 'FALSE';
          }else {
            this.enviarNotificacionesAlEmail = 'TRUE';
          }
          this.updateMeta('enviarNotificacionesAlEmail',this.enviarNotificacionesAlEmail);
        }

        updateMeta(meta,value) {
          var self = this;
          var profile = this.auth.profile;
          var dataJson = new DataJsonController('perfiles');
          var attributes = {
            fecha: 0
          }
          attributes[meta] = value;
          attributes.fecha = this.DateService.getCurrentDateInUnix();
          dataJson.addAttributes(attributes);

          var newEntity = dataJson.getOutput();

          return this.svc.updateMeta(newEntity).then(function() {
            profile.user_metadata[meta] = value;
            self.store.set('profile', profile);
          });
        }

        changeName(event) {
          event.preventDefault();
        }

        changeDescription(event) {
          event.preventDefault();
        }

        changePassword(event) {
          event.preventDefault();
        }

        changeImageBackground(event) {
          event.preventDefault();
        }

        changeColorBackground(event) {
          event.preventDefault();
        }

        changeImagePerfil(event) {
          event.preventDefault();
        }

        getUsernameByUsuario(content){
            var username = '';
            var self = this;
            if(content && content.length > 0) {
                var autores = content[0];
                if(content.length > 1) {
                    autores = content[1];
                }
                if(!autores.attributes) {
                    autores.attributes = {
                        nickname:'buho',
                        avatar:self.$config.protocolCdn + self.$config.cdn+'/images/foto-perfil.jpg'
                    };
                }
                username = autores.id;
            }
            return username;
        }

        getRGBColorBackground() {
          return this.$filter('hextorgb')(this.colorBackground);
        }

        getNicknameByUsuario(content){
            var nickname = '';
            var self = this;
            if(content && content.length > 0) {
                var autores = content[0];
                if(content.length > 1) {
                    autores = content[1];
                }
                if(!autores.attributes) {
                    autores.attributes = {
                        nickname:'buho',
                        avatar:self.$config.protocolCdn + self.$config.cdn+'/images/foto-perfil.jpg'
                    };
                }
                nickname = autores.attributes.nickname;
            }
            return nickname;
        }

        getUsername() {
          return this.username;
        }

        getAvatar() {
          return this.imagePerfil;
        }

        getNickname() {
          return this.nickname;
        }

        getAvatarByUsuario(content){
            var avatar = '';
            var self = this;
            if(content && content.length > 0) {
                var autores = content[0];
                if(content.length > 1) {
                    autores = content[1];
                }
                if(!autores.attributes) {
                    autores.attributes = {
                        nickname:'buho',
                        avatar:self.$config.protocolCdn + self.$config.cdn+'/images/foto-perfil.jpg'
                    };
                }
                avatar = autores.attributes.avatar;
            }
            return avatar;
        }

        submit(form) {
            if(!this.isLogged()) {
                return null;  
            }
            jQuery(".overlayer").removeClass("hidden");

            var attributes = {
                email:'',
                username:'',
                password:'',
                ageBirth:{},
                fecha:''
            };

            var ageBirth = {
              day:form.day.$viewValue - 0,
              month:form.month.$viewValue - 1,
              year:form.year.$viewValue - 0,
            }

            var email = form.email.$viewValue;
            var username = form.username.$viewValue;
            var password = form.password.$viewValue;
            var confirmpassword = form.confirmpassword.$viewValue;
            var ageBirth = ageBirth;
            var self = this;

            self._main.resetMessages();
            var hasError = false;

            if(this.isSubmitActive(form)) {
                hasError = true;
                self._main.setMessage({type:'danger',text:'Tienes que completar todos los campos correctamente.'});
            }

            if(this.$scope.existEmail || this.$scope.existUsername || !this.$scope.validAgeBirth) {
              hasError = true;
              self._main.setMessage({type:'danger',text:'Tienes que completar todos los campos correctamente.'});
            }

            if(!email) {
                hasError = true;
                self._main.setMessage({type:'danger',text:'Un asterisco puñetero indica que es obligatorio escribir algo. El email es obligatorio'});
            }
            if(!username) {
                hasError = true;  
                self._main.setMessage({type:'danger',text:'Un asterisco puñetero indica que es obligatorio escribir algo. El username es obligatorio'});
            }
            if(!password) {
                hasError = true;
                self._main.setMessage({type:'danger',text:'Un asterisco puñetero indica que es obligatorio escribir algo. La contraseña es obligatoria.'});
            }
            if(!confirmpassword) {
                hasError = true;
                self._main.setMessage({type:'danger',text:'Un asterisco puñetero indica que es obligatorio escribir algo. La confirmación de la contraseña es obligatoria.'});
            }
            if(password != confirmpassword) {
                hasError = true;
                self._main.setMessage({type:'danger',text:'Un asterisco puñetero indica que es obligatorio escribir algo. Las contraseñas tienen que ser iguales.'});
            }

            if(hasError) {
              jQuery(".overlayer").addClass("hidden");
              return null;
            }

            attributes.email = email;
            attributes.username = username;
            attributes.password = password;
            //La edad se guarda con el formto estandar que es los meses empezando en 0.
            attributes.ageBirth = ageBirth;
            attributes.fecha = this.DateService.getCurrentDateInUnix();

            var dataJson = new DataJsonController('perfiles',this.auth);
            dataJson.addAttributes(attributes);

            var entity = dataJson.getOutput();

            this.linkPerfil(entity);
            
        }

        setValidField()  {          
          //Comprobar el email
          var email = this.email;
          var self = this;
          this.$scope.connectionName = this.getConnectionName()

          if(email) {
            this.existEmail(email).then(function(response){
              if(!response) {
                self.$scope.email = self.email;
                self.$scope.validEmail = true;  
              }else {
                self.$scope.emailCurrent = email;
              }
            });
          }else {
              self.$scope.validEmail = false;
          }

          //Comprobar el username
          var username = this.getUsernameFromConnection();
          var self = this;
          if(username) {
            this.existUsername(username).then(function(response){
              if(!response) {
                self.$scope.username = username;
                self.$scope.validUsername = true;  
              }else {
                self.$scope.usernameCurrent = username;
              }

            });
          }
          else {
            self.$scope.validUsername = false;  
          }

        }

        isValidDate(ageBirth) {
          var currentDate = new Date();
          var currentDateTimestamp = currentDate.getTime();
          var currentDateObject = {
            year:currentDate.getFullYear() - 16 ,
            month:currentDate.getMonth(),
            day:currentDate.getDate()
          }

          var dayRegex = /^[0-9]{2}$/;
          var monthRegex = /^[0-9]{2}$/;
          var yearRegex = /^[0-9]{4}$/;

          if(!ageBirth) {
            this.$scope.validAgeBirth = false;
            return false;
          }

          var day = ageBirth.day; 
          var month = ageBirth.month - 1; 
          var year = ageBirth.year; 

          if( !ageBirth.day || !ageBirth.month || !ageBirth.year ) {
            this.$scope.validAgeBirth = false;
            return false;
          }

          if( !ageBirth.day.match(dayRegex) 
             || !ageBirth.month.match(monthRegex) 
             || !ageBirth.year.match(yearRegex)
             || day > 31 || day < 1 ||
             month > 11 || month < 0 ||
             year < 1
          ) {
            this.$scope.validAgeBirth = false;
            return false;
          }

          var last16Date = new Date(currentDateObject.year,currentDateObject.month,currentDateObject.day);
          var last16DateTimestamp = last16Date.getTime();

          var userDate;
          var userDateTimestamp;
          if(typeof(day) != 'undefined' && typeof(month) != 'undefined' && typeof(year) != 'undefined') {
            userDate = new Date(year,month,day);
            userDateTimestamp = userDate.getTime();

            if(ageBirth && (last16DateTimestamp - userDateTimestamp) < 0) {
              this.$scope.validAgeBirth = false;
            }else if(ageBirth && (last16DateTimestamp - userDateTimestamp) >= 0){
              this.$scope.validAgeBirth = true;
            }else {
              this.$scope.validAgeBirth = false;
            }
          }
        }

        existEmail(email) {
            var self = this;
            return this.svc.existEmail(email).then((response: any) => {
                if(response && response.data) {
                  self.$scope.existEmail = response.data.exist;
                  return response.data.exist;
                }else {
                  self.$scope.existEmail = false;
                  return false;
                }
            });
        }

        existUsername(username) {
            var self = this;
            var isInvalid = false;
            if(!username) {
              self.$scope.existUsername = true;
            }
            if(username) {
              username = username.replace('/ /g','');
              var nameRegex = /^[a-z0-9]{1,15}$/;
              if( !username.match(nameRegex) ) {
                self.$scope.existUsername = true;
                isInvalid = true;
              }
            }
            return this.svc.existUsername(username).then((response: any) => {
                if(isInvalid) {
                 self.$scope.existUsername = true; 
                 return true;
                }
                if(response && response.data) {
                  self.$scope.existUsername = response.data.exist;
                  return response.data.exist;
                }else {
                  self.$scope.existUsername = false;
                  return false;
                }
            });
        }

        linkPerfil(entity) {
          var self = this;
          return this.svc.linkPerfil(entity).then(function(response) {
            if(response && response.data && !response.data.error) {
              jQuery(".overlayer").addClass("hidden");
              self.reloadUser(response.data);
            }else {
              jQuery(".overlayer").addClass("hidden");
              self._main.setMessage({type:'danger',text:'Algo salio mal complete todos los campos correctamente y vuelve a enviar el formulario.'});
            }
          },function(error) {
              jQuery(".overlayer").addClass("hidden");
              self._main.setMessage({type:'danger',text:'Algo salio mal. Es posible que su nombre de usuario o email ya estén en uso.'});
          });
        }

        isSubmitActive(form) {
            if(this.isSubmit) {
                return true; 
            }else {
                return !form.$valid;
            }            
        }

        setUserProfile(profile) {

           if(profile) {
            this.currentUser = profile;
            this.userId = profile['user_id'];
            this.username = profile.username;
            this.nickname = profile.nickname;
            this.description = profile.description;
            this.email = profile.email;
            this.imagePerfil = profile.picture;
            this.connection = this.getConnection(profile.identities);
            if(profile.user_metadata) {
              this.username = profile.user_metadata.username || this.username;
              this.nickname = profile.user_metadata.nickname || profile.nickname || this.nickname;
              this.description = profile.user_metadata.description || profile.description || this.description;
              this.imagePerfil = profile.user_metadata.avatar || this.imagePerfil;
              this.ageBirth = profile.user_metadata.ageBirth;
              if(this.$window.old) {
                this.ageBirth = this.$window.old;
              }
              this.colorBackground = profile.user_metadata.colorBackground || '#transparent';
              this.imageBackground = profile.user_metadata.imageBackground  || '/images/trans.png';
              this.privacidad = profile.user_metadata.privacidad || 'PUBLICO';
              this.enviarNotificacionesAlEmail = profile.user_metadata.enviarNotificacionesAlEmail || 'TRUE';
              this.completeRegister = profile.user_metadata.completeRegister || false;
              this.alreadyLoggedIn = profile.user_metadata.alreadyLoggedIn || false;

              if(!this.completeRegister && this.checkCompleteRegister(profile)) {
                this.confirmCompeteRegister();
              }

              this.promocode = this.promocode || profile.user_metadata.promocode;

              if(!this.completeRegister && profile.identities[0].provider == 'auth0') {
                  this.completeRegister = true;
                  this.updateMeta('completeRegister',true);
              }

              this.configAjaxJquery();

            }
          }
        }

        configAjaxJquery() {

          var token = this.store.get('token');

          $.ajaxSetup({
            'beforeSend': function(xhr) {
              if (token) {
                xhr.setRequestHeader('Authorization',
                      'Bearer ' + token);
              }
            }
          });
        }

        checkCompleteRegister(profile) {
          var existUsername = false;
          var existEmail = false;
          var existAgeBirth = false;
          if(profile.user_metadata && profile.user_metadata.username) {
            existUsername = true;
          }
          if(profile.user_metadata && profile.user_metadata.email) {
            existEmail = true;
          }
          if(profile.user_metadata && profile.user_metadata.ageBirth) {
            existAgeBirth = true;
          }

          if(existUsername && existEmail && existAgeBirth) {
            return true;
          }
        }

        confirmCompeteRegister() {
          this.completeRegister = true;
          this.updateMeta('completeRegister',true);
        }

        getConnection(identities) {
          var connection = 'Username-Password-Authentication';
          if(identities) {
            angular.forEach(identities,function(identity,key) {
              if(identity.isSocial) {
                connection = identity.connection;
              }
            });
          }

          return connection;
        }

        getDescription() {
          var description = '';
          if(this.description && this.description != '-1') {
            description = this.description;
          }
          return description;
        }

        getUsernameFromConnection() {
          var username = this.username;
          var profile = this.currentUser;
          switch (this.connection) {
            case 'twitter':
              username = this.cleanUsername(profile.screen_name);
              break;
            case 'facebook':
              username = this.cleanUsername(profile.nickname);
              break;
            case 'google-oauth2':
              username = this.cleanUsername(profile.nickname);
              break;
            case 'instagram':
              username = this.cleanUsername(profile.nickname);
              break;
          }

          return username;
        }

        cleanUsername(username) {
          if(username) {
            username = this.$filter('clean')(this.$filter('minusculas')(username),true);
          }
          return username;
        }

        getConnectionName() {
          var name = '';
          switch (this.connection) {
            case 'twitter':
              name = 'Twitter';
              break;
            case 'facebook':
              name = 'Facebook';
              break;
            case 'google-oauth2':
              name = 'Google';
              break;
            case 'instagram':
              name = 'Instagram';
              break;
          }

          return name;
        }

        reloadUser(profile) {
            this.auth.profile = profile;
            this.store.set('profile', profile);

            this.setUserProfile(profile);
        }

    }

}
