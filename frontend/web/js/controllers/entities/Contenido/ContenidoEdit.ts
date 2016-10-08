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

        controller:RestaurantController;

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

        constructor(controller) {
            this.controller = controller;
            this.dataJson = new DataJsonController('contenidos',controller.auth);
        }

        initEdit() {
            var self = this;

            this.controller.$scope.processPublicarPost = {};
            this.controller.$scope.finishCuerpo = false;
            this.controller.$scope.finishImages = false;
            this.controller.$scope.finishVideo = false;

            //Al iniciar le indico al servio FilesService que las imágenes de preview, tienen que ser cropeables y seleccionables
            this.controller.FilesService.setImagePreviewEditable(true);
            this.controller.FilesService.setImagePreviewCropperable(true);
            this.controller.FilesService.setImagePreviewSelectable(true);

            //Si existen valores las pinto ya en la tarjeta de la publicación.
            this.controller._main.activeTooltip();

            this.controller.FilesService.resetFiles();
            this.controller.FilesService.setController('restaurantCtrl');

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
                self.controller.$scope.finishImages = false;
                self.controller.$scope.finishVideo = false;

                if( publish ) {
                    self.formEntity();
                }

            });
        }

        syncPreviewCard() {
            
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
                this.progressCancel();
                return null;
            }
            if(!this.controller.contenidoText && 
                (!this.controller.FilesService.fileElemImage || this.controller.FilesService.fileElemImage.length == 0) && 
                (!this.controller.FilesService.fileElemVideo || this.controller.FilesService.fileElemVideo.length == 0)
            ){
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'No hay ningún contenido que publicar.'});

                this.progressCancel();
                return null;
            }
            if( !this.controller.category && !this.controller.category.id ) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar una categoría.'});

                this.progressCancel();
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

            if(this.controller.FilesService.fileElemImage && 
                this.controller.FilesService.fileElemImage.length > 0){

                this.controller.$scope.processPublicarPost['images'] = 0;

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

                            selfController.dataJson.addNewRelationships('miniaturas',item);

                            self.advanceProgressbar();

                            self.$scope.processPublicarPost['images']++;

                            angular.element('.wrapImage-'+response.data[0].index+' .loading-file').removeClass('glyphicon-refresh glyphicon-refresh-animate');
                            angular.element('.wrapImage .loading-file').addClass('glyphicon-ok');

                            //Hasta que no se han procesado todas las imágenes no creamos las relacciones
                            if( self.$scope.processPublicarPost['images'] >= self.FilesService.fileElemImage.length ) {
                                self.$scope.finishImages = true;
                            }

                            if(!self.$scope.$$phase) {
                                self.$scope.$apply();
                            }
                        },function(error) {
                            self.$scope.processPublicarPost['images']++;

                            //Hasta que no se han procesado todas las imágenes no creamos las relacciones
                            if( self.$scope.processPublicarPost['images'] >= self.FilesService.fileElemImage.length ) {
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
            var self = this;
            setTimeout(function() {
                self.controller.FilesService.renderRecorteRestaurant('#preview','.canvasCropper-image');
                self.controller.FilesService.renderRecorteCuadrado('#preview','.canvasCropper-image');
                self.controller.FilesService.renderRecorteApaisado('#preview','.canvasCropper-image');
            },300);
            this.controller.FilesService.cropperImage('#preview');
            if( !self.controller.$scope.$$phase  ) {
                self.controller.$scope.$apply();
            }
        }

        addFiles(files) {
            this.controller.FilesService.loadImages(files);
            this.controller.FilesService.previewImageUpload({});
            this.controller.FilesService.cropperImage('#preview');
        }

        deleteImage(event,index){
            if(event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
            this.controller.FilesService.deleteImage(index);
        }

        hasImage() {
            if(this.controller.FilesService.fileElemImage && this.controller.FilesService.fileElemImage.length > 0) {
                return true;
            }
            return false;
        }

        renderRecorteRestaurant(target,select) {
            this.controller.FilesService.renderRecorteRestaurant(target,select);
        }

        renderRecorteCuadrado(target,select) {
            this.controller.FilesService.renderRecorteCuadrado(target,select);
        }

        renderRecorteApaisado(target,select) {
            this.controller.FilesService.renderRecorteApaisado(target,select);
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