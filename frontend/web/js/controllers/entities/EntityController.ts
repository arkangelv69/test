/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../services/ContenidoApirestService.ts" />

module ILovePlatos{

    export class EntityController implements iEntityModel{
        static $inject = [
            "config",
            "ContenidoApirestService",
            "DateService",
            "$rootScope",
            "$controller",
            "$stateParams",
            "$scope",
            "$state",
            "$element",
            "$sce",
	"auth",
            "store"
        ];

        _state:any;
        _parent:IMainScope;
        _main:IMainScope;
        _user:IUserScope;
        contents: any;
        cola = [];
        total = 0;
        lastUpdate: Date;
        nameState: string;
        scrollTop:number;
        currentState: iEntityApirest;
        nextState: iEntityApirest;
        terminadas: iEntityApirest;
        startPage = 1;
        id:string;
        isProcessUpdate = false;
        type = null;
        isSubmit = false;

        constructor(protected $config:any,protected svc,protected DateService,
        protected $rootScope: IBuhoRootScopeService,$controller:any,protected $stateParams:any,protected $scope:any,protected $state:any,private $element:any,protected $sce:any, protected auth, protected store){
            //Seteo el controlador principal
            this._main = $rootScope.$$childHead.mainCtrl;
            this._user = $rootScope.$$childHead.$$childHead.userCtrl;
            this._parent = $scope.$parent;
            $scope.newContents = 0;
        }

        /*{
            @params:{
                nameState:string,
                filterType:string,
                filterId:number
                cache:boolean
            }
        }*/
        render(params):any {

            if(!params.nameState) {
                return '';
            }

            if( typeof(params.cache) == 'undefined' )  {
                params.cache = true;
            }

            var self:EntityController = this;
            var svc: ng.IPromise<iEntityApirest>;

            if(!params || !params.filterId) {
                params.filterId = '';
            }
            else if(params && params.filterType == 'userId' && params.filterId == 'auto') {
                    if(this.$state.current.name == 'perfil') {
                        params.filterId = this.$stateParams.username;
                    }else if(this._user.isLogged()){
                        params.filterId = this._user.username;
                    }
            }
            else if(params && params.filterId == 'auto') {
                params.filterId = this.$stateParams.id;
            }
            this.id  = params.filterId;

            params.nameState = params.nameState || '';

            var nameState:string = params.nameState+params.filterId;
            this.nameState = nameState;

            if( this._main.existState(nameState) && params.cache) {

                var state:EntityController = this._main.getState(nameState);

                this.setFactory(state);

                this.goToCurrentScrollTop();
                
            }else {

                svc = this.getFactory(params);

                if (params.nameState && nameState && svc && svc.then) {
                    return svc.then(()=>{
                        self.$scope.newContents ++;
                        self.goToCurrentScrollTop(0);
                        self._main.updateState(nameState,{
                            contents: self.contents,
                            cola: self.cola,
                            currentState: self.currentState,
                            nextState: self.nextState,
                            scrollTop: self.scrollTop
                        });
                    });
                }
            }
        }

        updateStateContent(nameState,content) {
            if(!nameState || !content || !content.id) {
                return null;
            }
            var name = nameState+content.id;
            this._main.updateState(name,{
                content: content
            });
        }

        setFactory(state) {
            this.contents = state.contents;
            this.cola = state.cola;
            this.currentState = state.currentState;
            this.nextState = state.nextState;
            this.scrollTop = state.scrollTop;
            this.$scope.newContents ++;
        }

        getFactory(params) {
            var svc;

            if(params && params.filterType == 'categoriaId' && params.filterId) {
                svc = this.getByCategoria(params.filterId);
            }
            else if(params && params.filterType == 'userId' && params.filterId) {
                    svc = this.getByUserId(params.filterId);
            }
            else if(params && params.filterType == 'contenidoId' && params.filterId) {
                svc = this.getByContenidoId(params.filterId);
            }
            else if(params && params.filterType == 'id' && params.filterId) {
                svc = this.getById(params.filterId);
            }else {
                svc = this.getAll();
            }
            return svc;
            
        }

