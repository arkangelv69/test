/// <reference path="EntityController.ts" />
/// <reference path="Contenido/ContenidoCard.ts" />

module ILovePlatos{

    declare var google:any;

    export class CardController extends EntityController{
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

        ContenidoCard:ContenidoCard;
        content:any;

        constructor($config,api,DateService,$rootScope,public $stateParams,public $scope,public $state,$element,$sce,auth,store,public FilesService, public $q,public $filter){
            super($config,api,DateService,$rootScope,$stateParams,$scope,$state,$element,$sce,auth,store);

            this.ContenidoCard = new ContenidoCard(this);

        }

        getCardById(cardId?,data?) {
            var self = this;
            if( typeof(cardId) == 'undefined' && this.$stateParams.id ) {
                cardId = this.$stateParams.id.replace("r_","");
            }
            if( typeof(data) == 'undefined') {
                data = {}
            }
            this.api.getByCardId(cardId,data).then(function(content) {
                self.content = content.data;
            });
        }

        getName(card) {
            return this.ContenidoCard.getName(card);
        }

        getDescription(card) {
            return this.ContenidoCard.getDescription(card);
        }

        getPrice(card) {
            return this.ContenidoCard.getPrice(card);
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

        getMenus() {
            var menus = []; 
            angular.forEach(this.content.relationships.menus,function(menu) {
                menus.push(menu.data);
            });
            return menus;
        }

        haveMenuStarters(menu) {
            if(menu.relationships.relatedTo.have_plate.starters.length > 0) {
                return true;
            }
            return false;
        }

        haveMenuFirts(menu) {
            if(menu.relationships.relatedTo.have_plate.firsts.length > 0) {
                return true;
            }
            return false;
        }

        haveMenuSeconds(menu) {
            if(menu.relationships.relatedTo.have_plate.seconds.length > 0) {
                return true;
            }
            return false;
        }

        haveMenuDesserts(menu) {
            if(menu.relationships.relatedTo.have_plate.desserts.length > 0) {
                return true;
            }
            return false;
        }

        getMenuStarters(menu) {
            var desserts = [];
            if(this.haveMenuStarters(menu)) {
                desserts = menu.relationships.relatedTo.have_plate.starters;
            }
            return desserts;
        }

        getMenuFirts(menu) {
            var desserts = [];
            if(this.haveMenuFirts(menu)) {
                desserts = menu.relationships.relatedTo.have_plate.firsts;
            }
            return desserts;
        }

        getMenuSeconds(menu) {
            var desserts = [];
            if(this.haveMenuSeconds(menu)) {
                desserts = menu.relationships.relatedTo.have_plate.seconds;
            }
            return desserts;
        }

        getMenuDesserts(menu) {
            var desserts = [];
            if(this.haveMenuDesserts(menu)) {
                desserts = menu.relationships.relatedTo.have_plate.desserts;
            }
            return desserts;
        }

        init() {
            $(".button-collapse").sideNav();
            $(window).scroll(function(event) {

            });
        }

        initCarrousel(selector) {
            setTimeout(function(){
                $(selector).carousel({full_width: true});
            },0);
        }

        initAccordion(selector) {
            setTimeout(function(){
                $(selector).collapsible({
                  accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                });
            },0);
        }

    }

}