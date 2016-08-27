/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../services/ContenidoApirestService.ts" />

/// <reference path="Contenido/ContenidoCard.ts" />
/// <reference path="Contenido/ContenidoEdit.ts" />

module ILovePlatos{

    declare var preview:any;
    declare var tinymce:any;
    declare var preloadContent:any;

    export class ContenidoController extends EntityController implements iContenidoModel{
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
            "FilesService",
            "auth",
            "store",
            "$compile",
            "$q",
            "$timeout",
            "CalificacionApirestService",
            "$filter",
            "ContenidoCardService"
        ];

        type = 'contenidos';
        contents = [];
        searches = [];
        content = {
            id:'',
            attributes:{
                cuerpo:'',
                titulo:'Escribe aquí el título de la noticia.',
                subtipo:"front",
                preview:{
                    image:''
                },
                usarImagenDeFondo:"0",
                tipoDeModulo:'vertical'
            },
            relationships: {
                galerias:{
                    data:[]
                },
                miniaturas:{
                    data:[]
                },
                categorias:{
                    data:[]
                },
                tags:{
                    data:[]
                },
                autores:{
                    data:[]
                },
                usuarios:{
                    data:[]
                },
                colorDeFondo: {
                    data: [{
                        id: "transparent",
                        css: "transparent"
                    }]
                },
                imagenDeFondo: {
                    data: [{
                        src: ""
                    }]
                },
                colorDeCapaTransparente: {
                    data: [{
                        id: "transparent",
                        css: "transparent"
                    }]
                },
                colorTextoContenedorTarjeta: {
                    data: [{
                        id: "transparent",
                        css: "transparent"
                    }]
                }
            }
        };
        
        mother;
        wall:any;
        contenidoText:string;
        showTituloForm = false;
        showMediaFile = false;
        imagenDeFondo = 'transparent';
        tituloText:any;
        preview:any;
        category:any;
        images:any;

        homepublicarpostCtrl:any;

        //Composición de clases
        ContenidoCard:ContenidoCard;
        ContenidoEdit:ContenidoEdit;

        constructor(
            public $config,
            public svc,
            public DateService,
            public $rootScope,
            $controller,
            $stateParams,
            public $scope,
            public $state,
            $element,
            public $sce,
            public FilesService,
            public auth,
            public store,
            private $compile,
            public $q,
            private $timeout,
            public calificaciones,
            public $filter,
            public ContenidoCardService
        ){
            //Seteo el controlador principal
            super($config,svc,DateService,$rootScope,$controller,$stateParams,$scope,$state,$element,$sce,auth,store);

            this.ContenidoCard = new ContenidoCard(this);
            this.ContenidoEdit = new ContenidoEdit(this);

            var self = this;

        }

        setFactory(state) {

            this.contents = [];
            this.content = state.content;
            this.cola = state.cola;

            this.currentState = state.currentState;
            this.nextState = state.nextState;
            this.scrollTop = state.scrollTop || 0;
            this.$scope.newContents ++;

        }

        getFactory(params) {
            var svc;

            if(params && params.filterType == 'categoriaId' && params.filterId) {
                svc = this.getByCategoria(params.filterId);
            }
            else if(params && params.filterType == 'tagId' && params.filterId) {
                svc = this.getByTag(params.filterId);
            }
            else if(params && params.filterType == 'hashtagId' && params.filterId) {
                svc = this.getByHashtag(params.filterId);
            }
            else if(params && params.filterType == 'relacionados' && params.filterId) {
                if( !(this._main.id == 'detalle-noticia' && this.$stateParams.id == 'preview') ) {
                    svc = this.getRelacionadosByContenidoId(params.filterId);
                }
            }
            else if(params && params.filterType == 'userId' && params.filterId) {
                    svc = this.getByUserId(params.filterId);
            }
            else if(params && params.filterType == 'contenidoId' && params.filterId) {
                    svc = this.getByContenidoId(params.filterId);
            }
            else if(params && params.filterType == 'id' && params.filterId) {
                if( this._main.id == 'detalle-noticia' && this.$stateParams.id == 'preview' && typeof(preview) != 'undefined' ){
                    this.content = preview;
                    this.$scope.newContents ++; 
                    //jQuery(".overlayer.preview").removeClass("hidden");
                }else if( this.$stateParams.id != 'preview' ){
                    svc = this.getById(params.filterId);
                }
            }
            else {
                svc = this.getAll({"view[layout]":"home"});
            }
            return svc;

        }

