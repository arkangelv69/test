/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../models/mainModel.ts" />

module ILovePlatos{

    export class FilesService {

        static $inject = [
            "config",
            "$rootScope",
            "$http",
            "$q",
            "$log",
            "$httpParamSerializerJQLike",
            "$compile"
        ];

        _main:IMainScope;
        fileElemImage = [];
        cropImage: any;        
        fileElemVideo:any;
        numMaxImages = 20;
        maxSizeImages = 10485760; //en bytes
        controller = '';

        constructor(protected $config: any, protected $rootScope, protected $http, protected $q,protected $log, protected $httpParamSerializerJQLike, private $compile){
            this._main = $rootScope.$$childHead.mainCtrl;
        }

        uploadVideo(video){
            var formData= new FormData();
            var bucket = this.$config.bucket;
            var bucketSubFolder = btoa(Math.floor((Math.random() * 9999999) + 999).toString())+"/";
            var url;
            if(/^video\//i.test(video[0].type)){
                var fileExt = '.' + video[0].name.split('.').pop();
                var actual_video_name = btoa(video[0].name);
                url = "http://"+bucket+".s3.amazonaws.com/"+bucketSubFolder + actual_video_name + fileExt;
                formData.append(bucketSubFolder + actual_video_name, video[0]);
            }else{
                this._main.resetMessages();
                this._main.setMessage({type:'danger',text: "El archivo "+video[0].name+" no es de un formato válido."});
            }

            $.ajax({
                url: "perfil/upload",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                }
            });
            return url;
        }

        addImage(item) {
            this.fileElemImage.push(item);
        }

        resetFiles() {
            this.fileElemImage = [];
        }

        setController(controller) {
            this.controller = controller;
        }

        getFileElement() {
            return this.fileElemImage;
        }

        getCanvasUrl(canvas) {
            var dataurl = canvas.toDataURL("image/png");

            return dataurl;
        }

        resizeImage(canvas,img) {

            if(!img) {
                return null;
            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 1280;
            var MAX_HEIGHT = 768;
            var width = img.width;
            var height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            }
            else if(width == height) {
                if (width > MAX_WIDTH) {
                    width = MAX_WIDTH;
                    height = MAX_WIDTH;
                }
            }  
            else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
        }

