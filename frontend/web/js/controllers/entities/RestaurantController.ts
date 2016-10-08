/// <reference path="EntityController.ts" />
// <reference path="Contenido/ContenidoCard.ts" />
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
            "$q"
        ];

        mother;
        wall:any;
        preview:any;
        images = [];

        //ContenidoCard:ContenidoCard;
        RestaurantEdit:RestaurantEdit;
        
        dataAutocomplete:any;
        content = {
                id:"",
                type:"Restaurant",
                attributes:{
                    name: "",
                    address: {},
                    longitude: 0,
                    latitude: 0,
                    date:0,
                },
                relationships: {
                    miniaturas:{
                        data:[]
                    }
                }
            };

        constructor($config,svc,DateService,$rootScope,public $stateParams,public $scope,public $state,$element,$sce,auth,store,public FilesService, public $q){
            super($config,svc,DateService,$rootScope,$stateParams,$scope,$state,$element,$sce,auth,store);

            var self = this;

            //this.ContenidoCard = new ContenidoCard(this);
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

        initEdit() {
            this.RestaurantEdit.initEdit();
        }

        syncPreviewCard() {
            this.RestaurantEdit.syncPreviewCard();
        }

        isSubmitActive(){
            return this.RestaurantEdit.isSubmitActive();
        }

        submit(newPostForm,update?) {
            this.RestaurantEdit.submit(newPostForm,update);
        }

        formEntity() {
            this.RestaurantEdit.formEntity();
        }

        advanceProgressbar() {
            this.RestaurantEdit.advanceProgressbar();
        }

        progressStart(newPostForm) {
            return this.RestaurantEdit.progressStart(newPostForm);
        }

        progressCancel() {
            this.RestaurantEdit.progressCancel();
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

        cropperImage(target) {
            this.RestaurantEdit.cropperImage(target);
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

        regenerateFormulario() {
            this.RestaurantEdit.regenerateFormulario();
        }

        editarPublicacion(event,card) {
            this.RestaurantEdit.editarPublicacion(event,card);
        }

        getMedia(event,type) {
            this.RestaurantEdit.getMedia(event,type);
        }

        

    }

}
