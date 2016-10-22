/// <reference path="EntityController.ts" />
// <reference path="Contenido/ContenidoCard.ts" />
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
            "$q"
        ];

        mother;
        images = [];

        //ContenidoCard:ContenidoCard;
        PlateEdit:PlateEdit;
        
        dataAutocomplete:any;
        content = {
                id:"",
                type:"Plate",
                attributes:{
                    name: "",
                    description: "",
                    date:0
                },
                relationships: {
                    miniaturas:{
                        data:[]
                    }
                }
            };

        constructor($config,api,DateService,$rootScope,public $stateParams,public $scope,public $state,$element,$sce,auth,store,public FilesService, public $q){
            super($config,api,DateService,$rootScope,$stateParams,$scope,$state,$element,$sce,auth,store);

            var self = this;

            //this.ContenidoCard = new ContenidoCard(this);
            this.PlateEdit = new PlateEdit(this);

        }

        initEdit() {
            this.PlateEdit.initEdit();
        }

        syncPreviewCard() {
            this.PlateEdit.syncPreviewCard();
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

        regenerateFormulario() {
            this.PlateEdit.regenerateFormulario();
        }

        editarPublicacion(event,card) {
            this.PlateEdit.editarPublicacion(event,card);
        }

        getMedia(event,type) {
            this.PlateEdit.getMedia(event,type);
        }

        

    }

}