        getAll(): ng.IPromise<any> {
            var self:EntityController = this;
            return this.svc.getAll().then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data);
                self.lastUpdate = self.getLastUpdate(contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.svc.getByLink(url).then((contents: iEntityApirest) => {
                        self.cola = jQuery.extend([],contents.data);
                        self.nextState = jQuery.extend({},contents);
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }                

            });
        };

        getByCategoria(entityId:string): ng.IPromise<any> {

            var self:EntityController = this;
            return this.svc.getByCategoria(entityId,this.startPage).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.svc.getByLink(url).then((contents: iEntityApirest) => {
                        self.nextState = jQuery.extend({},contents);
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }                

            })
        }

        getByContenidoId(contenidoId:string): ng.IPromise<any> {

            var self:EntityController = this;
            return this.svc.getByContenidoId(contenidoId,this.startPage).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data);                
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.svc.getByLink(url).then((contents: iEntityApirest) => {
                        self.nextState = jQuery.extend({},contents);
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }                

            })
        }

        getByComentarioId(comentarioId:string): ng.IPromise<any> {

            var self:EntityController = this;
            return this.svc.getByComentarioId(comentarioId).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.svc.getByLink(url).then((contents: iEntityApirest) => {
                        self.nextState = jQuery.extend({},contents);
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }                

            })
        }

        getTotalByContenidoId(contenidoId:string): ng.IPromise<any> {

            var self:EntityController = this;
            return this.svc.getTotalByContenidoId(contenidoId).then((total: any) => {
                if(total && total.data && total.data.attributes && total.data.attributes.total) {
                    self.total = total.data.attributes.total;
                }
            });
        }

        getCategorias(contenido) {
            var categorias:any;
             if(contenido && contenido.relationships && contenido.relationships.categorias) {                
                categorias = contenido.relationships.categorias;
                return categorias.data;
             }
             return false;
        }


        getLastUpdate(data) {
            if( data[0] && data[0].attributes && data[0].attributes.fecha) {                
                var date = this.DateService.getDateFromFecha(data[0].attributes.fecha);

                return date;
            }
            return new Date();
        }

        getById(entityId:string): ng.IPromise<any> {

            var self:EntityController = this;
            return this.svc.getById(entityId).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = contents.data;                
            })
        }

        getByUserId(userId:string): ng.IPromise<any> {

            var self:EntityController = this;
            return this.svc.getByUserId(userId).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.svc.getByLink(url).then((contents: iEntityApirest) => {
                        self.nextState = jQuery.extend({},contents);
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }

            })
        }

        add(entity,user?){
            if(!entity) {
                return null;
            }
            if(!this.isSubmit ) {
                this.isSubmit = true;
                var self = this;
                return this.svc.add(entity)
                    .then((response: iEntityApirest) => {
                        if(response && response.data) {
                            self.isSubmit = false;
                            self.contents.push(response.data);
                        }
                    },(error: any) => {
                        self.isSubmit = false;
                        console.log(error);
                    });
            }
        }

        delete(entity,user?) {
            if(!entity) {
                return null;
            }
            if(!this.isSubmit ) {
                this.isSubmit = true;
                var self = this;
                return this.svc.delete(entity)
                    .then((response: iEntityApirest) => {
                        if(response && response.data) {
                            self.isSubmit = false;
                            var target = null;
                            angular.forEach(self.contents,function(value, key) {
                                if(value.id == entity.data.attributes.id) {
                                    target = key;
                                }
                            });
                            if(target || target === 0) {
                                self.contents.splice(target,1);
                            }
                        }
                    },(error: any) => {
                        self.isSubmit = false;
                        console.log(error);
                    });
            }
        }

        existNewContent() {
            var self:EntityController = this;
            return this.svc.getAll().then((contents: iEntityApirest) => {
                var lastUpdate = self.getLastUpdate(contents.data);
                var currentLastUpdate = self.lastUpdate;

                if(lastUpdate.getTime() > currentLastUpdate.getTime()) {
                    console.log('existe nuevo contenido');
                }else {
                    console.log('no existe nuevo contenido');
                }

            });
        }

        askByNewContent() {
            var self = this;
            /*setInterval(function(){
                self.existNewContent();
            },60000);*/
        }

        setScrollTop() {
            this.scrollTop = angular.element(document).scrollTop();
            if(this.nameState) {
                this._main.updateState(this.nameState,{
                    scrollTop: this.scrollTop
                });
            }
        }

        goToCurrentScrollTop(position?) {
            var self = this;
            if(typeof(position) == 'undefined') {
                position = self.scrollTop;
            }
            setTimeout(function(){
                angular.element(document).scrollTop(position);
            },50);
        }

        existIncluded(card:iDataApirest) {
            if(card.included) {
                return true;
            }
            return false;
        }

        existMiniaturas(card:iDataApirest) {
            if(card && card.relationships && card.relationships.miniaturas  && card.relationships.miniaturas.data && card.relationships.miniaturas.data.length > 0) {
                return true;
            }else if(card && card.attributes && card.attributes.preview && card.attributes.preview.images && card.attributes.preview.images.length > 0) {
                return true;
            }
            return false;
        }

        existGalerias(card:iDataApirest) {
            if(card && card.relationships && card.relationships.galerias  && card.relationships.galerias.data && card.relationships.galerias.data.length > 0) {
                return true;
            }
            return false;
        }

        existVideos(card:iDataApirest) {
            if(card && card.relationships && card.relationships.videos && card.relationships.videos.data && card.relationships.videos.data.length > 0) {
                return true;
            }
            return false;
        }

        existColorDeFondo(card:iDataApirest) {
            if(card && card.relationships && card.relationships.colorDeFondo && card.relationships.colorDeFondo.data && card.relationships.colorDeFondo.data.length > 0) {
                return true;
            }
            return false;
        }

        existColorDeCapaTransparente(card:iDataApirest) {
            if(card && card.relationships && card.relationships.colorDeCapaTransparente && card.relationships.colorDeCapaTransparente.data && card.relationships.colorDeCapaTransparente.data.length > 0) {
                return true;
            }
            return false;
        }

        existColorTextoContenedorTarjeta(card:iDataApirest) {
            if(card && card.relationships && card.relationships.colorTextoContenedorTarjeta && card.relationships.colorTextoContenedorTarjeta.data && card.relationships.colorTextoContenedorTarjeta.data.length > 0 && card.relationships.colorTextoContenedorTarjeta.data[0].css != 'transparent') {
                return true;
            }
            return false;
        }

        addElementToContent(retryCount?) {
            var self = this;
            if(this.cola.length > 0) {

                self.contents = $.merge(self.contents,self.cola);
                self.cola = [];

                //this.contents.push(this.cola[0]);
                //this.cola.shift();
                setTimeout(function() {
                    self.refreshRenderPageWithNextContent();
                },10);

                self._main.regenereWall('.wall');

            }else {                
                this.refreshRenderPageWithNextContent();
            }
        }

        refreshRenderPageWithNextContent() {
            var self = this;

            if(!this.isCurrentPageFinish() && !self.isProcessUpdate && self.nextState && self.nextState.data) {

                self.isProcessUpdate = true;

                var contents = jQuery.extend([],self.nextState.data);
                if(contents && contents.length > 0) {
                    self.currentState = jQuery.extend({},self.nextState);

                    self.$scope.newContents ++;

                    if( !this.$scope.$$phase  ) {
                        this.$scope.$apply();
                    }

                    self._main.updateState(self.nameState,{
                        contents: self.contents,
                        cola: self.cola,
                        currentState: jQuery.extend({},self.currentState),
                    });

                    self.isProcessUpdate = false;

                    if(self.currentState.links.next) {
                        var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;
                        this.svc.getByLink(url).then((contents: iEntityApirest) => {

                            self.cola = $.merge(self.cola,jQuery.extend([],contents.data));
                            self.nextState = jQuery.extend({},contents);

                            self._main.updateState(self.nameState,{
                                nextState: jQuery.extend({},self.nextState) 
                            });

                        });
                    }else {
                        self.isProcessUpdate = false;                        
                    }

                }else {
                    self.isProcessUpdate = false;
                }
            }
        }

        isCurrentPageFinish() {
            return (!this.currentState || !this.currentState.links || this.currentState.links.next == '' || this.currentState.links.next == null || typeof(this.currentState.links.next) == 'undefined');
        }

    }

}
