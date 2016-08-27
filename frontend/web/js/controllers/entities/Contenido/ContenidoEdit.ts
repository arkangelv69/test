/// <reference path="../../../../typings/jquery/jquery.d.ts" />

/// <reference path="../../data/DataJsonController.ts" />

module ILovePlatos{

    declare var preview:any;
    declare var tinymce:any;
    declare var Camera:any;
    declare var window:any;
    declare var navigator:any;
    declare var VideoEditor:any;
    declare var VideoEditorOptions:any;

    export class ContenidoEdit{

        controller:ContenidoController;

        dataJson:any;
        attributes = {
            id:'',
            cuerpo:'',
            preview:{
                images:[]
            },
            fecha:'',
            titulo:'',
            formato:'post',
            slug: '-1',
            mostrarImagenDentro: '1',
            usarImagenDeFondo: '0',
            relevancia:'-1',
            tipoDeModulo:'vertical',
            seo_titulo:'-1',
            seo_og_titulo:'-1',
            seo_twitter_titulo:'-1'
        };
        paramsGaleria = [];

        constructor(controller) {
            this.controller = controller;
            this.dataJson = new DataJsonController('contenidos',controller.auth);
        }

        initEdit() {
            var self = this;

            this.controller.$scope.processPublicarPost = {};
            this.controller.$scope.finishCuerpo = false;
            this.controller.$scope.finishPreview = false;
            this.controller.$scope.finishImages = false;
            this.controller.$scope.finishVideo = false;

            //Al iniciar le indico al servio FilesService que las imágenes de preview, tienen que ser cropeables y seleccionables
            this.controller.FilesService.setImagePreviewEditable(true);
            this.controller.FilesService.setImagePreviewCropperable(true);
            this.controller.FilesService.setImagePreviewSelectable(true);

            //Si existen valores las pinto ya en la tarjeta de la publicación.
            this.controller.syncPreviewCard();
            this.controller._main.activeTooltip();

            this.controller.initTourNewContent();

            this.controller.watchEdit();

            this.controller.FilesService.resetFiles();
            this.controller.FilesService.setController('contenidoCtrl');

            setTimeout(function() {
                $(document).keypress(function(e) {
                    if(e.which == 13 && self.controller.showTituloForm) {
                        
                        self.controller.showTituloForm = false;
                        angular.element('#tituloText').blur();
                        angular.element('body').blur();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            });
        }

        watchEdit() {

            var self = this;
            this.controller.$scope.$watch('finishCuerpo + finishPreview + finishImages + finishVideo', function(newValue, oldValue) {

                if(jQuery.isEmptyObject(self.controller.$scope.processPublicarPost)) {
                    return null;
                }
                var publish = true;
                var isNotpublish = false;
                angular.forEach(self.controller.$scope.processPublicarPost,function(value,key) {
                    if(isNotpublish) {
                        return null;
                    }
                    if(!value) {
                        publish = false;
                        isNotpublish = true;
                        return null;
                    }
                });

                self.controller.$scope.finishCuerpo = false;
                self.controller.$scope.finishPreview = false;
                self.controller.$scope.finishImages = false;
                self.controller.$scope.finishVideo = false;

                if( publish ) {
                    self.formEntity();
                }

            });
        }

        syncPreviewCard() {
            var user = this.controller._user;
            var username = user.username;
            var nickname = user.nickname;
            var avatar = user.imagePerfil;
            var tipo = "usuario";
            var self = this.controller;

            $('#newPublicacion').modal('hide');

            setTimeout(function(){
                  jQuery("#colorDeFondo").simplecolorpicker();
                  jQuery("#colorDeCapaTransparente").simplecolorpicker();
                  jQuery("#colorTextoContenedorTarjeta").simplecolorpicker();
            },50);

            self.content.relationships.usuarios.data.push({
                "id":username,
                "attributes": {
                    "avatar":avatar,
                    "nickname":nickname
                }
            });
            this.controller.$scope.$watch('contenidoCtrl.category', function(category, oldValue) {
                if(category && category.id && (category.nombre || category.attributes.nombre)) {
                    self.content.relationships.categorias.data = [];

                    var nombre = category.id;
                    if(category.attributes && category.attributes.nombre) {
                        nombre = category.attributes.nombre;
                    }
                    self.content.relationships.categorias.data.push({id:category.id,nombre:nombre});
                    self.$scope.$broadcast('changeContent',self.content);
                    self._parent.homepublicarpostCtrl.isEdit = true;
                }
            });
            this.controller.$scope.$watch('contenidoCtrl.tituloText', function(titulo, oldValue) {
                if(titulo) {
                    self.content.attributes.titulo = titulo;
                    self.$scope.$broadcast('changeContent',self.content);
                    self._parent.homepublicarpostCtrl.isEdit = true;
                }
            });
            this.controller.$scope.$watch('contenidoCtrl.colorDeFondo', function(colorDeFondo, oldValue) {
                if(!colorDeFondo) {
                    colorDeFondo = 'transparent';
                }
                if(colorDeFondo) {
                    self.content.relationships.colorDeFondo.data[0].id = colorDeFondo;
                    self.content.relationships.colorDeFondo.data[0].css = colorDeFondo;
                    self.$scope.$broadcast('changeContent',self.content);
                }
            });
            this.controller.$scope.$watch('contenidoCtrl.imagenDeFondo', function(imagenDeFondo, oldValue) {
                if(!imagenDeFondo) {
                    imagenDeFondo = 'transparent';
                }
                if(imagenDeFondo) {
                    if(imagenDeFondo == 'transparent') {
                        self.content.attributes.usarImagenDeFondo = "0";
                        if(self.content.relationships.imagenDeFondo){
                            self.content.relationships.imagenDeFondo.data[0].src = imagenDeFondo;
                        } 
                    }
                    else if(imagenDeFondo == 'usarImagenDeFondo') {
                        self.content.attributes.usarImagenDeFondo = "1";
                    }else {
                        self.content.attributes.usarImagenDeFondo ="0";
                        if(self.content.relationships.imagenDeFondo){
                            self.content.relationships.imagenDeFondo.data[0].src = imagenDeFondo;
                        }
                    }
                    self.$scope.$broadcast('changeContent',self.content);
                }
            });
            this.controller.$scope.$watch('contenidoCtrl.colorDeCapaTransparente', function(colorDeCapaTransparente, oldValue) {
                if(!colorDeCapaTransparente) {
                    colorDeCapaTransparente = 'transparent';
                }
                if(colorDeCapaTransparente) {
                    self.content.relationships.colorDeCapaTransparente.data[0].id = colorDeCapaTransparente;
                    self.content.relationships.colorDeCapaTransparente.data[0].css = colorDeCapaTransparente;
                    self.$scope.$broadcast('changeContent',self.content);
                }
            });
            this.controller.$scope.$watch('contenidoCtrl.colorTextoContenedorTarjeta', function(colorTextoContenedorTarjeta, oldValue) {
                if(!colorTextoContenedorTarjeta) {
                    colorTextoContenedorTarjeta = 'transparent';
                }
                if(colorTextoContenedorTarjeta) {
                    self.content.relationships.colorTextoContenedorTarjeta.data[0].id = colorTextoContenedorTarjeta;
                    self.content.relationships.colorTextoContenedorTarjeta.data[0].css = colorTextoContenedorTarjeta;
                    self.$scope.$broadcast('changeContent',self.content);
                }
            });
            this.controller.$scope.$watch('mainCtrl.preview', function(preview, oldValue) {
                if(typeof(preview) != 'undefined' && preview.pageUrl && preview.pageUrl != '-1') {
                    var srcImage = preview.image;
                    self.tituloText = preview.title;

                    if(preview.description) {
                        self.setCuerpo(preview.description);
                    }

                    //TODO saltarme el cross domain para poder transformar la imagen en cavas
                    /*if(preview.images) {
                        self.images = preview.images;

                        var images = [];
                        var indexSelect = 0;
                        angular.forEach(self.images,function(image,index){
                            var select = false;
                            if( image.select === "1" ) {
                                self.FilesService.setSelect(index);
                                select = true;
                            }
                            images.push({type:"image",source:image,select:select});
                        });

                        self.FilesService.previewImageUpload(images);
                    }*/
                    self.preview = preview;
                    self.content.attributes.preview = preview;
                    self.$scope.$broadcast('changeContent',self.content);
                    self._parent.homepublicarpostCtrl.isEdit = true;
                }
            });

            this.setPositionImagePrincipal();
        }

        isSubmitActive(){
            if( ( !this.controller.contenidoText && 
                 (!this.controller.FilesService.fileElemImage || this.controller.FilesService.fileElemImage.length == 0) && 
                 (!this.controller.FilesService.fileElemVideo || this.controller.FilesService.fileElemVideo.length == 0) ) ||
                 (!this.controller.category || !this.controller.category.id) ||
                 (!this.controller.tituloText)
            ){
                return false
            }
            return true;
        }

        getMessageForm() {

            var message = '<ul>';

            if(
                 (!this.controller.tituloText)
            ){
                message += '<li>Selecciona un título que deje con la boca abierta a la gente.</li>';
            }
            if(!this.controller.category || !this.controller.category.id) {
                message += '<li>Ayudanos y selecciona una categoría.</li>';
            }
            if( ( !this.controller.contenidoText && 
                 (!this.controller.FilesService.fileElemImage || this.controller.FilesService.fileElemImage.length == 0) && 
                 (!this.controller.FilesService.fileElemVideo || this.controller.FilesService.fileElemVideo.length == 0) )
            ){
                message += '<li>Selecciona una imagen y verás que chulo.</li>';
                message += '<li>Escribe un poco de contenido, no seas vago.</li>';
            }

            message += '</ul>';

            return message;
        }

        submit(newPostForm,update?) {
            var self = this.controller;
            var selfController = this;

            //Si esta seleccionado el título y se da a intro lo deseleccionamos
            if(this.controller.showTituloForm) {
                this.controller.showTituloForm = false;
                angular.element("#tituloText").blur();
                return null;
            }

            if(!this.controller._user.isLogged()) {
                this.controller.progressCancel();
                return null;
            }
            if(!this.controller.contenidoText && 
                (!this.controller.FilesService.fileElemImage || this.controller.FilesService.fileElemImage.length == 0) && 
                (!this.controller.FilesService.fileElemVideo || this.controller.FilesService.fileElemVideo.length == 0)
            ){
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'No hay ningún contenido que publicar.'});

                this.controller.progressCancel();
                return null;
            }
            if( !this.controller.category && !this.controller.category.id ) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar una categoría.'});

                this.controller.progressCancel();
                return null;   
            }

            //jQuery(".overlayer").removeClass("hidden");

            var uploadImages = $('#preview canvas.new');

            var cuerpo = this.controller.contenidoText || '-1';
            var titulo = this.controller.tituloText || cuerpo;

            this.attributes.cuerpo = cuerpo;
            this.attributes.titulo = titulo;
            this.attributes.seo_og_titulo = titulo;
            this.attributes.seo_titulo = titulo;
            this.attributes.seo_twitter_titulo = titulo;
            if(this.controller.imagenDeFondo == 'usarImagenDeFondo') {
                this.attributes.usarImagenDeFondo = "1";
            }
            this.attributes.fecha = this.controller.DateService.getCurrentDateInUnix();

            /*if(this.controller.preview && this.controller.preview.videoIframe) {
                this.controller.preview.videoIframe = _.escape(this.controller.preview.videoIframe);
            }*/
            this.attributes.preview = this.controller.preview;

            if(this.controller.preview && this.controller.preview.images && this.controller.preview.images.length > 0){

                if(!this.controller.preview.videoIframe) {
                    this.controller.preview.videoIframe = "0";
                }

                selfController.attributes.formato = 'post';

                this.controller.$scope.finishPreview = false;
                this.controller.$scope.processPublicarPost['preview'] = false;

                var images = this.controller.preview.images;
                if(images && images.length > 0 && !images[0].recortadas) {

                    this.progressbarTotal++;

                    this.controller.FilesService.uploadImagePreview(images).then(function(data){
                            if(data && data.length > 0){
                                selfController.attributes.preview.images = data;
                            }

                            self.$scope.processPublicarPost['preview'] = true;
                            self.$scope.finishPreview = true;

                            self.advanceProgressbar();

                            if(!self.$scope.$$phase) {
                                self.$scope.$apply();
                            }
                    });
                }else {
                        this.controller.$scope.processPublicarPost['preview'] = true;
                        this.controller.$scope.finishPreview = true;
                }

            }
            else if(this.controller.FilesService.fileElemImage && 
                this.controller.FilesService.fileElemImage.length > 0){

                this.controller.$scope.processPublicarPost['images'] = 0;
                delete selfController.attributes.preview;

                var fileElemImage = this.controller.FilesService.fileElemImage;

                for(var e = 0; e < fileElemImage.length; e++) {

                    var item;
                    var source = fileElemImage[e].source;
                    var type = fileElemImage[e].type;
                    var name = fileElemImage[e].name;
                    var cropped = fileElemImage[e].cropped;
                    var index = name;
                    var file = fileElemImage[e];
                    var binary = uploadImages[e].toDataURL("image/png");

                    angular.element('.wrapImage-'+index+' .wrapper_loading').removeClass('hidden');

                    selfController.progressbarTotal++;

                    //Si es de tipo file lo mandamos al servidor
                    if(type == 'file' || type == 'image-local' || (type == 'image' && cropped)) {
                        this.controller.FilesService.uploadImageBinary(binary,file.attributes).then(function(response) {

                            if(response && response.data &&  response.data.length > 0) {
                                item = {
                                    "id": selfController.dataJson.generareGuid(),
                                    "url": response.data[0]['original']['url'],
                                    "type":'imagenes',
                                    "ancho": response.data[0]['original']['ancho'],
                                    "alto": response.data[0]['original']['alto'],
                                    "urlMiniatura": response.data[0]['miniatura']['url'],
                                    "anchoMiniatura": response.data[0]['miniatura']['ancho'],
                                    "altoMiniatura": response.data[0]['miniatura']['alto'],
                                    "recortadas": response.data[0]['recortadas'],
                                    "select":response.attributes.select || '0',
                                    "titulo":response.attributes.titulo || '-1',
                                    "leyenda":response.attributes.leyenda || '-1',
                                    "copyright":response.attributes.copyright || '-1'
                                };
                            }

                            if(response && response.data &&  response.data.length > 0 && ( self.FilesService.fileElemImage.length > 1 ) ){
                                selfController.attributes.formato = 'album';
                                if(response.data[0]['original']) {
                                    selfController.paramsGaleria.push(item);
                                }
                                //Si es la imagen seleccionada la usamos como miniatura
                                if(item && (response.attributes.select === '1' || response.attributes.select === true) ) {
                                    selfController.dataJson.addNewRelationships('miniaturas',item);
                                }
                            }
                            else if(response  && response.data &&  response.data.length > 0 && self.FilesService.fileElemImage.length > 0) {
                                selfController.attributes.formato = 'post';
                                delete selfController.attributes.preview;
                                selfController.dataJson.addNewRelationships('miniaturas',item);
                            }

                            self.advanceProgressbar();

                            self.$scope.processPublicarPost['images']++;

                            angular.element('.wrapImage-'+response.data[0].index+' .loading-file').removeClass('glyphicon-refresh glyphicon-refresh-animate');
                            angular.element('.wrapImage .loading-file').addClass('glyphicon-ok');

                            //Hasta que no se han procesado todas las imágenes no creamos las relacciones
                            if( self.$scope.processPublicarPost['images'] >= self.FilesService.fileElemImage.length ) {
                                //Si existe más de una imagen creamos una relacción de galaría
                                if(selfController.paramsGaleria.length > 0) {
                                   selfController.dataJson.addNewRelationships('galerias',selfController.paramsGaleria);
                                }
                                self.$scope.finishImages = true;
                            }

                            if(!self.$scope.$$phase) {
                                self.$scope.$apply();
                            }
                        },function(error) {
                            self.$scope.processPublicarPost['images']++;

                            //Hasta que no se han procesado todas las imágenes no creamos las relacciones
                            if( self.$scope.processPublicarPost['images'] >= self.FilesService.fileElemImage.length ) {
                                //Si existe más de una imagen creamos una relacción de galaría
                                if(selfController.paramsGaleria.length > 0) {
                                   selfController.dataJson.addNewRelationships('galerias',selfController.paramsGaleria);
                                }
                                self.$scope.finishImages = true;
                            }
                            
                            console.log(error);
                        });
                    }else {

                        var select = '0';
                        if(file.attributes.select) {
                            select = '1'
                        }

                        item = this.controller.images[e];
                        item.select = select;
                        item.titulo = file.attributes.titulo || '-1';
                        item.leyenda = file.attributes.leyenda || '-1';
                        item.copyright = file.attributes.copyright || '-1';

                        selfController.paramsGaleria.push(item);
                        if(selfController.paramsGaleria.length > 1) {
                           selfController.attributes.formato = 'album';
                           selfController.dataJson.addNewRelationships('galerias',selfController.paramsGaleria);
                        }
                        if(select === '1') {
                            selfController.dataJson.addNewRelationships('miniaturas',item);
                        }

                        self.$scope.processPublicarPost['images']++;
                        if( self.$scope.processPublicarPost['images'] >= self.FilesService.fileElemImage.length ) {
                            self.$scope.finishImages = true;
                        }
                    }


                }

            }
            else if(this.controller.FilesService.fileElemVideo){

                this.controller.$scope.processPublicarPost['video'] = false;

                var urlVideo = this.controller.FilesService.uploadVideo(this.controller.FilesService.fileElemVideo);
                delete selfController.attributes.preview;
                selfController.attributes.formato = 'video';
                var paramsVideo = {
                    "id": selfController.dataJson.generareGuid(),
                    "url": urlVideo,
                    "type":'videos',
                    "servidor": '-1',
                    "relacionDeAspecto": '-1'
                };
                selfController.dataJson.addNewRelationships('videos',paramsVideo);

                this.controller.$scope.processPublicarPost['video'] = true;
                this.controller.$scope.finishVideo = true;

                if(!this.controller.$scope.$$phase) {
                    this.controller.$scope.$apply();
                }

                //selfController.formEntity(dataJson, attributes);
            }else if(selfController.attributes.cuerpo){

                this.controller.$scope.processPublicarPost['cuerpo'] = false;

                delete selfController.attributes.preview;
                selfController.attributes.formato = 'post';

                this.controller.$scope.processPublicarPost['cuerpo'] = true;
                this.controller.$scope.finishCuerpo = true;

                if(!this.controller.$scope.$$phase) {
                    this.controller.$scope.$apply();
                }
            }

        }

