/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/parse/parse.d.ts" />
/// <reference path="entities/System/SystemMessages.ts" />

declare var s:any;

module ILovePlatos{

    declare var tinymce:any;
    declare var ga:any;
    declare var envioSC:any;
    declare var md5:any;
    declare var _sf_endpt:any;
    declare var _sf_async_config:any;
    declare var cordova:any;
    declare var mRefresh:any;
    declare var navigator:any;
    declare var ImgCache:any;
    declare var window:any;
    declare var screen:any;

    export class MainController implements iMainModel{


        static $inject = [
            "config",
            "$rootScope",
            "$scope",
            "$state",
            "$window",
            "$location",
            "$document",
            "$stateParams",
            "$compile",
            "$http",
            "$templateCache",
            "$filter",
            "auth",
            "FilesService",
            "$sce",
            "store",
            "$cordovaToast"
        ];

        _state = {};
        _user: IUserScope;
        title = '';
        id = 'home';
        customClass = "";
        categoria = '';
        contentBuho = false;
        isMine = false;
        previousType:string;
        previousParams:any;
        prevState:string;
        messages = [];
        activeTab = {};
        menuId = '';
        intervalMessages:number;
        intervalConversaciones:number;
        intervalNotificaciones = {};
        intervalReloadOmniture:any;
        intervalPaginaVista:any;
        searched = false;
        cache = [];
        showNewCard = false;

        //Objeto donde se guarda el preview de la tarjeta cuando se crea una nueva.
        preview:any;

        //Control gallery
        isOpenLightGallery = false;
        selectorLightGallery = '';

        //Composición de clases
        SystemMessages:SystemMessages;

        constructor(private $config:any,
        private $rootScope: IBuhoRootScopeService,public $scope:any,private $state:any,private $window:any,
        private $location:any,private $document:any,public $stateParams:any,private $compile, 
        private $http, private $templateCache,private $filter,private auth, private FilesService,public $sce, public store,
        public $cordovaToast
        ){
            var self = this;

            $(".button-collapse").sideNav();

            this.SystemMessages = new SystemMessages(this);

            if ('scrollRestoration' in $window.history) {
              // Back off, browser, I got this...
              $window.history.scrollRestoration = 'manual';
            }

            $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                self.prevState = from.name;
                self.previousParams = fromParams;
                if( !(to.name == 'home' && from.name == 'home.inicio') ) {
                    jQuery(".overlayer").removeClass("hidden");
                }

                clearInterval(self.intervalMessages);
                clearInterval(self.intervalConversaciones);
                clearInterval(self.intervalReloadOmniture);
                clearTimeout(self.intervalPaginaVista);

                //Recargo las estadsticas de omniture cada 15 minutos.
                self.activeIntervalReloadOmniture();

                angular.forEach(self.intervalNotificaciones,function(value,key){
                    clearInterval(self.intervalNotificaciones[key]);                    
                });

                if(jQuery.inArray(from.name,self.cache) != -1) {
                    self.generateCache(from.name);
                }

                //Reinicio las customClass
                self.customClass = "";

                //Si vengo de pubicar o editar post reinicio la variable preview, 
                //que es donde ser guarda el contenido de un link pegado como por ejemplo de youtube
                if(from.name == 'publicarpost' || from.name == 'editarpost') {
                    self.preview = {};
                }

                //Reseteo los valores del FIleservice
                self.FilesService.setImagePreviewCropperable(false);
                self.FilesService.setImagePreviewSelectable(false);

                //@app --> Resolvemos la recarga de la página
                if(self.isCordovaApp()) {
                    setTimeout(function() {
                        //mRefresh.resolve();
                    },1000);
                }

                //Elimino clases imnecesarias
                angular.element('body').removeClass('flippyFront');
                angular.element('body').removeClass('flippyBack');
                angular.element('body').removeClass('a0-lock-open');
                angular.element('body').removeClass('search-active');
                angular.element('body').addClass('search-inactive');
                setTimeout(function(){
                    angular.element('body').removeClass('search-inactive');
                },1500);

                // Opciones al refrescar la página
                if(!$('#muiRefresh').length) {
                    //self.refreshPage();
                }

            });

            $rootScope.$on('$stateNotFound', function(event) {
              $state.go('notfound');
            });            

            $rootScope.$on('$stateChangeError', function(event) {
              $state.go('notfound');
            });

