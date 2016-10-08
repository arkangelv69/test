/// <reference path="EntityController.ts" />
// <reference path="Contenido/ContenidoCard.ts" />
/// <reference path="Contenido/ContenidoEdit.ts" />

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

        portadas = [];
        noticiasPrincipales = [];
        mother;
        wall:any;
        contenidoText:string;
        preview:any;
        images = [];
        tituloText:string;
        category:any;
        showTituloForm = false;
        showMediaFile = false;
        imagenDeFondo = 'transparent';

        //ContenidoCard:ContenidoCard;
        ContenidoEdit:ContenidoEdit;
        
        dataAutocomplete:any;
        content = {
                id:'',
                attributes:{
                    cuerpo:'',
                    titulo:'',
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

        constructor($config,svc,DateService,$rootScope,public $stateParams,public $scope,public $state,$element,$sce,auth,store,public FilesService, public $q){
            super($config,svc,DateService,$rootScope,$stateParams,$scope,$state,$element,$sce,auth,store);

            var self = this;

            //this.ContenidoCard = new ContenidoCard(this);
            this.ContenidoEdit = new ContenidoEdit(this);

            window.addEventListener('message', function(event) { 

                // IMPORTANT: Check the origin of the data! 
                if (event.data.lat && event.data.lng) { 
                    // The data has been sent from your site 

                    // The data sent with postMessage is stored in event.data 
                    self.dataAutocomplete = event.data;
                } else { 
                    // The data hasn't been sent from your site! 
                    // Be careful! Do not use it. 
                    return; 
                } 
            }); 

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

        selectFile(event,selector) {
            this.ContenidoEdit.selectFile(event,selector);
        }

        changeFiles(files) {
            this.ContenidoEdit.changeFiles(files);
        }

        hasImage() {
            return this.ContenidoEdit.hasImage();
        }

        addFiles(files) {
            this.ContenidoEdit.addFiles(files);   
        }

        deleteImage(event,index){
            this.ContenidoEdit.deleteImage(event,index);
        }

        renderRecorteCuadrado(event,target) {
            event.preventDefault();
            this.ContenidoEdit.renderRecorteCuadrado(target,'.canvasCropper-image');
        }

        renderRecorteApaisado(event,target) {
            event.preventDefault();
            this.ContenidoEdit.renderRecorteApaisado(target,'.canvasCropper-image');
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

        getMedia(event,type) {
            this.ContenidoEdit.getMedia(event,type);
        }

        

    }

}