        formEntity() {

            var dataJson = this.dataJson;
            var attributes = this.attributes;

            //Relationships que relaciona la categoría
            var categoria = this.controller.category || {
                "nombre": '-1',
                "id": '-1'
            };
            var paramsCategoria = categoria;
            dataJson.addNewRelationships('categorias',paramsCategoria);

            //Miro a ver si el usuario a puesto tags
            var tagsSelected = $('.cont-crear-tags-select').select2('data');
            var tags = [];
            if(tagsSelected && tagsSelected.length > 0) {
                for(var e = 0; e <  tagsSelected.length; e++ ) {
                    tags.push({nombre:tagsSelected[e].attributes.nombre,id:tagsSelected[e].id});
                }
                dataJson.addNewRelationships('tags',tags);
            }

            dataJson.addAttributes(attributes);

            var user = this.controller._user.currentUser;
            var id = user.username;
            var username = user.nickname;
            var tipo = "usuario";

            //Relationships del usuario que crea la publicación
            var paramsUsuario = {"id":id,"nombre":username,"tipo":tipo};
            dataJson.addNewRelationships('autores',paramsUsuario);

            //Obtenemos la nueva entidad
            var newEntity = dataJson.getOutput();

            if(this.controller.isUpdate()) {
                var entity = jQuery.extend({},newEntity);
                entity.data.attributes.id = this.controller.content.id;

                this.controller.update(entity);
            }else {
                this.controller.add(newEntity);
            }

            //Regenero el ttl de la notificación para avisar al usuario que cree contenido
            this.controller._main.setTTLAdvise('noticeCreateContent',604800000);
        }