        getAll(queryString?): ng.IPromise<any> {
            var self = this;
            return this.svc.getAll(queryString).then((contents: iEntityApirest) => {
                self.contents = [];
                self.cola = [];
                self.currentState = jQuery.extend({},contents);
                self.contents.push(contents.data);
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
                            cola: self.cola,
                        });
                    });
                }

            });
        };

        getByCategoria(entityId:string,queryString?): ng.IPromise<any> {

            var self = this;
            return this.svc.getByCategoria(entityId,queryString).then((contents: iEntityApirest) => {
                self.currentState = jQuery.extend({},contents);
                self.contents.push(contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.svc.getByLink(url).then((contents: iEntityApirest) => {
                        self.cola = jQuery.extend([],contents.data);
                        self.nextState = contents;
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }

            })
        }

        getByTag(entityId:string,queryString?): ng.IPromise<any> {

            var self = this;
            return this.svc.getByTag(entityId,queryString).then((contents: iEntityApirest) => {
                self.currentState = jQuery.extend({},contents);
                self.contents.push(contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.svc.getByLink(url).then((contents: iEntityApirest) => {
                        self.cola = jQuery.extend([],contents.data);
                        self.nextState = contents;
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }

            })
        }

        getByHashtag(entityId:string): ng.IPromise<any> {

            var self = this;
            return this.svc.getByHashtag(entityId).then((contents: iEntityApirest) => {
                self.currentState = jQuery.extend({},contents);
                self.contents.push(contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.svc.getByLink(url).then((contents: iEntityApirest) => {
                        self.cola = jQuery.extend([],contents.data);
                        self.nextState = contents;
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }

            })
        }

        getRelacionadosByContenidoId(contenidoId) {
            var self:EntityController = this;
            return this.svc.getRelacionadosByContenidoId(contenidoId).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents.push(contents.data);
                self.scrollTop = angular.element(document).scrollTop();

                //Cargo en memoria la segunda página
                var url:string = this.$config.protocolApirest+this.$config.domainApirest+self.currentState.links.next;

                if(!self.isCurrentPageFinish()) {
                    this.svc.getByLink(url).then((contents: iEntityApirest) => {
                        self.cola = jQuery.extend([],contents.data);
                        self.nextState = contents;
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }

            });
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
                        self.cola = jQuery.extend([],contents.data);
                        self.nextState = jQuery.extend({},contents);
                        self._main.updateState(self.nameState,{
                            nextState: self.nextState,
                        });
                    });
                }

            })
        }

        getByContenidoId(contenidoId:string): ng.IPromise<any> {

            var self = this;
            return this.svc.getByContenidoId(contenidoId).then((content: iEntityApirest) => {
                self.currentState = content;
                self.content = jQuery.extend([],content.data);
                self._main.updateState(self.nameState,{
                    content: self.content,
                });
                self.$scope.newContents ++;
            })
        }

        getById(entityId:string): ng.IPromise<any> {

            var self = this;
            return this.svc.getById(entityId).then((contents) => {
                self.currentState = contents;
                self.contents.push(contents.data);
                self.content = contents.data;
                self._main.updateState(self.nameState,{
                    content: self.content,
                });
                self.$scope.newContents ++;
                self.$scope.$broadcast('newContents',contents.data);
            })
        }

        addElementToContent(retryCount) {
            if(!retryCount) {
                retryCount = 0;
            }
            var self = this;
            if(this.cola && this.cola.length > 0) {

                self.contents.push(self.cola);
                self.cola = [];

                angular.element('.loading-card').removeClass("hidden");

                setTimeout(function() {
                    self.refreshRenderPageWithNextContent();
                },10);

                self._main.regenereWall('.wall');
            }/*else if(retryCount < 2) {
                setTimeout(function() {
                    retryCount ++;
                    self.addElementToContent(retryCount);
                },50);
            }*/
        }

        getTags(card) {
            var categorias:any;
             return this.ContenidoCardService.getTags(card);
        }

        getUrlContenido(card:iDataApirest) {
            return this.ContenidoCardService.getUrlContenido(card);
        }

        getCategoriaByContenido(card) {
            return this.ContenidoCardService.getCategoriaByContenido(card);
        }

        getSubcategoriasByContenido(card) {
            return this.ContenidoCardService.getSubcategoriasByContenido(card);
        }

        getClassTitulo(card:iDataApirest) {
            return this.ContenidoCardService.getClassTitulo(card);
        }

        getClassSubTitulo(card:iDataApirest) {
            return this.ContenidoCardService.getClassSubTitulo(card);
        }

        getSrcMiniaturasByRecorte(card,recorte) {
            return this.ContenidoCardService.getSrcMiniaturasByRecorte(card,recorte);
        }

        getSrcMiniaturasOriginal(card:iDataApirest) {
            return this.ContenidoCardService.getSrcMiniaturasOriginal(card);
        }

        getSrcMiniaturasApaisadaHD(card:iDataApirest) {
            return this.ContenidoCardService.getSrcMiniaturasApaisadaHD(card);
        }

        getSrcMiniaturasMiniatura(card:iDataApirest) {
            return this.ContenidoCardService.getSrcMiniaturasMiniatura(card);
        }

        getSrcMiniaturasForm(card:iDataApirest) {
            return this.ContenidoCardService.getSrcMiniaturasForm(card);
        }

        getSrcMiniaturasRecortada(card:iDataApirest,element) {
            return this.ContenidoCardService.getSrcMiniaturasRecortada(card,element);
        }

        getCacheSrcMiniaturasRecortada(card:iDataApirest,element) {
            return this.ContenidoCardService.getCacheSrcMiniaturasRecortada(card,element);
        }

        getSrcMiniaturasOrGaleriaRecortada(card:iDataApirest) {
            return this.ContenidoCardService.getSrcMiniaturasOrGaleriaRecortada(card);
        }

        getSrcFirstImageGaleriaOriginal(card:iDataApirest) {
            return this.ContenidoCardService.getSrcFirstImageGaleriaOriginal(card);
        }

        getSrcFirstImageGaleriaRecortada(card:iDataApirest) {
            return this.ContenidoCardService.getSrcFirstImageGaleriaRecortada(card);
        }

        classRepost(card) {
            return this.ContenidoCardService.classRepost(card);
        }

        getTitulo(card) {
            return this.ContenidoCardService.getTitulo(card);
        }

        getSubTitulo(card) {
            return this.ContenidoCardService.getSubTitulo(card);
        }

        existPrePreview() {
            return this.ContenidoCardService.existPrePreview();
        }

        existPreview(card) {
            return this.ContenidoCardService.existPreview(card);
        }

        existVideoPreview(card) {
            return this.ContenidoCardService.existVideoPreview(card);
        }

        existImagePreview(card) {
            return this.ContenidoCardService.existImagePreview(card);
        }

        getVideoPreview(card) {
            return this.ContenidoCardService.getVideoPreview(card);
        }

        getImagePreview(card) {
            return this.ContenidoCardService.getImagePreview(card);
        }

        getBodyPreview(card) {
            return this.ContenidoCardService.getBodyPreview(card);
        }

        getSizeRecorte(card:iDataApirest) {
            return this.ContenidoCardService.getSizeRecorte(card);
        }

        showMiniaturaInsidePost(card:iDataApirest) {
            return this.ContenidoCardService.showMiniaturaInsidePost(card);
        }

        hasImagenBackground(card:iDataApirest) {
            return this.ContenidoCardService.hasImagenBackground(card);
        }

        getLeyendaMiniaturas(card:iDataApirest) {
            return this.ContenidoCardService.getLeyendaMiniaturas(card);
        }


        getCopyrightMiniaturas(card:iDataApirest) {
            return this.ContenidoCardService.getCopyrightMiniaturas(card);
        }

        getSrcVideos(card:iDataApirest) {
            return this.ContenidoCardService.getSrcVideos(card);
        }

        getSrcMiniaturaVideo(card:iDataApirest) {
            return this.ContenidoCardService.getSrcMiniaturaVideo(card);
        }

        getSrcFirstImgGaleria(card:iDataApirest) {
            return this.ContenidoCardService.getSrcFirstImgGaleria(card);
        }

        getColorDeFondo(card:iDataApirest) {
            return this.ContenidoCardService.getColorDeFondo(card);
        }

        getImagenDeFondo(card:iDataApirest) {
            return this.ContenidoCardService.getImagenDeFondo(card);
        }

        getColorDeCapaTransparente(card:iDataApirest) {
            return this.ContenidoCardService.getColorDeCapaTransparente(card);
        }

        getColorTextoContenedorTarjeta(card:iDataApirest) {
            return this.ContenidoCardService.getColorTextoContenedorTarjeta(card);
        }

        getFormato(card:iDataApirest) {
            return this.ContenidoCardService.getFormato(card);
        }

        getRelevancia(card:iDataApirest) {
            return this.ContenidoCardService.getRelevancia(card);
        }

        setAttributes(contents,attributes) {
            return this.ContenidoCardService.setAttributes(contents,attributes);
        }

        changeCarrouselToAlbum(contents) {
            return this.ContenidoCardService.changeCarrouselToAlbum(contents);
        }

        getLinkAutores(card){
            return this.ContenidoCardService.getLinkAutores(card);
        }

        isLinkBuho(card){
            return this.ContenidoCardService.isLinkBuho(card);
        }

        isMine(card) {
            return this.ContenidoCardService.isMine(card);
        }

        setMine(card) {
            return this.ContenidoCardService.setMine(card);
        }

        classBuho(card){
            return this.ContenidoCardService.classBuho(card);
        }

        getCuerpo(card) {
            return this.ContenidoCardService.getCuerpo(card);
        }

        initContentModules(card) {
            this.ContenidoCardService.initPlayBuzz(card);
            this.ContenidoCardService.initInstagram(card);
            this.ContenidoCardService.initGallery();
        }

        getCuerpoTarjeta(card) {
            return this.ContenidoCardService.getCuerpoTarjeta(card);
        }

        existLeyendaMiniaturas(card:iDataApirest) {
            return this.ContenidoCardService.existLeyendaMiniaturas(card);
        }

        existCopyrightMiniaturas(card:iDataApirest) {
            return this.ContenidoCardService.existCopyrightMiniaturas(card);
        }

        filterEspacios(text) {

            var rgx = new RegExp('&nbsp;', 'g');
            text = text.replace(rgx, ' ');

            return text;
        }

        filterNoContent(text) {

            var rgx = new RegExp('<p>-1<\/p>;', 'g');
            text = text.replace(rgx, '');

            return text;
        }

        filterHashtag(text) {

            var rgx = new RegExp('#([a-z1-9A-Z-_]+) ', 'g');
            var rgx2 = new RegExp('\<span class\=\"hashtag\"\>#([a-z1-9A-Z-_]+)\<\/span\>', 'g');
            text = text.replace(rgx, '<a class="hashtag" title="hashtag" href="/hashtags/$1">#$1</a>');
            text = text.replace(rgx2, '<a class="hashtag" title="hashtag" href="/hashtags/$1">#$1</a>');

            return text;
        }

        filterMention(text) {

            var rgx = new RegExp('@([a-z1-9A-Z-_]+) ', 'g');
            var rgx2 = new RegExp('\<span class\=\"mention\"\>#([a-z1-9A-Z-_]+)\<\/span\>', 'g');
            text = text.replace(rgx, '<a class="mention" title="mention" href="/perfil/$1">@$1</a>');
            text = text.replace(rgx2, '<a class="mention" title="mention" href="/perfil/$1">@$1</a>');

            return text;
        }

        getParamsOmniture() {
            var params = {};

            return params;
        }

        getWidth(group) {
            if(group.attributes.tipoDeModulo == 'vertical') {
                return '200px';
            }else {
                return '500px';
            }
        }

        add(entity){
            if(!this._user.isLogged()) {
                return null;
            }
            if( !this.isSubmit ) {
                //jQuery(".overlayer").removeClass("hidden");
                this.isSubmit = true;
                var self = this;
                return this.svc.add(entity)
                    .then((response) => {
                        if(response && response.data) {
                            self.isSubmit = false;
                            var content = response.data;
                            setTimeout(function(){

                                self.advanceProgressbar();

                                if(!self.$scope.$$phase) {
                                    self.$scope.$apply();
                                }

                                setTimeout(function(){
                                    self.$state.go('contenido',{id:content.attributes.id,slug:content.attributes.slug,categoria:content.relationships.categorias.data[0].id});
                                    self._main.setMessage({type:'success',text:'Contenido creado.'});
                                },500);

                                //jQuery(".overlayer").addClass("hidden");
                            },1000);
                        }
                    },(error) => {
                        //jQuery(".overlayer").addClass("hidden");
                        self._main.resetMessages();
                        self._main.setMessage({type:'danger',text:'Upsss! algo ha sucedido, prueba a refrecar la página a ver si funciona.'});
                        self.isSubmit = false;
                        self.ContenidoEdit.progressbarRes.resolve();
                    });
            }
        }

        delete(entity,user?,redirect?) {
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
                                //self._main.regenereWall('.cont-post-creados');
                            }
                        }
                        if(redirect) {
                            self._main.deleteCache('home');
                            self.$state.go('home');
                        }
                    },(error: any) => {
                        self._main.resetMessages();
                        self._main.setMessage({type:'danger',text:'Upsss! algo ha sucedido, prueba a refrecar la página a ver si funciona.'});
                        self.isSubmit = false;
                        self.ContenidoEdit.progressbarRes.resolve();
                        console.log(error);
                    });
            }
        }

        update(entity){
            if(!this._user.isLogged()) {
                return null;
            }
            if( !this.isSubmit ) {
                //jQuery(".overlayer").removeClass("hidden");
                this.isSubmit = true;
                var self = this;
                return this.svc.update(entity)
                    .then((response) => {
                        if(response && response.data) {
                            self.isSubmit = false;

                            var content = response.data;
                            setTimeout(function(){
                                self.advanceProgressbar();
                                self._main.removeState(self.nameState);

                                if(!self.$scope.$$phase) {
                                    self.$scope.$apply();
                                }

                                setTimeout(function(){
                                    self.$state.go('contenido',{id:content.attributes.id,slug:content.attributes.slug,categoria:content.relationships.categorias.data[0].id});
                                    self._main.setMessage({type:'success',text:'Contenido actualizado.'});
                                },500);

                                //jQuery(".overlayer").addClass("hidden");
                            },1000);

                        }
                    },(error) => {
                        //jQuery(".overlayer").addClass("hidden");
                        self._main.resetMessages();
                        self._main.setMessage({type:'danger',text:'Upsss! algo ha sucedido, prueba a refrecar la página a ver si funciona.'});
                        self.isSubmit = false;
                        self.ContenidoEdit.progressbarRes.resolve();
                    });
            }
        }

        eliminarPublicacion(event,card) {
            if(event) {
                event.preventDefault();
            }

            if(card.id) {
                var dataJson = new DataJsonController(this.type,this.auth);
                var attributes = {
                    id: card.id,
                    fecha:this.DateService.getCurrentDateInUnix()
                };

                dataJson.addAttributes(attributes);

                var newEntity = dataJson.getOutput();
                this.delete(newEntity);
            }
        }

        eliminarPublicacionById(event,id) {
            if(event) {
                event.preventDefault();
            }

            if(id) {
                var dataJson = new DataJsonController(this.type,this.auth);
                var attributes = {
                    id: id,
                    fecha:this.DateService.getCurrentDateInUnix()
                };

                dataJson.addAttributes(attributes);

                var newEntity = dataJson.getOutput();
                this.delete(newEntity,null,true);
            }
        }

        initEdit() {
            this.ContenidoEdit.initEdit();
        }

        watchEdit() {
            this.ContenidoEdit.watchEdit();
        }

        syncPreviewCard() {
            this.ContenidoEdit.syncPreviewCard();
        }

        isSubmitActive(){
            return this.ContenidoEdit.isSubmitActive();
        }

        getMessageForm() {
            return this.ContenidoEdit.getMessageForm();
        }

        submit(newPostForm,update?) {
            this.ContenidoEdit.submit(newPostForm,update);
        }

        formEntity() {
            this.ContenidoEdit.formEntity();
        }

        advanceProgressbar() {
            this.ContenidoEdit.advanceProgressbar();
        }

        progressStart(newPostForm) {
            return this.ContenidoEdit.progressStart(newPostForm);
        }

        progressCancel() {
            this.ContenidoEdit.progressCancel();
        }

        showMediaAction() {
            this.$scope.$emit('showMediaFile',true);
            this.ContenidoEdit.showMediaAction();
        }

        hideMediaAction() {

            angular.element('.fileimage-buttons-action').addClass('ng-hide');

            this.ContenidoEdit.hideMediaAction();
        }

        isShowButtonMediaAdd() {
            if(!this._main.isCordovaApp() || this.FilesService.fileElemImage.length > 0) {
                return true;
            }else if(this._main.isCordovaApp() && this.FilesService.fileElemImage.length > 0) {
                return true;
            }
            return false;
        }

        flippyToBackAction(event) {
            this.ContenidoEdit.flippyToBackAction(event);
        }

        flippyToFrontAction(event) {
            this.ContenidoEdit.flippyToFrontAction(event);
        }

        isflippyToBack() {
            return this.ContenidoEdit.isflippyToBack();
        }

        showTituloFormAction() {
            this.ContenidoEdit.showTituloFormAction();
        }

        hideTituloFormAction() {
            this.ContenidoEdit.hideTituloFormAction();
        }

        selectFile(event,selector) {

            if(this._main.isCordovaApp()) {
                if(angular.element('.btn-subir-foto').hasClass('active')) {
                    angular.element('.btn-subir-foto').removeClass('active');
                }else {
                    angular.element('.btn-subir-foto').addClass('active');
                }
                if(angular.element('.fileimage-buttons-action').hasClass('ng-hide')) {
                    angular.element('.fileimage-buttons-action').removeClass('ng-hide');
                }else {
                    angular.element('.fileimage-buttons-action').addClass('ng-hide');
                }
            }else {
                this.ContenidoEdit.selectFile(event,selector);
            }
        }

        changeFiles(files) {
            this.ContenidoEdit.changeFiles(files);
        }

        addFiles(files) {
            this.ContenidoEdit.addFiles(files);   
        }

        deleteImage(event,index){
            this.ContenidoEdit.deleteImage(event,index);
        }

        previewImageInCard() {
            this.ContenidoEdit.previewImageInCard();
        }

        hasPreviewImage() {
            return this.ContenidoEdit.hasPreviewImage();
        }

        hasImagePrincipal() {
            return this.ContenidoEdit.hasImagePrincipal();
        }

        getTipoImagenPrincipal(element) {
            return this.ContenidoEdit.getTipoImagenPrincipal(element);
        }

        editImage(target) {
            this.ContenidoEdit.editImage(target);
        }

        editImageSave(target) {
            this.ContenidoEdit.editImageSave(target);
        }

        editImageCancel(target) {
            this.ContenidoEdit.editImageCancel(target);
        }

        cropperImage(target) {
            this.ContenidoEdit.cropperImage(target);
        }

        croppImageCancel(event) {
            this.ContenidoEdit.croppImageCancel(event);
        }

        croppImage(event) {
            this.ContenidoEdit.croppImage(event);
        }

        rotateCropperImage(event,grades) {
            this.ContenidoEdit.rotateCropperImage(event,grades);
        }

        selectImage(target) {
            this.ContenidoEdit.selectImage(target);
        }

        getCroppedCanvas(event) {
            return this.ContenidoEdit.getCroppedCanvas(event);
        }

        isUpdate() {
            return this.ContenidoEdit.isUpdate();
        }

        setCuerpo(cuerpo) {
            this.ContenidoEdit.setCuerpo(cuerpo);
        }

        regenerateFormulario() {
            this.ContenidoEdit.regenerateFormulario();
        }

        getImagesRegenerate() {
            return this.ContenidoEdit.getImagesRegenerate();
        }

        deleteImageRegenerate(index) {
            this.ContenidoEdit.deleteImageRegenerate(index);
        }

        editarPublicacion(event,card) {
            this.ContenidoEdit.editarPublicacion(event,card);
        }

        initTourNewContent() {
            this.ContenidoEdit.initTourNewContent();
        }

        isBackground() {
            return this.ContenidoEdit.isBackground();
        }

        toggleBackGround(event) {
            return this.ContenidoEdit.toggleBackGround(event);
        }

        getMedia(event,type) {
            this.ContenidoEdit.getMedia(event,type);
        }

        initSelec2Tags(selector) {
            var self = this;
            var defaultData = [];
            var selectData = [];
            if(this.content && 
                this.content.relationships && 
                this.content.relationships.tags && 
                this.content.relationships.tags.data &&
                this.content.relationships.tags.data.length > 0
            ) {

                for(var e = 0; e < this.content.relationships.tags.data.length; e++) {
                    var tag = this.content.relationships.tags.data[e];
                    defaultData.push({id:tag.id, attributes:{nombre:tag.nombre}});
                    selectData.push(tag.id);
                }

            }
            $(selector).select2({
              placeholder: "Etiquetas",
              //tags: true,
              data: defaultData,
              ajax: {
                url: self.$config.protocolApirest+self.$config.domainApirest+"/public/tags",
                dataType: 'json',
                delay: 150,
                data: function (params) {
                  return {
                    'filter[query]': params.term, // search term
                  };
                },
                processResults: function (data, params) {
                    var exist = false;

                    if(!exist) {
                        data.data.push({
                            id:self.$filter('clean')(params.term),
                            attributes: {
                                nombre:params.term,
                                isNew:true
                            }
                        });
                    }

                  return {
                    results: data.data
                  };
                },
                cache: true
              },
              escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
              minimumInputLength: 1,
              templateResult:function formatState (state) {
                  var id = '';
                  if (state.id && state.attributes.nombre) { 
                    id = state.attributes.nombre; 
                  }
                  else if(state.id) {
                    id = state.id;
                  }

                  if(id && state.attributes.isNew) {
                    id += ' <span class="new-tag">(New)</span>'
                  }

                  return id;
              },
              templateSelection: function(data, container) {
                    if (data.id && data.attributes.nombre) { return data.attributes.nombre; }
                    else if(data.id) {return data.id;}
              }
            });

            if(selectData && selectData.length > 0) {
                $(selector).val(selectData).trigger("change");
            }
            
        }

    }

}