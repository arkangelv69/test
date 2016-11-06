/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="entities/System/SystemMessages.ts" />

declare var s:any;

module ILovePlatos{

    declare var tinymce:any;
    declare var ga:any;
    declare var md5:any;
    declare var cordova:any;
    declare var mRefresh:any;
    declare var navigator:any;
    declare var ImgCache:any;
    declare var window:any;
    declare var screen:any;
    declare var map:any;
    declare var marker:any;
    declare var strictBounds:any;
    declare var position:any;

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
        position:any = {};

        //Composición de clases
        SystemMessages:SystemMessages;

        constructor(private $config:any,
        private $rootScope: IBuhoRootScopeService,public $scope:any,private $state:any,private $window:any,
        private $location:any,private $document:any,public $stateParams:any,private $compile, 
        private $http, private $templateCache,private $filter,private auth, private FilesService,public $sce, public store,
        public $cordovaToast
        ){
            var self = this;

            this.SystemMessages = new SystemMessages(this);

            if ('scrollRestoration' in $window.history) {
              // Back off, browser, I got this...
              $window.history.scrollRestoration = 'manual';
            }

            $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                $('.button-collapse').sideNav('hide');
            });

            $rootScope.$on('$stateNotFound', function(event) {
              $state.go('notfound');
            });            

            $rootScope.$on('$stateChangeError', function(event) {
              $state.go('notfound');
            });

            //@app --> llamadas especiales para la app
            if(self.isCordovaApp()) {
                document.addEventListener("deviceready", function() {
                    //Cuando el dispositivo esta listo, ocultamos el spashscreen
                    navigator.splashscreen.hide();
                }, false);

                document.addEventListener("backbutton", function onBackKeyDown() {
                }, false);
            }

             //Eventos ggeneral
             self.initGeneralEnvent();

             this.localizame();

            var range = this.store.get("range");
            if(range) {
                this.position.range = range;
            }else {
                this.position.range = 2;
            }
        }

        refreshPage() {
            var self = this;
            var opts = { 
                 scrollEl:'body',
                 onBegin: function() {
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
                if (typeof data.toPage == "string" && data.options.direction == "back" && data.prevPage[0].id == "PageX") {
                    data.toPage = "#pageY"; /* redirect to pageY */
                    data.options.transition = "flip"; /* optional */
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

            $(".button-collapse").sideNav({
                closeOnClick: false,
            });
        }

        isHome() {
            if(this.$state.current.name == 'home' || this.$state.current.name == 'home.inicio' || this.$state.current.name == ''){
                return true;
            }else {
                return false;
            }
        }

        localizame() {
           //navigator.geolocation.getCurrentPosition(this.coordenadas);
           //40.396761351388115
           //-3.489304971752527
           //40.4236838
           //-3.5370896
           this.position.lat = 40.4285944;
           this.position.lng = -3.5621125999999776;
        }
     
        coordenadas(){
           this.position.lat = position.coords.latitude;
           this.position.lng = position.coords.longitude;
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

        sendGoogleAnalytics() {
            if(typeof(ga) != 'undefined') {
                ga('send', 'pageview');
            }
        }

        redirectSignin() {
            this.$state.go('signin');
        }

        processBarRefresh = 0;
        timeRefresh = 1000;
        intervalTime = 10;
        intervalRefresh = null;

        getProcessBarRefresh() {
            if(this.processBarRefresh) {
                return this.processBarRefresh.toString();
            }
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

        redirect404() {
            this.$state.go('notfound');
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
                //this.$state.go(this.previousType ,this.previousParams);
                this.$window.history.back();
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

        hideLogin() {
            angular.element('.a0-lock-container').hide();
        }

        setMine(isMine) {
            this.isMine = isMine;
        }

        isLinkBuho() {
            return this.contentBuho;
        }

    }

}