        advanceProgressbar() {
            this.progressbarPartial ++;
            this.progressbar = this.progressbarPartial  / this.progressbarTotal;
            if(this.progressbar == 1) {
                this.progressbarRes.resolve();
            }else {
                this.progressbarRes.notify(this.progressbar);
            }
        }

        progressbar = 0;
        progressbarPartial = 0;
        progressbarTotal = 1;
        progressbarRes:any;

        progressStart(newPostForm) {
            this.progressbarRes = this.controller.$q.defer();

            this.controller.submit(newPostForm);

            return this.progressbarRes.promise;
        }

        progressCancel() {
            this.progressbarRes.reject();
        }

        showMediaAction() {
            this.controller.showMediaFile = true;
            this.controller.$scope.$emit('showMediaFile',true);
            if( (!this.controller.FilesService.fileElemImage || this.controller.FilesService.fileElemImage.length < 1) && !this.controller._main.isCordovaApp() ) {
                this.selectFile(null,'#fileElemImage');
            }
        }

        hideMediaAction() {
            this.controller.showMediaFile = false;
            this.previewImageInCard();
        }

        flippyToBackAction(event) {
            if(event) {
                event.preventDefault();
            }

            angular.element('.cont-crear-cuerpo').css('visibility','visible');
            angular.element('.album-wrapper').css('visibility','visible');

            angular.element('body').addClass('flippyBack');
            angular.element('body').removeClass('flippyFront');

            this.controller._main.goToScrollTop();
            this.controller.showMediaFile = false;
            this.controller.$rootScope.$broadcast('FLIP_EVENT_IN');
        }

