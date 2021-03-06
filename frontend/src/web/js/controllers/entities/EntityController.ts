/// <reference path="../../services/RestaurantApirestService.ts" />

module ILovePlatos{

    export class EntityController implements iEntityModel{
        static $inject = [
            "config",
            "RestaurantApirestService",
            "DateService",
            "$rootScope",
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
        contents = [];
        content = {};
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

        constructor(
            public $config:any,
            public api,
            public DateService,
            public $rootScope: IBuhoRootScopeService,
            public $stateParams:any,
            public $scope:any,
            public $state:any,
            public $element:any,
            public $sce:any, 
            public auth,
            public store
        ){
            //Seteo el controlador principal
            this._main = $rootScope.$$childHead.mainCtrl;
            this._user = $rootScope.$$childHead.$$childHead.userCtrl;
            this._parent = $scope.$parent;
        }

        getAll(callback) {
            var self:EntityController = this;
            this.api.getAll().then((contents: iEntityApirest) => {
                self.contents = jQuery.extend([],contents.data);

                callback();

            });
            return false;
        };

        getAllByUserId(userId) {
            var self:EntityController = this;

            if(!userId) {
                userId = this._user.userNeo4j;
            }
            this.api.getAllByUserId(userId).then((contents: iEntityApirest) => {

                for(var item in contents) {
                    self.contents.push(contents[item].data);
                }

            });
            return false;
        };

        getByCategoria(entityId:string): ng.IPromise<any> {

            var self:EntityController = this;
            return this.api.getByCategoria(entityId,this.startPage).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.api.getByLink(url).then((contents: iEntityApirest) => {
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
            return this.api.getByContenidoId(contenidoId,this.startPage).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data);                
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.api.getByLink(url).then((contents: iEntityApirest) => {
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
            return this.api.getByComentarioId(comentarioId).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.api.getByLink(url).then((contents: iEntityApirest) => {
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
            return this.api.getTotalByContenidoId(contenidoId).then((total: any) => {
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

        getById(entityId:string): ng.IPromise<any> {

            if(!entityId) {
                entityId = this.$stateParams.id;
            }

            var self = this;

            return this.api.getById(entityId).then((contents: iEntityApirest) => {

                self.content = contents.data;

            })
        }

        getByUserId(userId:string): ng.IPromise<any> {

            var self:EntityController = this;
            return this.api.getByUserId(userId).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.api.getByLink(url).then((contents: iEntityApirest) => {
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
                return this.api.add(entity)
                    .then((response: iEntityApirest) => {
                        if(response && response.data) {
                            self.isSubmit = false;
                            self.content = response.data;
                        }
                    },(error: any) => {
                        self.isSubmit = false;
                        console.log(error);
                    });
            }
        }

        update(entity,user?){
            if(!entity) {
                return null;
            }
            if(!this.isSubmit ) {
                this.isSubmit = true;
                var self = this;
                return this.api.update(entity)
                    .then((response: iEntityApirest) => {
                        if(response && response.data) {
                            self.isSubmit = false;
                            self.content = response.data;
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
                return this.api.delete(entity)
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

        isCurrentPageFinish() {
            return (!this.currentState || !this.currentState.links || this.currentState.links.next == '' || this.currentState.links.next == null || typeof(this.currentState.links.next) == 'undefined');
        }

    }

}