            //Escuchamos para ver si alguien  pega una url para crear una nueva tarjeta.
            $rootScope.$on('changePreviewPublicar', function (event,preview,redirect) {
                if(preview) {
                    setTimeout(function() {
                        self.preview = preview;
                        self.showNewCard = false;
                    },50);

                    if(redirect) {
                        $state.go(redirect, {}, { reload: true });
                    }
                }
            });

            $('body').on('click', function (e) {
                $('[data-toggle="popover"]').each(function () {
                    //the 'is' for buttons that trigger popups
                    //did not click a popover toggle, or icon in popover toggle, or popover
                    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                        $(this).popover('hide');
                    }
                });
            });

            $scope.$watch('mainCtrl._user.currentUser', function(newUser, oldValue) {
                if(newUser) {
                    self.removeToogleMessageLogin();
                }
            });

            $rootScope.$on('newMainLeido', function (event) {
                $scope.$emit('newNotificacionLeido');                
            });

            $rootScope.$on('newNotificaciones', function (event) {
                $scope.$emit('geAllNotificaciones');                
            });


            //Falta controlar que solo te llegue una vez y que no te las mande cuando tienes la app en foreground
            /*if(typeof(cordova) != 'undefined') {
                $rootScope.$on('newNotificaciones', function (event,numberNotificaciones) {
                    // Schedule notification for tomorrow to remember about the meeting
                    cordova.plugins.notification.local.schedule({
                        id: 10,
                        title: "Nuevas notificaciones!!",
                        text: "Tienes "+numberNotificaciones+" notificaciones nuevas."
                    });

                });

                // Join BBM Meeting when user has clicked on the notification 
                cordova.plugins.notification.local.on("click", function (notification) {
                    if (notification.id == 10) {
                        $state.go('notificaciones');
                    }
                });
            }*/

            angular.element('body').on('click','.message .close',function(event) {
                event.preventDefault();
                angular.element(this).parent().remove();
            });

            //@app --> llamadas especiales para la app
            if(self.isCordovaApp()) {
                //Hacemos que los link se abrán en el navegador
                self.initExternalLink();
                document.addEventListener("deviceready", function() {
                    //Cuando el dispositivo esta listo, ocultamos el spashscreen
                    navigator.splashscreen.hide();
                }, false);

                document.addEventListener("backbutton", function onBackKeyDown() {
                    // Handle the back button
                    if(self.isOpenLightGallery) {
                        jQuery(self.selectorLightGallery).data('lightGallery').destroy(false);
                        return;
                    }

                    if ( self.$state.current.name != 'home' && 
                          self.$state.current.name != 'home.inicio' &&
                          self.$state.current.name != 'home.indexAndroid' &&
                          self.$state.current.name != 'home.indexIOS'
                    ) {
                        window.history.back();
                    } else {
                        navigator.app.exitApp();
                    }

                }, false);
            }

             //Eventos ggeneral
             self.initGeneralEnvent();
        }

        refreshPage() {
            var self = this;
            var opts = { 
                 scrollEl:'body',
                 onBegin: function() {
                    self.deleteAllCache();
                    self.$state.go(self.$state.current, {}, {reload: true});
                 }, //Function 
                 onEnd: null, //Function 
             };
            mRefresh(opts);
        }

        initGeneralEnvent() {
            var self = this;
            angular.element('body').on("focusin","input,textarea", function(event) {
                var name = angular.element(this).attr('name');
                angular.element('body').addClass('focusin-element focusin-element-'+name);
            });
            angular.element('body').on("focusout","input,textarea", function(event) {
                var name = angular.element(this).attr('name');
                angular.element('body').removeClass('focusin-element focusin-element-'+name);
                angular.element('body').addClass('focusout-element focusout-element-'+name);
                setTimeout(function(){
                    angular.element('body').removeClass('focusout-element focusout-element-'+name);
                },1500);
            });
            document.addEventListener('copy', function(e:any){
                if(angular.element(e.currentTarget.activeElement).hasClass("copyUrl")) {
                    var url = self.$config.domainFront+window.location.pathname;
                    e.clipboardData.setData('text/plain', url);
                    e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
                    self.resetMessages();
                    self.setMessage({type:"success",text:"Url copiada con exito"});
                }
            });
            $(document).on("pagecontainerbeforechange", function (e, data) {
                console.log('go');
                if (typeof data.toPage == "string" && data.options.direction == "back" && data.prevPage[0].id == "PageX") {
                    data.toPage = "#pageY"; /* redirect to pageY */
                    data.options.transition = "flip"; /* optional */
                }
            });
            //Controlo el back button
            this.$scope.$on('$locationChangeStart', function(event, next, current){
                // Handle the back button
                //Si esta abierta la galería y pulso hacia atrás cierro la galería
                if(self.isOpenLightGallery) {
                    jQuery(self.selectorLightGallery).data('lightGallery').destroy(false);
                    event.preventDefault();
                    return;
                }
            });
            //Añado clase de tipo orientación del dispositivo
            function setOrientation() {
                if(self.isCordovaApp()) {
                    if(screen.orientation.type.search('landscape') > -1) {
                        angular.element('body').removeClass('portrait');
                        angular.element('body').addClass('landscape');
                    }else {
                        angular.element('body').addClass('portrait');
                        angular.element('body').removeClass('landscape');
                    }
                }else {
                    var width = angular.element(window).width();
                    var height = angular.element(window).height();
                    if( width > height  ) {
                        angular.element('body').removeClass('portrait');
                        angular.element('body').addClass('landscape');
                    }else {
                        angular.element('body').addClass('portrait');
                        angular.element('body').removeClass('landscape');
                    }
                }
            }

            setTimeout(function() {
                setOrientation();
            },50);

            angular.element(window).resize(function() {
                setOrientation();
            });
            //Si estoy en la aplicación móvil
            if(false && this.isCordovaApp()) {
                //Animaciones entre páginas
                this.$rootScope.$on('$viewContentLoaded', function(event, toState, toParams, fromState, fromParams, options){ 
                    var options:any= {
                      "direction"        : "up", // 'left|right|up|down', default 'left' (which is like 'next')
                      "duration"         :  400, // in milliseconds (ms), default 400
                      "slowdownfactor"   :    -1, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
                      "slidePixels"      :   -1, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
                      "iosdelay"         :  250, // ms to wait for the iOS webview to update before animation kicks in, default 60
                      "androiddelay"     :  250, // same as above but for Android, default 70
                      "winphonedelay"    :  250, // same as above but for Windows Phone, default 200,
                      "fixedPixelsTop"   :    0, // the number of pixels of your fixed header, default 0 (iOS and Android)
                      "fixedPixelsBottom":   60  // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
                    };

                    /*if(
                        self.$state.current.name == 'home' || 
                        self.$state.current.name == 'home.android' ||
                        self.$state.current.name == 'home.ios'
                    ) {*/
                        window.plugins.nativepagetransitions.slide(
                            options,
                            function () {
                              //console.log('------------------- slide transition finished');
                            },
                            function (msg) {
                              alert('error: ' + msg);
                        });
                    //}
                 });
            }
        }

        setOmniture(params,action?) {

            var self = this;

            if(params.tags) {
                params.tags = self.$filter('concatenar')(params.tags,',');
            }

            angular.forEach(params,function(value,key) {
                params[key] = self.$filter('clean')(self.$filter('minusculas')(value));
            });

            var dispositivo = this.getDispositivo();
            var versionSite = this.getVersionSite();

            var logged = 'Not Logged';
            var username = '';
            if(this.auth && this.auth.profile) {
                logged = "Logged"

                if(this.auth.profile.user_metadata) {
                    username = this.auth.profile.user_metadata.username || this.auth.profile.username;
                }else {
                    username = this.auth.profile.username;
                }

                username = md5(username);
            }


            s.pageType="";
            s.pageName=window.location.href;                  // URL del site
            s.channel=params.seccion;                        // Sección del site
            s.prop1=params.subseccion1;                  // Subsección 1
            s.prop2=params.subseccion2;                  // Subseccion 2
            s.prop3=params.subseccion3;                  // Subseccion 3
            s.prop4=params.subseccion4;                  // Subseccion 4
            s.prop6=params.titular+'-'+params.id;                  // Titular Página + ID único de página
            s.prop7="buhomag.com";               // Site - nombre del site (valor fijo)
            s.prop29=params.tags;                 // Tags de la noticia separados por comas
            s.list2=params.tags;                  // Tags de la noticia separados por comas
            s.prop27=versionSite;                 // Versión Site (web - movil)
            s.prop30=params.multimedia;                 // Multimedia - pasar si el contenido tiene foto o video o combinación de las dos separada por guion medio
            s.prop31=s.channel;             // Sección (no hay que rellenar nada)
            s.prop32=params.tipo;                 // Tipo de Contenido  (noticia / blog / especial / home / videos / portadillas / tags / estaticos / albumes, etc..)
            s.prop34=dispositivo;                 // Dispositivo de visualización (pc o movil)
            
            s.prop39="nuevo";                // Contenido nuevo etiquetado (VALOR FIJO)
            if(params.status) {
                s.prop39 = params.status;
            }

            s.prop75=params.autor;                 // Autor de Contenido de noticia o blog

            var hier1 = [];
            if(s.prop7) {
                hier1.push(s.prop7);
            }
            if(s.channel) {
                hier1.push(s.channel);
            }
            if(s.prop1) {
                hier1.push(s.prop1);
            }
            if(s.prop2) {
                hier1.push(s.prop2);
            }
            if(s.prop3) {
                hier1.push(s.prop3);
            }
            if(s.prop4) {
                hier1.push(s.prop4);
            }
            if(s.prop32) {
                hier1.push(s.prop32);
            }

            s.prop15 =  logged;
            s.eVar15 =  logged;

            s.hier1=hier1.join('|');                  // Variable de jerarquía. El separador a utilizar debe ser la barra "|". Concatenación de s.prop7+s.channel+prop1+prop2+prop3+prop4+prop32
            if(this.auth && this.auth.profile) {
                s.prop26 =  username;
                s.eVar32 = username;
            }else {
                s.prop26 =  null;
                s.eVar32 = null;
            }

            if(action == 'registro1') {
                s.events="event55,event56";
                s.eVar7="registro";
            }else if(action == 'registro2') {
                s.events="event57,event58";
                s.eVar7="registro";
            }else if(action == 'registro3') {
                s.events="event59,event60";
                s.eVar7="registro";
            }else {
                s.events=null;
                s.eVar7=null;
            }

            s.eVar1=s.channel;
            s.eVar2=s.prop1;
            s.eVar3=s.prop2;
            s.eVar4=s.prop3;
            s.eVar35=s.prop4;
            s.eVar31=s.prop6;
            s.eVar36=s.prop7;
            s.eVar29=s.prop29;
            s.eVar27=s.prop27;
            s.eVar30=s.prop30;
            s.eVar45=s.prop32;
            s.eVar34=s.prop34;
            s.eVar39=s.prop39;
            s.eVar75=s.prop75;
        }

        extendsOmniture(params) {
            s = $.extend(s,params);
        }

        envioSC(event,eventName) {
            if(event) {
                event.preventDefault();
            }
            if(eventName && this.auth.profile) {
                envioSC(eventName);
            }
        }

        getDispositivo() {
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                return 'movil';
            }else {
                return 'pc';
            }
        }

        getVersionSite() {
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                return 'movil';
            }else {
                return 'web';
            }
        }

        activeIntervalReloadOmniture() {
            var self = this;
            this.intervalReloadOmniture = setTimeout(function() {
                self.$window.location=location.href;
            },1000*60*15);
        }

        sendOmniture() {
            //@app -> metemos condición para llamar a android desde omniture
            if( s && typeof(s.t) != 'undefined' && (document.domain == 'buhomag.com' || document.domain == 'www.buhomag.com' || document.location.pathname.search("/android_asset/www") > -1) ) {
                s.t();
            }
        }

        sendGoogleAnalytics() {
            if(typeof(ga) != 'undefined') {
                ga('send', 'pageview');
            }
        }

        setCache(name) {
            if(jQuery.inArray(name,this.cache) < 0 ) {
                this.cache.push(name);
            } 
        }

        deleteAllCache() {
            var self = this;
            var cache = jQuery.extend([],self.cache);
            self.cache = [];
            angular.forEach(cache,function(name,key){
                self.deleteCache(name);
            });
        }

        deleteCache(name) {
            if(name) {
                if(this.$state.get(name).templateOldUrl) {
                    this.$state.get(name).templateUrl = this.$state.get(name).templateOldUrl;
                }
                this.$state.get(name).cache = null;
                this.removeState(name);
            }
        }

        generateCache(name) {
            var self = this;
            var cache = angular.element('[ui-view]').html();

            if( name == 'home' || name == 'home.inicio') {

                    var cacheDestacado = angular.element('.destacado').html();
                    var cacheWall = angular.element('.wall').html();

                    if(!self.$state.get('home').templateOldUrl) {
                        var homeState = jQuery.extend({},this.$state.get('home'));
                        self.$state.get('home').templateOldUrl = homeState.templateUrl;
                    }
                    self.$state.get('home').templateUrl = 'partials/cache/cache-home.html';
                    self.$state.get('home').cache = {
                        cacheDestacado: cacheDestacado,
                        cacheWall: cacheWall
                    };

                    if(!self.$state.get('home.inicio').templateOldUrl) {
                        var homeState = jQuery.extend({},this.$state.get('home.inicio'));
                        self.$state.get('home.inicio').templateOldUrl = homeState.templateUrl;
                    }
                    self.$state.get('home.inicio').templateUrl = 'partials/cache/cache-home.html';
                    self.$state.get('home.inicio').cache = {
                        cacheDestacado: cacheDestacado,
                        cacheWall: cacheWall
                    };

            }else {
                if(!this.$state.get(name).templateOldUrl) { 
                    var currentState = jQuery.extend({},this.$state.get(name));
                    this.$state.get(name).templateOldUrl = currentState.templateUrl;
                }
                this.$state.get(name).templateUrl = 'partials/cache/cache-'+name+'.html';
                
                this.$state.get(name).cache = {
                        cacheDestacado: cacheDestacado,
                        cacheWall: cacheWall
                    };
            }
            
        }

        getCache() {
            var name = this.$state.current.name;

            if( name == 'home' || name == 'home.inicio') {
                var cacheDestacado =  this.$state.current.cache.cacheDestacado;
                var cacheWall =  this.$state.current.cache.cacheWall;
                angular.element('.cacheDestacado').replaceWith(cacheDestacado);
                angular.element('.cacheWall').html(cacheWall);
            }

            setTimeout(function(){
                jQuery(".overlayer").addClass("hidden");
            },50);

        }

        redirectPromoCode() {
            this.$state.go('promocode');
        }

        redirectSignin() {
            this.$state.go('signin');
        }

        createNewCard() {
            if(this._user.isLogged()) {
                if(this.showNewCard) {
                    this.showNewCard = false;
                }else {
                    this.showNewCard = true;
                }
            }
        }

        processBarRefresh = 0;
        timeRefresh = 1000;
        intervalTime = 10;
        intervalRefresh = null;

        getProcessBarRefresh() {
            return this.processBarRefresh.toString();
        }

        onReload() {
          var self = this;
          angular.element('body').bind('touchmove', function(ev) {
            var top = angular.element(window).scrollTop();
            if(top == 0 && !self.intervalRefresh) {

                angular.element('.refresh').show();

                self.processBarRefresh = self.processBarRefresh  + (self.intervalTime / self.timeRefresh * 100);
                self.intervalRefresh = setInterval(function(){

                    top = angular.element(window).scrollTop();
                    if(top == 0 &&  self.processBarRefresh != 100) {
                        self.processBarRefresh = self.processBarRefresh  + (self.intervalTime / self.timeRefresh * 100);
                        if( !self.$scope.$$phase  ) {
                            self.$scope.$apply();
                        }
                    }

                },self.intervalTime);

            } else if(top > 0 && self.intervalRefresh) {
                self.processBarRefresh = 0;
                clearInterval(self.intervalRefresh);
                angular.element('.refresh').hide();
            }
          });

          angular.element('body').bind('touchend', function(ev) {
            if(self.processBarRefresh == 100) {
                var path = window.location
                window.location = path;
            }
            self.processBarRefresh = 0;
            if( !self.$scope.$$phase  ) {
                self.$scope.$apply();
            }
            clearInterval(self.intervalRefresh);
            self.intervalRefresh = null;
            angular.element('.refresh').hide();
          });
        }

        isInitChatBeat = false;
        initChartBeat() {
                if(!this.isInitChatBeat) {

                    var urlChartbeat = 'http://static.chartbeat.com/js/chartbeat.js';

                    //@app --> Si es una aplicación mobile sustituimos el protocolo
                    if(this.isCordovaApp()) {
                        urlChartbeat = this.$config.protocolFront+this.$config.domainFront+'/external-librery/chartbeat';
                    }

                    _sf_endpt = (new Date()).getTime();
                    var e = document.createElement('script');
                    e.setAttribute('language', 'javascript');
                    e.setAttribute('type', 'text/javascript');
                    e.setAttribute('src', urlChartbeat);
                    document.body.appendChild(e);

                    this.isInitChatBeat = true;
                }
        }

        setChartBeat(config) {
            if(typeof(config) == 'object') {
                _sf_async_config = jQuery.extend(_sf_async_config,config);
            }
        }

        initTinymce(options,timeout?) {
            var self = this;
            if(!timeout) {
                timeout = 0;
            }
            var defaultOptions = {
                selector: '#contenidoText', //#contenidoText
                height: 300,
                theme: 'modern',
                //statusbar: true,
                toolbar:'undo redo | bold italic underline bullist numlist blockquote | link',
                menubar: false,
                paste_as_text: true,
                plugins: ["paste","link"],
                setup: function(editor) {
                    editor.on('change', function(e) {
                       $('#'+editor.targetElm.id).html(editor.save()).trigger('input');
                    });
                    editor.on('focusin', function(e) {
                        var name = angular.element(this).attr('id');
                        angular.element('body').addClass('focusin-element focusin-element-'+name);
                    });
                    editor.on('focusout', function(e) {
                        var name = angular.element(this).attr('id');
                        angular.element('body').removeClass('focusin-element focusin-element-'+name);
                        angular.element('body').addClass('focusout-element focusout-element-'+name);
                        setTimeout(function(){
                            angular.element('body').removeClass('focusout-element focusout-element-'+name);
                        },1500);
                    });
                },
                external_plugins: {
                    'mention' : 'js/bower_components/tinymce-mention/mention/plugin.js'
                },
                body_class:'dtl-cuerpo',
                content_css: 'js/bower_components/tinymce-mention/css/rte-content.css,css/styles-tinymce.css',
                skin_url: 'js/bower_components/tinymce/skins/lightgray',
                mentions:{
                    delay: 500,
                    queryBy: 'id',
                    items: 5,
                    delimiter: ['#','@'],
                    insert: function(item) {
                        var template = '<span class="hashtag"><a href="/hashtags/'+item.id+'">#' + item.id + '</a></span>';
                        if(item.type && item.type == 'perfiles') {
                            template = '<span class="mention"><a href="/perfil/'+item.id+'">@' + item.id + '</a></span>';
                        }
                        return template;
                    },
                    source: function (query, process, delimiter) {
                        if (delimiter === '#') {
                            $.getJSON(self.$config.protocolApirest+self.$config.domainApirest+'/public/hashtags', function (data) {
                                if(query) {
                                    var queryClean = self.$filter('clean')(self.$filter('minusculas')(query));                                    
                                    data.data.unshift({id:queryClean});
                                }
                                process(data.data);
                            });
                        }
                        else if (delimiter === '@') {
                            $.getJSON(self.$config.protocolApirest+self.$config.domainApirest+'/public/perfiles?filter[usuarios]='+query, function (data) {
                                process(data.data);
                            });
                        }
                    }
                }
            };

            options = jQuery.extend(defaultOptions,options);

            setTimeout(function() {
                var i, t = tinymce.editors;
                for (i in t){
                    if (t.hasOwnProperty(i)){
                        t[i].remove();
                    }
                }
                tinymce.init(options);
            },timeout);
        }

        updateState(nameState:string, state) {
            var self =this;
            if(nameState && typeof(nameState)=='string' && state) {
                if(!this._state[nameState]) {
                    this._state[nameState] = {}
                }

                angular.forEach(state, function(value, key) {
                    self._state[nameState][key] = value;
                });

            }
        }

        removeState(nameState,deleteAllcompose?) {
            if(!deleteAllcompose) {
                delete this._state[nameState];
            }else if(deleteAllcompose) {
                angular.forEach(this._state,function(value,property){
                    if(property.indexOf(this._state[nameState]) != -1) {
                        delete this._state[nameState];
                    }
                });
            }
        }

        existState(nameState:string) {
            if(nameState && typeof(nameState)=='string' && this._state[nameState]) {
                return true;
            }
            return false;
        }

        getState(nameState:string) {
            if(nameState && typeof(nameState)=='string' && this._state[nameState]) {
                return this._state[nameState];
            }
            return false;
        }

        redirect404() {
            this.$state.go('notfound');
        }

        goToPublicarPost() {
            this.showNewCard = false;
            this.$state.go('publicarpost', {}, { reload: true });
        }

        goToScrollTop(event?) {
            if(event) {
                event.preventDefault();
            }
            var body = angular.element("html, body");
            body.stop().animate({scrollTop:0}, '500', 'swing');
        }

        //Métodos para controla la recarga de la página
        goToHome(event) {
            if($(document).scrollTop() > 0 && 
                (this.$state.current.name == 'home' || 
                  this.$state.current.name == 'home.inicio' || 
                  this.$state.current.name == 'home.index' || 
                  this.$state.current.name == 'home.indexAndroid' ||
                  this.$state.current.name == 'home.indexIOS'
                )
            ) {
                event.preventDefault();
                this.goToScrollTop();
                //Todo->hacer que se refresque la página
                //this.$scope.$broadcast('refreshHome',true);
            }
        }

        goToBuscador(event) {
            if($(document).scrollTop() > 0 && 
                (this.$state.current.name == 'buscador' 
                )
            ) {
                event.preventDefault();
                this.goToScrollTop();
            }
        }

        goToSecciones(event) {
            if($(document).scrollTop() > 0 && 
                (this.$state.current.name == 'categorias' 
                )
            ) {
                event.preventDefault();
                this.goToScrollTop();
            }
        }

        goToMiPerfil(event) {
            if($(document).scrollTop() > 0 && 
                (this.$state.current.name == 'mi-perfil' 
                )
            ) {
                event.preventDefault();
                this.goToScrollTop();
                this.$scope.$broadcast('refreshMiPerfil',true);
            }
        }

        getEmailContacto() {
            return this.$config.emailContacto;
        }

        isCordovaApp() {
            if(typeof(cordova) != 'undefined') {
                return true;
            }
            return false;
        }

        isShowScrollTop() {
            angular.element(document).scroll(function() {
                var scrollTop = angular.element('body').scrollTop();
                var irArriba = angular.element('#irArriba');

                if( scrollTop > 500 &&  !irArriba.hasClass('irArriba-show') ) {
                    irArriba.addClass('irArriba-show');
                    irArriba.fadeIn(1000);
                }
                else if(scrollTop < 500 && irArriba.hasClass('irArriba-show')) {
                    irArriba.removeClass('irArriba-show');
                    irArriba.fadeOut(1000);
                }
            });
        }

        getIdByUrl(id) {
            if(!id) {
                return this.$stateParams.id;
            }else {
                return id;
            }
        }

        copyUrl(event) {
            event.preventDefault();
            document.execCommand("copy");
        }

        cleanRelativeUrl(url) {
            if(url && url.indexOf('http') < 0 && url.indexOf('data') < 0) {
                url = '//'+url;
            }
            return url;
        }

        isActive(name):boolean {
            var stateName = this.$state.current.name;
            if(jQuery.inArray( stateName, name ) != -1) {
                return true;
            }
            return false;
        }

        setTitle(title) {
            this.title = title;
            if( !this.$scope.$$phase  ) {
                this.$scope.$apply();
            }
        }

        setId(id) {
            if(id) {
                this.id = id;
            }
            if( !this.$scope.$$phase  ) {
                this.$scope.$apply();
            }
        }

        setCustomClass(customClass) {
            if(customClass && customClass.length > 0) {
                this.customClass = customClass.join(" ");
            }
        }

        setMenuId(menuId) {
            //Fuerzo a que siempre apareza el menú de login si no estas logueado
            if(!this._user.currentUser) {
                menuId = 'login';
            }
            else if(this._user.username == this.$stateParams.username) {
                return this.menuId = null;
            }
            this.menuId = null;
            if(menuId) {
                this.menuId = menuId;
                var self = this;
                setTimeout(function(){
                    var url = 'partials/menus/'+menuId+'.html';
                    self.$http.get(url, {cache: self.$templateCache}).success(function(tplContent) {
                        angular.element('#context-menu').append(self.$compile(tplContent)(self.$scope));
                    });
                    angular.element('.dropdown-menu').remove();
                },50);
            }
        }

        setMenuAction(selectorId,menuId) {
            if(menuId) {
                var self = this;                
                setTimeout(function(){
                    var scope = angular.element(selectorId).scope();
                    var url = 'partials/menus/'+menuId+'.html';
                    self.$http.get(url, {cache: self.$templateCache}).success(function(tplContent) {
                        angular.element(selectorId).find('.actions-menu').append(self.$compile(tplContent)(scope));
                    });
                },50);
            }
        }

        setPrevious(previousType,previousParams) {
            if(previousType) {
                this.previousType = previousType;
            }
            if(previousParams) {
                this.previousParams = previousParams;
            }
        }

        goBack(event,params) {
            if(event) {
                event.preventDefault();
            }
            if(this.previousType == 'history' && this.$state.current.name == "signin"){
                this.$state.go("home" );
            }
            else if(this.previousType == 'history') {
                this.$window.history.back();
            }else if(this.previousType == 'goBack') {
                this.previousParams = $.extend(this.previousParams,params);
                if(!this.prevState) {
                    this.$state.go("home" , this.previousParams);    
                }else {
                    this.$state.go(this.prevState ,this.previousParams);
                }
            }else{
                this.$state.go(this.previousType ,this.previousParams);
            }

        }

        go(name,params) {
                this.$state.go(name , params);    
        }

        isPageMiPerfil() {
            return (this.id == 'perfil-privado');
        }

        isPagePerfil() {
            return (this.id == 'perfil-publico');
        }

        //----------------- SystemMessages -------------------------//
        resetMessages() {
            return this.SystemMessages.resetMessages();
        }

        setMessage(message) {
            this.SystemMessages.setMessage(message);
        }

        closeMessage(event,index) {
            this.SystemMessages.closeMessage(event,index);
        }

        isAdviseVissibleByName(name) {
            return this.SystemMessages.isAdviseVissibleByName(name);
        }

        showAdvise(target,id) {
            return this.SystemMessages.showAdvise(target,id);
        }

        closeAdvise(name,ttl) {
            this.SystemMessages.closeAdvise(name,ttl);
        }

        setTTLAdvise(name,ttl) {
            this.SystemMessages.setTTLAdvise(name,ttl);
        }
        //-----------------------------------------------------------------------//

        capitalizeFirstLetter(string:string):string {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        toggleShare() {
            angular.element('#compartir').popover();
        }

        toggleMessageLogin() {
            if(!this._user.isLogged()) {
                setTimeout(function(){
                    angular.element('.not-login').popover();
                },1000);
            }
        }

        removeToogleMessageLogin() {
                angular.element('.not-login').popover('destroy');
        }

        renderMessageLogIn() {
            return '<p><a href="'+this.$state.href('signin')+'">Únete a BÚHO.</a></p>';
        }

        regenereWall(selector) {
            setTimeout(function(){
                jQuery(selector).each(function(){
                    jQuery(this).find('.brick').eq(0).css({left:0});
                });
                jQuery(selector).masonry('layout');
                jQuery(selector).masonry('reloadItems');
            },10);
        }

        customTab = {};

        initCustomTab(tabId,values) {
            this.customTab[tabId] = values;
        }

        activeCustomTab(tabId,key) {
            if(key == 'auto') {
                key = this.$stateParams.tab;
            }
            if(this.customTab[tabId]) {
                    for(var e = 0; e < this.customTab[tabId].length; e++) {
                        this.customTab[tabId][e] = false;  
                    }
                    this.customTab[tabId][key] = true;
            }
        }

        activeTooltip() {
            setTimeout(function() {
                $(function () {
                  $('[data-toggle="tooltip"]').tooltip({html:true});
                });
            },1000);
        }

        hideLogin() {
            angular.element('.a0-lock-container').hide();
        }

        showLogin() {
            angular.element('.a0-lock-container').show();
        }

        setContentBuho(isContent) {
            this.contentBuho = isContent;
        }

        setMine(isMine) {
            this.isMine = isMine;
        }

        isLinkBuho() {
            return this.contentBuho;
        }

        //Solo para la app movil, hacemos que los link si son internos se conviertan en relativos y si son externos se abrán en el navegador.
        initExternalLink() {
            var self = this;
            jQuery('body').on('click','.dtl-cuerpo a,.compartir li.blank a,.lista-comentarios a',function(event){

                if(jQuery(this).hasClass("link-lightgallery")) {
                    return null;
                }

                event.preventDefault();
                var href = jQuery(this).attr('href');
                if(href) {
                    //Lo de menor de 25 es por si es un enlace de compartir en redes sociales
                    if(href.search('buhomag.com') != -1 && href.search('buhomag.com') < 25) {
                        href = href.replace("buhomag.com","");
                        href = href.replace("://","");
                        href = href.replace("http","");
                        href = href.replace("https","");
                        href = href.replace("www.","");
                        self.$location.path(href);
                        if( !self.$scope.$$phase  ) {
                            self.$scope.$apply();
                        }
                    }else {
                        window.open(href, '_system');
                    }
                }
            });
        }

    }

}