        flippyToFrontAction(event) {
            if(event) {
                event.preventDefault();
            }

            angular.element('.cont-crear-cuerpo').css('visibility','hidden');
            angular.element('.album-wrapper').css('visibility','hidden');

            angular.element('body').addClass('flippyFront');
            angular.element('body').removeClass('flippyBack');

            this.controller._main.goToScrollTop();
            this.controller.$rootScope.$broadcast('FLIP_EVENT_OUT');
        }

        isflippyToBack() {
            if(angular.element('body').hasClass('flippyBack')) {
                return true;
            }
            return false;
        }

        showTituloFormAction() {
            var self = this;
            this.controller.showTituloForm = true;
            setTimeout(function(){
                if(self.controller._main.isCordovaApp()) {
                    angular.element("#mobile-tituloText").focus();
                    angular.element("#mobile-tituloText").click();
                }else {
                    angular.element("#tituloText").focus();
                }
            },50);
        }

        hideTituloFormAction() {
            this.controller.showTituloForm = false;
        }

        selectFile(event,selector) {
            if(event) {
                event.preventDefault();
            }
            if (selector) {
                angular.element(selector).click();
            }
        }

        changeFiles(files) {
            this.controller.FilesService.loadImages(files);
            this.controller.FilesService.previewImageUpload({});
            this.controller._main.activeTooltip();
        }

