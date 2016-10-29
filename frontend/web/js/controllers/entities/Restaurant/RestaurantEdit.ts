/// <reference path="../../../../typings/jquery/jquery.d.ts" />

/// <reference path="../../data/DataJsonController.ts" />

module ILovePlatos{

    declare var preview:any;
    declare var tinymce:any;
    declare var Camera:any;
    declare var window:any;
    declare var navigator:any;

    export class RestaurantEdit{

        controller:RestaurantController;

        dataJson:any;

        constructor(controller) {
            this.controller = controller;
            this.dataJson = new DataJsonController('Restaurant',controller.auth);

            this.controller.$scope.processPublicarPost = {};
            this.controller.$scope.processPublicarPost['body'] = false;
            this.controller.$scope.processPublicarPost['images'] = {};
            this.controller.$scope.processPublicarPost['images']['original'] = false;
            this.controller.$scope.processPublicarPost['images']['main'] = false;
            this.controller.$scope.processPublicarPost['images']['square'] = false;
            this.controller.$scope.processPublicarPost['images']['landscape'] = false;

            var self = this;

            this.controller.$scope.$watch("processPublicarPost.body + processPublicarPost.images.original + processPublicarPost.images.main + processPublicarPost.images.square + processPublicarPost.images.landscape", function(newValue, oldValue) {
                if(
                    self.controller.$scope.processPublicarPost['body'] &&
                    self.controller.$scope.processPublicarPost['images']['original'] && 
                    self.controller.$scope.processPublicarPost['images']['main'] && 
                    self.controller.$scope.processPublicarPost['images']['square'] && 
                    self.controller.$scope.processPublicarPost['images']['landscape'] 
                ) {
                    self.formEntity();
                }
            });
        }

        initEdit() {
            var self = this;

            this.controller.FilesService.resetFiles();
            this.controller.FilesService.setController('restaurantCtrl');

        }

        syncPreviewCard() {
            
        }

        isSubmitActive(){
            var content = this.controller.content;
            if( 
                !content.attributes.name || 
                !content.attributes.address ||
                !content.attributes.longitude ||
                !content.attributes.latitude  ||
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
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar un nombre para el local'});

                this.progressCancel();
                return null;
            }

            if(!content.attributes.latitude) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar un local en el mapa'});

                this.progressCancel();
                return null;
            }

            if(!content.attributes.longitude) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar un local en el mapa'});

                this.progressCancel();
                return null;
            }

            if(!content.attributes.address) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar un local en el mapa'});

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

            self.$scope.processPublicarPost['body'] = true;
            _this.advanceProgressbar();

            if( this.controller.FilesService.fileElemImage && 
                this.controller.FilesService.fileElemImage.length > 0) {

                var images = content.attributes.images;

                this.controller.FilesService.uploadOriginal('#preview','.canvasCropper-image').then(function(response) {
                    images.original.url = response.image;
                    _this.advanceProgressbar();
                    self.$scope.processPublicarPost['images']['original'] = true;
                },function(error) {
                    _this.progressCancel();
                });
                this.controller.FilesService.uploadRecorteRestaurant('#preview','.canvasCropper-image').then(function(response) {
                    images.thumbnails.main.url = response.image;
                    _this.advanceProgressbar();
                    self.$scope.processPublicarPost['images']['main'] = true;
                },function(error) {
                    _this.progressCancel();
                });
                this.controller.FilesService.uploadRecorteCuadrado('#preview','.canvasCropper-image').then(function(response) {
                    images.thumbnails.square.url = response.image;
                    _this.advanceProgressbar();
                    self.$scope.processPublicarPost['images']['square'] = true;
                },function(error) {
                    _this.progressCancel();
                });
                this.controller.FilesService.uploadRecorteApaisado('#preview','.canvasCropper-image').then(function(response) {
                    images.thumbnails.landscape.url = response.image;
                    _this.advanceProgressbar();
                    self.$scope.processPublicarPost['images']['landscape'] = true;
                },function(error) {
                    _this.progressCancel();
                });

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
            var paramsUsuario = {"admin":[55]};
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
        progressbarTotal = 5;
        progressbarRes:any;

        progressStart(newPostForm) {
            this.progressbarRes = this.controller.$q.defer();

            this.submit(newPostForm);

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
                self.controller.FilesService.renderRecorteRestaurant('#preview','.canvasCropper-image.restaurant');
                self.controller.FilesService.renderRecorteCuadrado('#preview','.canvasCropper-image.cuadrado');
                self.controller.FilesService.renderRecorteApaisado('#preview','.canvasCropper-image.apaisado');
            },300);
            this.controller.FilesService.cropperImage('original','#preview');
            if( !self.controller.$scope.$$phase  ) {
                self.controller.$scope.$apply();
            }
        }

        addFiles(files) {
            this.controller.FilesService.loadImages(files);
            this.controller.FilesService.previewImageUpload({});
            this.controller.FilesService.cropperImage('original','#preview');
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

        uploadOriginal(target,select) {
            return this.controller.FilesService.uploadOriginal(target,select);
        }

        uploadRecorteRestaurant(target,select) {
            return this.controller.FilesService.uploadRecorteRestaurant(target,select);
        }

        uploadRecorteCuadrado(target,select) {
            return this.controller.FilesService.uploadRecorteCuadrado(target,select);
        }

        uploadRecorteApaisado(target,select) {
            return this.controller.FilesService.uploadRecorteApaisado(target,select);
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

        cropperImage(id,target) {
            this.controller.FilesService.cropperImage(id,target);
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
            if(this.controller.$state.current.name == 'editrestaurant') {
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