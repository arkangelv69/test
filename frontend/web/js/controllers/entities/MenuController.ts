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

             $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
              });

            $('input.restaurant-autocomplete').materialize_autocomplete({
                limit: 20,
                multiple: {
                    enable: true,
                },
                appender: {
                    el: '',
                    tagName: 'ul',
                    className: 'ac-appender',
                    tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %>(<%= item.id %>) <i class="material-icons close">close</i></div>'
                },
                dropdown: {
                    el: '',
                    tagName: 'ul',
                    className: 'collection',
                    itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                    noItem: ''
                },
                getData: function (value, callback) {
                    var data = [{
                        id: 0,
                        text: 'Abe',
                        image: 'http://lorempixel.com/200/200/food/1/'
                    },
                    {
                        id: 1,
                        text: 'Ari',
                        image: 'http://lorempixel.com/200/200/food/2/'
                    }];
                    callback(value, data);
                }
            });

            $('input.entrantes-autocomplete').materialize_autocomplete({
                limit: 20,
                multiple: {
                    enable: true,
                },
                appender: {
                    el: '',
                    tagName: 'ul',
                    className: 'ac-appender',
                    tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %>(<%= item.id %>) <i class="material-icons close">close</i></div>'
                },
                dropdown: {
                    el: '',
                    tagName: 'ul',
                    className: 'collection',
                    itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                    noItem: ''
                },
                getData: function (value, callback) {
                    var data = [{
                        id: 0,
                        text: 'Abe',
                        image: 'http://lorempixel.com/200/200/food/1/'
                    },
                    {
                        id: 1,
                        text: 'Ari',
                        image: 'http://lorempixel.com/200/200/food/2/'
                    }];
                    callback(value, data);
                }
            });

            $('input.primeros-autocomplete').materialize_autocomplete({
                limit: 20,
                multiple: {
                    enable: true,
                },
                appender: {
                    el: '',
                    tagName: 'ul',
                    className: 'ac-appender',
                    tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %>(<%= item.id %>) <i class="material-icons close">close</i></div>'
                },
                dropdown: {
                    el: '',
                    tagName: 'ul',
                    className: 'collection',
                    itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                    noItem: ''
                },
                getData: function (value, callback) {
                    var data = [{
                        id: 0,
                        text: 'Abe',
                        image: 'http://lorempixel.com/200/200/food/1/'
                    },
                    {
                        id: 1,
                        text: 'Ari',
                        image: 'http://lorempixel.com/200/200/food/2/'
                    }];
                    callback(value, data);
                }
            });

            $('input.segundos-autocomplete').materialize_autocomplete({
                limit: 20,
                multiple: {
                    enable: true,
                },
                appender: {
                    el: '',
                    tagName: 'ul',
                    className: 'ac-appender',
                    tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %>(<%= item.id %>) <i class="material-icons close">close</i></div>'
                },
                dropdown: {
                    el: '',
                    tagName: 'ul',
                    className: 'collection',
                    itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                    noItem: ''
                },
                getData: function (value, callback) {
                    var data = [{
                        id: 0,
                        text: 'Abe',
                        image: 'http://lorempixel.com/200/200/food/1/'
                    },
                    {
                        id: 1,
                        text: 'Ari',
                        image: 'http://lorempixel.com/200/200/food/2/'
                    }];
                    callback(value, data);
                }
            });

            $('input.postres-autocomplete').materialize_autocomplete({
                limit: 20,
                multiple: {
                    enable: true,
                },
                appender: {
                    el: '',
                    tagName: 'ul',
                    className: 'ac-appender',
                    tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %>(<%= item.id %>) <i class="material-icons close">close</i></div>'
                },
                dropdown: {
                    el: '',
                    tagName: 'ul',
                    className: 'collection',
                    itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                    noItem: ''
                },
                getData: function (value, callback) {
                    var data = [{
                        id: 0,
                        text: 'Abe',
                        image: 'http://lorempixel.com/200/200/food/1/'
                    },
                    {
                        id: 1,
                        text: 'Ari',
                        image: 'http://lorempixel.com/200/200/food/2/'
                    }];
                    callback(value, data);
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