        addFiles(files) {
            this.controller.FilesService.loadImages(files);
            this.controller.FilesService.previewImageUpload({});
            this.controller._main.activeTooltip();
        }

        deleteImage(event,index){
            if(event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
            this.controller.FilesService.deleteImage(index);
            var select = this.controller.FilesService.getSelect();
            if(index == select || (this.controller.FilesService.fileElemImage.length < 1)) {
                this.controller.FilesService.setSelect(0);
            }else if(index < select && select - index == 1) {
                this.controller.FilesService.setSelect(index);
            }else if(index < select) {
                this.controller.FilesService.setSelect(select-1);
            }
        }

        previewImageInCard() {

            var self = this;

            var content = jQuery.extend({},this.controller.content);

            if( typeof(content.relationships.miniaturas) == 'undefined') {
                content.relationships.miniaturas = {
                    data:[]
                };
            }else {
                content.relationships.miniaturas.data = [];
            }

            if ($('#preview canvas') && $('#preview canvas').length > 0) {
                var select = this.controller.FilesService.getSelect();
                var canvas = $('#preview canvas');

                if(content.relationships.miniaturas) {
                    content.relationships.miniaturas.data = [];
                }else {
                    content.relationships.miniaturas = {
                        data: []
                    };
                }
                if(content.relationships.galerias) {
                    content.relationships.galerias.data = [];
                }else {
                    content.relationships.galerias = {
                        data: []
                    };
                }

                //Solo proceso la que esta seleccionada
                /*canvas.each(function(index) {

                    var src = self.controller.FilesService.getCanvasUrl($(this)[0]);

                    var files = self.controller.FilesService.fileElemImage;

                    if(files.length > 0 && files[index]) {
                        var attributes = files[index].attributes;
                        if(!attributes) {
                            attributes = {};
                        }
                        var titulo = attributes.titulo || '';
                        var leyenda = attributes.leyenda || '';
                        var copyright = attributes.copyright || '';
                    }

                    if(index == select) {
                        self.controller.content.relationships.miniaturas.data.push({
                            url: src,
                            titulo: titulo,
                            leyenda: leyenda,
                            copyright: copyright,
                            select: '1'
                        });
                    }
                    if(canvas.length > 1) {
                        self.controller.content.relationships.galerias.data.push({
                            url: src,
                            urlMiniatura: src,
                            titulo: titulo,
                            leyenda: leyenda,
                            copyright: copyright
                        });
                    }
                });*/

                var src = '';
                canvas.eq(select).each(function(index) {

                    src = self.controller.FilesService.getCanvasUrl($(this)[0]);

                    var files = self.controller.FilesService.fileElemImage;

                    if(files.length > 0 && files[select]) {
                        var attributes = files[select].attributes;
                        if(!attributes) {
                            attributes = {};
                        }
                        var titulo = attributes.titulo || '';
                        var leyenda = attributes.leyenda || '';
                        var copyright = attributes.copyright || '';
                    }

                    content.relationships.miniaturas.data.push({
                        url: src,
                        titulo: titulo,
                        leyenda: leyenda,
                        copyright: copyright,
                        select: '1'
                    });

                });
            }

            this.controller.content = content;
            angular.element('figure .mod-img img.principal').attr('src',src);
            //this.controller.$scope.$broadcast('changeContent',content);

            this.setTipoImagenPrincipal();
            this.setPositionImagePrincipal();
    
        }

        hasPreviewImage() {
            if(this.controller.content.attributes && this.controller.content.attributes.preview && this.controller.content.attributes.preview.image) {
                return true;
            }
            return false;
        }

        editImage(target) {
            this.controller.FilesService.editImage(target);
        }

        editImageSave(target) {
            this.controller.FilesService.editImageSave(target);
        }

        editImageCancel(target) {
            this.controller.FilesService.editImageCancel(target);
        }

        cropperImage(target) {
            this.controller.FilesService.cropperImage(target);
        }

        croppImageCancel(event) {
            event.preventDefault();
            
            this.controller.FilesService.croppImageCancel();
            
        }

        croppImage(event) {
            event.preventDefault();

            this.controller.FilesService.croppImage();

        }

        rotateCropperImage(event,grades) {
            event.preventDefault();

            this.controller.FilesService.rotateImage(grades);

        }

        selectImage(target) {

            this.controller.FilesService.selectImage(target);
            
        }

        getCroppedCanvas(event) {
            event.preventDefault();
            return this.controller.FilesService.getBinaryCanvas();
        }

        isUpdate() {
            if(this.controller.$state.current.name == 'editarpost') {
                return true;
            }else {
                return false;
            }
        }

        setCuerpo(cuerpo) {
            if(cuerpo) {
                this.controller.contenidoText = cuerpo;
                setTimeout(function(){
                    if(tinymce && tinymce.editors && tinymce.editors[0]) {
                        if(tinymce.editors && tinymce.editors[0]) {
                            tinymce.editors[0].setContent(cuerpo);
                        }
                    }
                },50);
            }
        }

        regenerateFormulario() {
            var self = this.controller;

            if(this.controller.content && this.controller.content.id) {
                this.controller.tituloText = this.controller.content.attributes.titulo;
                var cuerpo = this.controller.content.attributes.cuerpo;
                this.controller.contenidoText = cuerpo;
                if(this.controller.content.attributes.usarImagenDeFondo && this.controller.content.attributes.usarImagenDeFondo != "0" ) {
                    this.controller.imagenDeFondo = 'usarImagenDeFondo';
                }
                this.controller.images = this.controller.getImagesRegenerate();

                var images = [];
                var indexSelect = 0;
                var hasSelect = false;
                angular.forEach(this.controller.images,function(image,index){
                    var titulo = image.titulo || '';
                    var leyenda = image.leyenda || '';
                    var copyright = image.copyright || '';
                    var attributes = {
                        titulo: titulo,
                        leyenda: leyenda,
                        copyright: copyright,
                        select:false
                    }

                    if( !hasSelect && image.select === "1" ) {
                        self.FilesService.setSelect(index);
                        attributes.select = true;
                        hasSelect = true;
                    }
                    images.push({type:"image",source:image.url,attributes:attributes});
                });

                this.controller.FilesService.previewImageUpload(images);

                setTimeout(function(){
                    if(tinymce.editors && tinymce.editors[0]) {
                        tinymce.editors[0].setContent(cuerpo);
                    }
                },50);

                this.controller.category = this.controller.content.relationships.categorias.data[0];

                this.controller.preview = this.controller.content.attributes.preview;
            }
        }

        getImagesRegenerate() {
            if(this.controller.content && this.controller.content.relationships && this.controller.content.relationships.galerias && this.controller.content.relationships.galerias.data.length > 0) {
                return this.controller.content.relationships.galerias.data;
            }
            else if(this.controller.content && this.controller.content.relationships && this.controller.content.relationships.miniaturas && this.controller.content.relationships.miniaturas.data.length > 0) {
                return this.controller.content.relationships.miniaturas.data;
            }
        }

        deleteImageRegenerate(index) {
            if(this.controller.images && this.controller.images.length) {
                this.controller.images.splice(index,1);
            }
        }

        editarPublicacion(event,card) {
            if(event) {
                event.preventDefault();
            }

            if(card.id) {
                var dataJson = new DataJsonController(this.controller.type,this.controller.auth);
                var attributes = {
                    id: card.id,
                    fecha:this.controller.DateService.getCurrentDateInUnix()
                };

                dataJson.addAttributes(attributes);

                var newEntity = dataJson.getOutput();
                //this.controller.delete(newEntity);
            }
        }

        initTourNewContent() {

            setTimeout(function(){
                // Instance the tour
                /*var tour = new Tour({
                  steps: [
                  {
                    debug: "true",
                    title: "Selecciona una categoría",
                    content: "Elige una categoría de las que te ofrecemos en Búho"
                  }
                  ],
                  onStart: function (tour) {console.log('hola');},
                  onEnd: function (tour) {console.log('hola');},
                  onShow: function (tour) {console.log('hola');},
                  onShown: function (tour) {console.log('hola');},
                });

                // Initialize the tour
                tour.init(true);

                // Start the tour
                tour.start(true);*/
            },1000);

        }

        isBackground() {
            if(this.controller.imagenDeFondo == 'usarImagenDeFondo') {
                return true;
            }else {
                return false;
            }
        }

        toggleBackGround(event) {
            event.preventDefault();
            if(this.controller.imagenDeFondo == 'usarImagenDeFondo') {
                this.controller.imagenDeFondo = 'transparent';
            }else {
                this.controller.imagenDeFondo = 'usarImagenDeFondo';
            }

            this.setTipoImagenPrincipal();
            this.setPositionImagePrincipal();

        }

        hasImagePrincipal() {
            var images = this.controller.FilesService.getFileElement();
            if(images && images.length > 0) {
                return true;
            }else {
                return false;
            }
        }

        //Establece la clase apaisada o esbelta en la imagen principal para colocarla centrada en base al tipo
        setTipoImagenPrincipal() {

            setTimeout(function() {
                var imagen = angular.element('.mod-img img.principal');
                var width = 0;
                var height = 0;
                var tipo = 'apaisada';
                if(imagen && imagen.length > 0) {
                    width =  imagen.width();
                    height =  imagen.height();
                }

                if(width < height) {
                    imagen.addClass('esbelta');
                    imagen.removeClass('apaisada');
                }else {
                    imagen.removeClass('esbelta');
                    imagen.addClass('apaisada');
                }
            },10);
        }

        getTipoImagenPrincipal(element) {
            var imagen = angular.element('.mod-img img.principal');
            var width = 0;
            var height = 0;
            var tipo = 'apaisada';
            if(imagen && imagen.length > 0) {
                width =  imagen.width();
                height =  imagen.height();
            }

            if(width > height) {
                tipo = 'apaisada';
            }else {
                tipo = 'esbelta';
            }

            return tipo;
        }

        setPositionImagePrincipal() {
            var self = this;

            var imagen = angular.element('.mod-img img.principal');

            imagen.css("visibility","hidden");

            setTimeout(function() {
                var contenedor = angular.element('.cont-card');
                imagen = angular.element('.mod-img img.principal');
                var width = imagen.width();
                imagen.css("left",-(width/2));
                imagen.css("visibility","visible");

                if(!self.controller.$scope.$$phase) {
                    self.controller.$scope.$apply();
                }
            },10);
        }

        //Función para controlar las imágenes de la galería y de la camará en las apps.
        getMedia(event,type) {
            event.preventDefault();

            if(this.controller._main.isCordovaApp()) {
                var self = this;

                var pictureSourceType =Camera.PictureSourceType.CAMERA;
                if(type == 'video') {
                    function videoTranscodeSuccess(result) {
                        // result is the path to the transcoded video on the device
                        console.log('videoTranscodeSuccess, result: ' + result);
                    }

                    function videoTranscodeError(err) {
                        console.log('videoTranscodeError, err: ' + err);
                    }
                    // this example uses the cordova media capture plugin
                    navigator.device.capture.captureVideo(
                        videoCaptureSuccess,
                        videoCaptureError,
                        {
                            limit: 1,
                            duration: 20
                        }
                    );

                    function videoCaptureError(error) {
                        console.log(error);
                    }

                    function videoCaptureSuccess(mediaFiles) {
                        // Wrap this below in a ~100 ms timeout on Android if
                        // you just recorded the video using the capture plugin.
                        // For some reason it is not available immediately in the file system.

                        var file = mediaFiles[0];
                        var videoFileName = 'video-name-here'; // I suggest a uuid

                        VideoEditor.transcodeVideo(
                            videoTranscodeSuccess,
                            videoTranscodeError,
                            {
                                fileUri: file.fullPath,
                                outputFileName: videoFileName,
                                outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                                optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
                                saveToLibrary: true,
                                maintainAspectRatio: true,
                                width: 640,
                                height: 640,
                                videoBitrate: 1000000, // 1 megabit
                                audioChannels: 2,
                                audioSampleRate: 44100,
                                audioBitrate: 128000, // 128 kilobits
                                progress: function(info) {
                                    console.log('transcodeVideo progress callback, info: ' + info);
                                }
                            }
                        );
                    }
                }else if(type == 'gallery') {
                    window.imagePicker.getPictures(
                        function(results) {
                            for (var i = 0; i < results.length; i++) {
                                self.controller.FilesService.addImage({
                                    attributes: {
                                        copyright:"-1",
                                        leyenda:"-1",
                                        select:false,
                                        titulo:"-1"
                                    },
                                    source:results[i],
                                    type:"image-local"
                                });
                            }
                            self.controller.FilesService.previewImageUpload({});
                            self.showMediaAction();
                            if(!self.controller.$scope.$$phase) {
                                self.controller.$scope.$apply();
                            }
                        }, function (error) {
                            console.log('Error: ' + error);
                        }, {
                            maximumImagesCount: 10,
                            width: 800
                        }
                    );
                }else {
                    navigator.camera.getPicture(
                        function(imageURI) {
                            self.controller.FilesService.addImage({
                                attributes: {
                                    copyright:"-1",
                                    leyenda:"-1",
                                    select:false,
                                    titulo:"-1"
                                },
                                source:imageURI,
                                type:"image-local"
                            });
                            self.controller.FilesService.previewImageUpload({});
                            self.showMediaAction();
                            if(!self.controller.$scope.$$phase) {
                                self.controller.$scope.$apply();
                            }
                        }, 
                        function(message) {
                            //alert('Failed because: ' + message);
                        }, 
                        { 
                            quality: 50,
                            sourceType: pictureSourceType
                        }
                    );
                }

                
            }

        }

    }

}