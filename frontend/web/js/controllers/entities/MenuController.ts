/// <reference path="EntityController.ts" />
// <reference path="Contenido/ContenidoCard.ts" />
/// <reference path="Menu/MenuEdit.ts" />

module ILovePlatos{

    export class MenuController extends EntityController{

        static $inject = [
            "config",
            "MenuApirestService",
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
        MenuEdit:MenuEdit;
        
        dataAutocomplete:any;
        content = {
                id:"",
                type:"Menu",
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
            this.MenuEdit = new MenuEdit(this);

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
            this.MenuEdit.initEdit();
        }

        syncPreviewCard() {
            this.MenuEdit.syncPreviewCard();
        }

        isSubmitActive(){
            return this.MenuEdit.isSubmitActive();
        }

        submit(newPostForm,update?) {
            this.MenuEdit.submit(newPostForm,update);
        }

        formEntity() {
            this.MenuEdit.formEntity();
        }

        advanceProgressbar() {
            this.MenuEdit.advanceProgressbar();
        }

        progressStart(newPostForm) {
            return this.MenuEdit.progressStart(newPostForm);
        }

        progressCancel() {
            this.MenuEdit.progressCancel();
        }

        isUpdate() {
            return this.MenuEdit.isUpdate();
        }

        regenerateFormulario() {
            this.MenuEdit.regenerateFormulario();
        }

        editarPublicacion(event,card) {
            this.MenuEdit.editarPublicacion(event,card);
        }

    }

}
