/// <reference path="EntityController.ts" />
/// <reference path="Contenido/ContenidoCard.ts" />
/// <reference path="Plate/PlateEdit.ts" />

module ILovePlatos{

    export class PlateController extends EntityController{

        static $inject = [
            "config",
            "PlateApirestService",
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
            "$filter",
            "RestaurantApirestService",
        ];

        mother;
        images = [];

        ContenidoCard:ContenidoCard;
        PlateEdit:PlateEdit;
        
        dataAutocomplete:any;
        content = {
                id:"",
                type:"Plate",
                attributes:{
                    name: "",
                    description: "",
                    date:0,
                    images:{
                        "type":'images',
                        "original": {
                            "url":""
                        },
                        "thumbnails": {
                            "square":{
                                "url":""
                            },
                            "landscape":{
                                "url":""
                            }
                        }
                    }
                },
                relationships: {
                    miniaturas:{
                        data:[]
                    }
                }
            };

        constructor($config,api,DateService,$rootScope,public $stateParams,public $scope,public $state,$element,$sce,auth,store,public FilesService, public $q,public $filter,public RestaurantApi){
            super($config,api,DateService,$rootScope,$stateParams,$scope,$state,$element,$sce,auth,store);

            var self = this;

            this.ContenidoCard = new ContenidoCard(this);
            this.PlateEdit = new PlateEdit(this);

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
            this.PlateEdit.initEdit();
        }

        isSubmitActive(){
            return this.PlateEdit.isSubmitActive();
        }

        submit(newPostForm,update?) {
            this.PlateEdit.submit(newPostForm,update);
        }

        formEntity() {
            this.PlateEdit.formEntity();
        }

        advanceProgressbar() {
            this.PlateEdit.advanceProgressbar();
        }

        progressStart(newPostForm) {
            return this.PlateEdit.progressStart(newPostForm);
        }

        progressCancel() {
            this.PlateEdit.progressCancel();
        }

        selectFile(event,selector) {
            this.PlateEdit.selectFile(event,selector);
        }

        changeFiles(files) {
            this.PlateEdit.changeFiles(files);
        }

        hasImage() {
            return this.PlateEdit.hasImage();
        }

        addFiles(files) {
            this.PlateEdit.addFiles(files);   
        }

        deleteImage(event,index){
            this.PlateEdit.deleteImage(event,index);
        }

        renderRecorteCuadrado(event,target) {
            event.preventDefault();
            this.PlateEdit.renderRecorteCuadrado(target,'.canvasCropper-image');
        }

        renderRecorteApaisado(event,target) {
            event.preventDefault();
            this.PlateEdit.renderRecorteApaisado(target,'.canvasCropper-image');
        }

        cropperImage(target) {
            this.PlateEdit.cropperImage(target);
        }

        croppImageCancel(event) {
            this.PlateEdit.croppImageCancel(event);
        }

        croppImage(event) {
            this.PlateEdit.croppImage(event);
        }

        rotateCropperImage(event,grades) {
            this.PlateEdit.rotateCropperImage(event,grades);
        }

        getCroppedCanvas(event) {
            return this.PlateEdit.getCroppedCanvas(event);
        }

        isUpdate() {
            return this.PlateEdit.isUpdate();
        }

        regenerateForm() {
            this.PlateEdit.regenerateForm();
        }

        editarPublicacion(event,card) {
            this.PlateEdit.editarPublicacion(event,card);
        }

        getMedia(event,type) {
            this.PlateEdit.getMedia(event,type);
        }

        isChangeFiles() {
            return this.PlateEdit.isChangeFiles;
        }

        isShowNewCrop() {
            return this.PlateEdit.isShowNewCrop();
        }
        showNewCropAction(event) {
            this.PlateEdit.showNewCropAction(event);
        }
        hideNewCropAction(event) {
            this.PlateEdit.hideNewCropAction(event);
        }
        

    }

}