        getCroppedCanvas(options) {

            var ctx = this.canvasCropper.cropper('getCroppedCanvas');

            var MAX_WIDTH = 1280;
            var MAX_HEIGHT = 768;

            var width = ctx.width;
            var height = ctx.height;

            if(options['MAX_WIDTH']) {
                MAX_WIDTH = options['MAX_WIDTH'];
            }
            if(options['MAX_HEIGHT']) {
                MAX_WIDTH = options['MAX_HEIGHT'];
            }

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            }
            else if(width == height) {
                if (width > MAX_WIDTH) {
                    width = MAX_WIDTH;
                    height = MAX_WIDTH;
                }
            } 
            else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            return this.canvasCropper.cropper('getCroppedCanvas',{width:width,height});
        }

        previewImageUpload(images?,callback?){

            if(images && images.length > 0) {
                this.fileElemImage = jQuery.merge(this.fileElemImage,images);
            }

            var filesArray = this.fileElemImage;
            var preview = document.getElementById("preview");
            preview.innerHTML = '';

            if (filesArray && filesArray.length > 0) {
                this.selectImageByDefault(filesArray);
                this.nextImage(0,filesArray,callback);
            }
        }

        isEditable = false;
        isCropperable = false;
        isSelectable = false;

        setImagePreviewEditable(isEditable:boolean) {
            this.isEditable = isEditable;
        }

        setImagePreviewCropperable(isCropperable:boolean) {
            this.isCropperable = isCropperable;
        }

        setImagePreviewSelectable(isSelectable:boolean) {
            this.isSelectable = isSelectable;
        }

        nextImage(i,files,callback?) {
            var file = files[i];
            var type = file.type;
            var source = file.source;
            var self = this;
            var wrap = document.createElement("div");
            var index = 'name'+i;
            if(type == 'file') {
                index = source.name.replace(/[ .#()]/g,'');
            }
            files[i].name = index;

            var preview = document.getElementById("preview");
            var isGroup = 'single';
            if(files.length > 1) {
                isGroup = 'group';
            }
            wrap.classList.add("wrapImage","wrapImage-"+index,isGroup);

            var deleteButton = "<button type='button' class='btn-eliminar-foto' data-ng-click='"+this.controller+".deleteImage($event,"+i+")' aria-label='Left Align'></button>" ;
            var canvas = document.createElement("canvas");
            canvas.classList.add("fileimage-item", "canvas"+i, "new");

            var loading = document.createElement("div");
            loading.classList.add("wrapper_loading","hidden");
            loading.innerHTML = '<span class="loading-file glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>';

            if(this.isEditable) {
                var editableButton = "<button type='button' class='btn-edit-foto' onClick='angular.element(this).scope()."+this.controller+".editImage(this)' data-toggle='tooltip' data-placement='bottom' title='Aquí puedes añadir información a la imagen.'></button>" ;
            }

            if(this.isCropperable) {
                var cropperableButton = "<button type='button' class='btn-cropper-foto' onClick='angular.element(this).scope()."+this.controller+".cropperImage(this)' data-toggle='tooltip' data-placement='bottom' title='Aquí puedes recortar la foto para mostrar solo lo que a tí te interesa.'></button>" ;
            }

            if(this.isSelectable &&  files.length > 1) {
                var selectableButton = "<button type='button' class='btn-select-foto' onClick='angular.element(this).scope()."+this.controller+".selectImage(this)' data-toggle='tooltip' data-placement='bottom' title='Selcciona la imagen que quieres que se muestre en la tarjeta como portada.'></button>" ;
            }
            
            wrap.innerHTML = deleteButton; 
            if(this.isEditable) {
                wrap.innerHTML += editableButton; 
            }
            if(this.isCropperable) {
                wrap.innerHTML += cropperableButton; 
            }
            if(this.isSelectable) {
                wrap.innerHTML += selectableButton; 
            }
            wrap.appendChild(canvas);
            wrap.appendChild(loading);
            preview.appendChild(wrap); // Assuming that "preview" is the div output where the content will be displayed.


            if(this.isSelectable) {
                if(i == 0 && typeof(this.select) == 'undefined') {
                    this.select = 0;
                    $(".wrapImage-"+index).addClass('select');
                }else if( typeof(this.select) != 'undefined' && i == this.select) {
                    $(".wrapImage-"+index).addClass('select');
                }
            }

            $(".wrapImage-"+index+" canvas").data('index',i);

            var elem = angular.element(".wrapImage-"+index);
            var scope = elem.scope();
            this.$compile(elem.contents())(scope);
            
            var target = $(".canvas"+i)[0];
            var ctx = $(".canvas"+i)[0].getContext('2d');
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = function() {
                self.resizeImage(target,img);
                i++;
                if( i < files.length ) {
                    self.nextImage(i,files,callback);
                }else if(typeof(callback) == 'function') {
                    callback();
                }
            }

            var src = source;
            if(type == 'file') {
                src = URL.createObjectURL(source);
            }
            img.src = src;
        }

        canvasCropper:any;
        select:number;

        editImage(target) {
            var self = this;

            var canvas = angular.element(target).siblings('canvas');

            self.renderImageFromCanvas(target,'.canvasEdit-image');

            var index = angular.element(canvas).data('index');

            if(typeof(index) != 'undefined' && this.fileElemImage.length > 0 && this.fileElemImage[index]) {
                var attributes = this.fileElemImage[index].attributes;
                if(!attributes) {
                    attributes = {};
                }
                var titulo = attributes.titulo || '';
                if(titulo == '-1') {
                    titulo = '';
                }
                var leyenda = attributes.leyenda || '';
                if(leyenda == '-1') {
                    leyenda = '';
                }
                var copyright = attributes.copyright || '';
                if(copyright == '-1') {
                    copyright = '';
                }
            }

            angular.element("#canvasEdit-titulo").val(titulo);
            angular.element("#canvasEdit-leyenda").val(leyenda);
            angular.element("#canvasEdit-copyright").val(copyright);

            angular.element("#canvasEdit").fadeIn(500);
        }

        editImageSave() {
                var titulo = angular.element("#canvasEdit-titulo").val();
                var leyenda = angular.element("#canvasEdit-leyenda").val();
                var copyright = angular.element("#canvasEdit-copyright").val();

                var canvas = angular.element('.canvasEdit-image img').data('canvas');

                var index = angular.element(canvas).data('index');

                if(typeof(index) != 'undefined' && this.fileElemImage.length > 0 && this.fileElemImage[index]) {
                    if(!this.fileElemImage[index].attributes) {
                        this.fileElemImage[index].attributes = {};
                    }
                    this.fileElemImage[index].attributes.titulo = titulo;
                    this.fileElemImage[index].attributes.leyenda = leyenda;
                    this.fileElemImage[index].attributes.copyright = copyright;
                }

                angular.element("#canvasEdit-titulo").val('');
                angular.element("#canvasEdit-leyenda").val('');
                angular.element("#canvasEdit-copyright").val('');

                angular.element("#canvasEdit").fadeOut(500);
        }

        editImageCancel(target) {
                angular.element("#canvasEdit").fadeOut(500);
        }

        cropperImage(target) {
            var self = this;

            var canvas = angular.element(target).siblings('canvas');
            var positionTop = canvas.offset().top - $("body").offset().top;
            var positionLeft = canvas.offset().left - $("body").offset().left;
            var widthTarget = canvas.width();
            var heightTarget = canvas.height();

            self.renderImageFromCanvas(target,'.canvasCropper-image');

            self.markCropped(target);

            angular.element("#canvasCropper").fadeIn(500);

            var image = angular.element('#canvasCropper img');
            var width = image.width();
            var height = image.height();

            var options = {
                dragMode: 'move',
                //aspectRatio: 16/9,
                autoCropArea: 0.8,
                restore: true,
                guides: false,
                rotatable:true,
                center: true,
                highlight: true,
                background:true,
                dragCrop: false,
                cropBoxMovable: true,
                cropBoxResizable: true,

                minContainerWidth:width,
                minContainerHeight:height,

                minCanvasWidth:width,
                minCanvasHeight:height
            };

            self.canvasCropper = angular.element('.canvasCropper-image img').cropper(options);

        }

        markCropped(target) {
            var canvas = angular.element(target).siblings('canvas');
            var index = canvas.data('index');
            this.fileElemImage[index].cropped = true;
        }

        croppImageCancel() {
                angular.element("#canvasCropper").fadeOut(500);
        }

        croppImage() {

            var MAX_WIDTH = 1280;
            var MAX_HEIGHT = 768;

            var sourceCanvas = this.canvasCropper.cropper('getCroppedCanvas');
            var dataCanvas = this.canvasCropper.cropper('getData');

            var destinationCanvas = angular.element('.canvasCropper-image img').data('canvas');
            var destCtx = destinationCanvas.getContext('2d');

            var width = 0;
            var height = 0;
            if(dataCanvas.width >= dataCanvas.height) {
                width = MAX_WIDTH;
                height = MAX_WIDTH * dataCanvas.height /  dataCanvas.width;
                
            }
            else {
                width = MAX_HEIGHT * dataCanvas.width /  dataCanvas.height;
                height = MAX_HEIGHT;
            }

            destinationCanvas.width = width;
            destinationCanvas.height = height;

            destCtx.clearRect(0, 0, destinationCanvas.width, destinationCanvas.height);
            destCtx.width = width;
            destCtx.height = height;
            destCtx.drawImage(sourceCanvas, 0, 0, width, height);

            angular.element("#canvasCropper").fadeOut(500);
        }

        rotateImage(grades) {
            if(event) {
                event.preventDefault();
            }
            this.canvasCropper.cropper('rotate',grades);
        }

        setSelect(indexSelect) {
            var self = this;
            this.select = indexSelect;

            angular.element('#preview .wrapImage').each(function(index) {
                if(!self.fileElemImage[index].attributes) {
                    self.fileElemImage[index].attributes = {};
                }
                self.fileElemImage[index].attributes.select = false;
                angular.element(this).removeClass("select");
                if(index == indexSelect) {
                    self.fileElemImage[index].attributes.select = true;
                    angular.element(this).addClass("select");
                }
            });
        }

        selectImageByDefault(files) {
            var hasSelect = false;
            for(var e = 0;e < files.length;e++) {
                if(files[e].attributes && files[e].attributes.select) {
                    hasSelect = true;
                }
            }
            if(!hasSelect) {
                if(!files[0].attributes) {
                    files[0].attributes = {};
                }
                files[0].attributes.select = true;
            }
        }

        selectImage(target) {
            var self = this;
            var canvas = angular.element(target).siblings('canvas');
            var indexClass = canvas.data('index');
            this.select = indexClass;

            angular.element('#preview .wrapImage').each(function(index) {
                if(!self.fileElemImage[index].attributes) {
                    self.fileElemImage[index].attributes = {};
                }
                self.fileElemImage[index].attributes.select = false;
                angular.element(this).removeClass("select");
                if(index == indexClass) {
                    self.fileElemImage[index].attributes.select = true;
                    angular.element(this).addClass("select");
                }
            });
        }

        getSelect() {
            return this.select;
        }

        renderImageFromCanvas(target,select) {
            var canvas = angular.element(target).siblings('canvas')[0];
            var url = this.getCanvasUrl(canvas);
            angular.element(select).html('<img src="'+url+'" />');
            angular.element(select+' img').data('canvas',canvas);
        }

        deleteImage(index){
            this.setSelect(0);
            this.fileElemImage.splice(index,1);
            angular.element('#fileElemImage').val('');

            this.previewImageUpload();
            if(this.fileElemImage && this.fileElemImage.length == 0){
                $('#videoSelect').removeAttr("disabled");
            }
        }

        loadImages(files){
            this._main.resetMessages();
            var archivosInvalidos = [];
            var nombreInvalidos = '';
            var archivosTamannoInvalidos = [];
            var nombreTamannoInvalidos = '';
            var file;
            var textoError;

            for (var i = 0; i < files.length; i++) {
                file = files[i];
                if(/^image\//i.test(file.type)){
                    if(file.size < this.maxSizeImages){
                        this.fileElemImage.push({type:"file",source:file});
                    }else{
                        archivosTamannoInvalidos.push(file);
                        nombreTamannoInvalidos += " "+file.name;
                    }
                }else{
                    archivosInvalidos.push({type:"file",source:file});
                    nombreInvalidos += " "+file.name;
                }
            }

            //muestro mensaje de error
            if(archivosInvalidos.length >= 1){
                if(archivosInvalidos.length == 1) textoError = "El archivo "+nombreInvalidos+" no nos vale. por que no pruebas guardarlo como JPG o PNG";
                else textoError = "Los archivos "+nombreInvalidos+" no nos valen. por que no pruebas guardarlo como JPG o PNG";
                this._main.setMessage({type:'danger',text: textoError});
            }

            //muestro mensaje de error
            if(archivosTamannoInvalidos.length >= 1){
                if(archivosTamannoInvalidos.length == 1) textoError = "Con lo que pesa esta imagen podemos atascar todo internet, prueba ponerla a dieta.";
                else textoError = "Con lo que pesa estas imágenes podemos atascar todo internet, prueba ponerla a dieta.";
                this._main.setMessage({type:'danger',text: textoError});
            }

            //elimino los que sobran y muestro mensaje de error
            if(this.fileElemImage.length > this.numMaxImages){
                this.fileElemImage = this.fileElemImage.slice(0,this.numMaxImages);
                this._main.setMessage({type:'danger',text: "Hey! que tan solo tengo dos alas, prueba subir menos imágenes."});
            }

            $('#videoSelect').attr("disabled", "disabled");

            //si cargo imágenes no puedo cargar vídeos. Vacío array de vídeos.
            this.fileElemVideo = null;

        }

        getBinaryCanvas(options) {
            var canvas = this.getCroppedCanvas(options);

            if(jQuery('#canvasCropped').length < 1) {
                jQuery('body').append('<div id="canvasCropped"></div>');
            }
            jQuery('#canvasCropped').html(canvas);
            var canvasObject:any = jQuery("#canvasCropped canvas")[0];
            var Pic = canvasObject.toDataURL("image/png");
            return Pic.replace(/^data:image\/(png|jpg);base64,/, "");
        }

        previewRecorteImage(relacion){
            var self = this;
            var file = self.fileElemImage[0];
            if(file){
                var preview = document.getElementById("preview");
                preview.innerHTML = '';

                var img = new Image();
                img.setAttribute('crossOrigin', 'anonymous');
                img.onload = function(e) {

                    preview.appendChild(img);

                    self.canvasCropper = $('#preview img').cropper({
                        dragMode: 'move',
                        restore:false,
                        aspectRatio: relacion,
                        autoCropArea: 0.65,
                        strict: true,
                        guides:false,
                        rotatable: true,
                        dragCrop: false,
                        cropBoxMovable: true,
                        cropBoxResizable: true,
                        background: true,
                        center:true,
                        crop: function (e) {
                            var json = [
                                '{"x":' + e.x,
                                '"y":' + e.y,
                                '"height":' + e.height,
                                '"width":' + e.width,
                                '"rotate":' + e.rotate + '}'
                                ].join();
                        $('.avatar-data').val(json);
                      }
                    });

                }

                var src = URL.createObjectURL(file.source);
                img.src = src;

            }
        }
        
        uploadImages(files){
            var formData = new FormData();
            var file;
            var self = this;
            for (var i = 0; i < files.length; i++) {
                file = files[i];
                if(/^image\//i.test(file.type) && file.size < 10485760){
                    formData.append(i, file);
                }
            }

            return $.when($.ajax({
                url: self.$config.protocolApirest+self.$config.domainApirest+"/private/imagenes/upload/crop",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
            }));

        }

        uploadImageCrop(file){
            var formData = new FormData();
            var self = this;
            if(/^image\//i.test(file.type) && file.size < 10485760){
                formData.append(0, file);
            }

            return $.when($.ajax({
                url: self.$config.protocolApirest+self.$config.domainApirest+"/private/imagenes/upload/crop",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
            }));

        }

        uploadImage(file){
            var self = this;
            var formData = new FormData();
            if(/^image\//i.test(file.type) && file.size < 10485760){
                formData.append(0, file);
            }

            return $.when($.ajax({
                url: self.$config.protocolFront+self.$config.domainFront+"/private/images/upload/single",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
            }));

        }

        uploadImagePreview(files){            

            var self = this;
            var d = this.$q.defer();
            var self = this;

            this.$http({
                method: 'POST',
                url: self.$config.protocolFront+self.$config.domainFront+"/private/images/upload/preview",
                data: {"data":files},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success((response: iEntityApirest) => {
                    if(response && response.data) {
                        d.resolve(response.data);
                    }else {
                        d.reject({error:true});
                    }
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });
                

            return d.promise;

        }

        uploadImageBinary(file,attributes){            

            var d = this.$q.defer();
            var self = this;

            this.$http({
                method: 'POST',
                url: self.$config.protocolApirest+self.$config.domainApirest+"/private/images/upload/binary",
                data: {"data":file},
                contentType: 'application/octet-stream',
                }).success((response) => {
                    if(response && response.data) {
                        response.attributes = attributes || {};
                        d.resolve(response);
                    }else {
                        d.reject({error:true});
                    }
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });
                

            return d.promise;

        }

    }

}