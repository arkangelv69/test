/// <reference path="EntityController.ts" />
/// <reference path="Contenido/ContenidoCard.ts" />
/// <reference path="Restaurant/RestaurantEdit.ts" />

module ILovePlatos{

    export class RestaurantController extends EntityController{

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
            "store",
            "FilesService",
            "$q",
            "$filter"
        ];

        mother;
        images = [];

        ContenidoCard:ContenidoCard;
        RestaurantEdit:RestaurantEdit;
        
        dataAutocomplete:any;
        content:any = {
                id:"",
                type:"Restaurant",
                attributes:{
                    name: "",
                    address: "",
                    addressName: "",
                    longitude: 0,
                    latitude: 0,
                    date:0,
                    images:{
                        "type":'images',
                        "original": {
                            "url":""
                        },
                        "thumbnails": {
                            "main":{
                                "url":""
                            },
                            "square":{
                                "url":""
                            },
                            "landscape":{
                                "url":""
                            }
                        }
                    }
                }
            };

        constructor($config,api,DateService,$rootScope,public $stateParams,public $scope,public $state,$element,$sce,auth,store,public FilesService, public $q,public $filter){
            super($config,api,DateService,$rootScope,$stateParams,$scope,$state,$element,$sce,auth,store);

            var self = this;

            this.ContenidoCard = new ContenidoCard(this);
            this.RestaurantEdit = new RestaurantEdit(this);

            window.addEventListener('message', function(event) { 

                // IMPORTANT: Check the origin of the data! 
                if (event.data.lat && event.data.lng) { 
                    // The data has been sent from your site 

                    // The data sent with postMessage is stored in event.data 
                    self.dataAutocomplete = event.data;

                    self.content.attributes.longitude =  event.data.lng;
                    self.content.attributes.latitude =  event.data.lat;
                    self.content.attributes.address =  event.data.address;
                    self.content.attributes.addressName =  event.data.name;

                    if(!self.$scope.$$phase) {
                        self.$scope.$apply();
                    }

                } else { 
                    // The data hasn't been sent from your site! 
                    // Be careful! Do not use it. 
                    return; 
                } 
            }); 

        }

        renderIframeMap() {
            var url = this.getUrlIframe();
            var template = '<iframe width="100%" height="500px" src="'+url+'"></iframe>';
            angular.element('#renderIframeMap').replaceWith(template);
        }

        getUrlIframe() {
            return "https://s3.eu-central-1.amazonaws.com/production-frontend/test/maps/index-2.html"+this.getQueryIframe();
        }

        getQueryIframe() {
            var attributes = this.content.attributes;
            var lat = attributes.latitude;
            var lng = attributes.longitude;
            var address = attributes.address || "";
            var addressName = attributes.addressName || "";
            return "?lat="+lat+"&lng="+lng+"&address="+address+"&addressName="+addressName;
        }

        getImageOriginal(card) {
            return this.ContenidoCard.getImageOriginal(card);
        }

        getUrlImgOriginal(card) {
            return this.ContenidoCard.getUrlImgOriginal(card);
        }

        getUrlImgMain(card) {
            return this.ContenidoCard.getUrlImgMain(card);
        }

        getUrlImgSquare(card) {
            return this.ContenidoCard.getUrlImgSquare(card);
        }

        getUrlImgLandscape(card) {
            return this.ContenidoCard.getUrlImgLandscape(card);
        }

        getName(card) {
            return this.ContenidoCard.getName(card);
        }

        initEdit() {
            this.RestaurantEdit.initEdit();
        }

        isSubmitActive(){
            return this.RestaurantEdit.isSubmitActive();
        }

        progressStart(newPostForm) {
            this.RestaurantEdit.progressStart(newPostForm);
        }

        formEntity() {
            this.RestaurantEdit.formEntity();
        }

        selectFile(event,selector) {
            this.RestaurantEdit.selectFile(event,selector);
        }

        changeFiles(files) {
            this.RestaurantEdit.changeFiles(files);
        }

        hasImage() {
            return this.RestaurantEdit.hasImage();
        }

        addFiles(files) {
            this.RestaurantEdit.addFiles(files);   
        }

        deleteImage(event,index){
            this.RestaurantEdit.deleteImage(event,index);
        }

        renderRecorteCuadrado(event,target) {
            event.preventDefault();
            this.RestaurantEdit.renderRecorteCuadrado(target,'.canvasCropper-image');
        }

        renderRecorteApaisado(event,target) {
            event.preventDefault();
            this.RestaurantEdit.renderRecorteApaisado(target,'.canvasCropper-image');
        }

        cropperImage(id,target) {
            this.RestaurantEdit.cropperImage(id,target);
        }

        croppImageCancel(event) {
            this.RestaurantEdit.croppImageCancel(event);
        }

        croppImage(event) {
            this.RestaurantEdit.croppImage(event);
        }

        rotateCropperImage(event,grades) {
            this.RestaurantEdit.rotateCropperImage(event,grades);
        }

        getCroppedCanvas(event) {
            return this.RestaurantEdit.getCroppedCanvas(event);
        }

        isUpdate() {
            return this.RestaurantEdit.isUpdate();
        }

        regenerateForm() {
            this.RestaurantEdit.regenerateForm();
        }

        editarPublicacion(event,card) {
            this.RestaurantEdit.editarPublicacion(event,card);
        }

        getMedia(event,type) {
            this.RestaurantEdit.getMedia(event,type);
        }

        isChangeFiles() {
            return this.RestaurantEdit.isChangeFiles;
        }

        isShowNewCrop() {
            return this.RestaurantEdit.isShowNewCrop();
        }
        showNewCropAction(event) {
            this.RestaurantEdit.showNewCropAction(event);
        }
        hideNewCropAction(event) {
            this.RestaurantEdit.hideNewCropAction(event);
        }        

    }

}
