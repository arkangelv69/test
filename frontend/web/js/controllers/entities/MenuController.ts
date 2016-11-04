/// <reference path="EntityController.ts" />
/// <reference path="Contenido/ContenidoCard.ts" />
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
            "$q",
            "RestaurantApirestService",
            "PlateApirestService"
        ];

        mother;

        ContenidoCard:ContenidoCard;
        MenuEdit:MenuEdit;
        
        content = {
                id:"",
                type:"Menu",
                attributes:{
                    name: "",
                    price: 0,
                    drink: 0,
                    drinkDescription: 0,
                    desserts: 0,
                    daily: {},
                    scheduled: {
                        init: 0,
                        end: 0,
                    },
                    date:0
                },
                relationships: {
                    relatedTo: {
                        have_plate:[]
                    },
                    miniaturas:{
                        data:[]
                    }
                }
            };

        constructor($config,api,DateService,$rootScope,public $stateParams,public $scope,public $state,$element,$sce,auth,store,public FilesService, public $q,public RestaurantApi,public PlateApi){
            super($config,api,DateService,$rootScope,$stateParams,$scope,$state,$element,$sce,auth,store);

            var self = this;

            this.ContenidoCard = new ContenidoCard(this);
            this.MenuEdit = new MenuEdit(this);

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
