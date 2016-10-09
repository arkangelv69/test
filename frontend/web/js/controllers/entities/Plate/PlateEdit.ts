/// <reference path="../../../../typings/jquery/jquery.d.ts" />

/// <reference path="../../data/DataJsonController.ts" />

module ILovePlatos{

    declare var preview:any;
    declare var tinymce:any;
    declare var Camera:any;
    declare var window:any;
    declare var navigator:any;

    export class PlateEdit{

        controller:RestaurantController;

        dataJson:any;

        constructor(controller) {
            this.controller = controller;
            this.dataJson = new DataJsonController('Plate',controller.auth);
        }

        initEdit() {
            var self = this;

            this.controller.FilesService.resetFiles();
            this.controller.FilesService.setController('plateCtrl');

        }

        syncPreviewCard() {
            
        }

        isSubmitActive(){
            var content = this.controller.content;
            if( 
                !content.attributes.name || 
                !content.attributes.address ||
                !content.attributes.longitude ||
                !content.attributes.latitude ||
                this.controller.FilesService.fileElemImage.length < 1
            ){
                return false
            }
            return true;
        }

        submit(newPostForm,update?) {
            var self = this.controller;
            var _this = this;
            var content = this.controller.content;

            if(!this.controller._user.isLogged()) {
                this.progressCancel();
                return null;
            }

            if(!content.attributes.name) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar un nombre para el plato'});

                this.progressCancel();
                return null;
            }

            if( !this.controller.FilesService.fileElemImage || this.controller.FilesService.fileElemImage.length < 1 ){
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'No hay ningún imagen seleccionada'});

                this.progressCancel();
                return null;
            }

            var uploadImages = $('#preview canvas.new');

            content.attributes.date = this.controller.DateService.getCurrentDateInUnix();

            //Prepara el data y lo envía.
            this.formEntity();

            return null;

            //TODO -> de momento no paso por aquí.
            if( false &&  this.controller.FilesService.fileElemImage && 
                this.controller.FilesService.fileElemImage.length > 0) {

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

                    _this.progressbarTotal++;

                    //Si es de tipo file lo mandamos al servidor
                    if(type == 'file' || type == 'image-local' || (type == 'image' && cropped)) {
                        this.controller.FilesService.uploadImageBinary(binary,file.attributes).then(function(response) {

                            if(response && response.data &&  response.data.length > 0) {
                                item = {
                                    "id": _this.dataJson.generareGuid(),
                                    "url": response.data[0]['original']['url'],
                                    "type":'imagenes',
                                    "ancho": response.data[0]['original']['ancho'],
                                    "alto": response.data[0]['original']['alto'],
                                    "recortadas": response.data[0]['recortadas'],
                                };
                            }

                            _this.dataJson.addNewRelationships('miniaturas',item);

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
                    }


                }

            }

        }

        formEntity() {

            var content = this.controller.content;
            var dataJson = this.dataJson;
            var attributes = content.attributes;

            dataJson.addAttributes(attributes);

            var user = this.controller._user.currentUser;
            var id = user.username;

            //Relationships del usuario que crea la publicación
            var paramsUsuario = {"admin":['David']};
            dataJson.addNewRelationships('relatedFrom',paramsUsuario);

            //Obtenemos la nueva entidad
            var newEntity = dataJson.getOutput();

            if(this.controller.isUpdate()) {
                var entity = jQuery.extend({},newEntity);
                entity.data.id = content.id;

                this.controller.update(entity);
            }else {
                this.controller.add(newEntity);
            }

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

        regenerateFormulario() {
            
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