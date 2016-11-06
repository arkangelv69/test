/// <reference path="../../../../typings/jquery/jquery.d.ts" />

/// <reference path="../../data/DataJsonController.ts" />

module ILovePlatos{

    declare var preview:any;
    declare var tinymce:any;
    declare var Camera:any;
    declare var window:any;
    declare var navigator:any;
    declare var Materialize:any;

    export class MenuEdit{

        controller:MenuController;

        dataJson:any;
        autocompleteRestaurant:any;
        autocompleteStarters;
        autocompleteFirsts;
        autocompleteSeconds;
        autocompleteDesserts;

        pickadateInit;
        pickadateEnd;

        constructor(controller) {

            var self = this;
            this.controller = controller;
            this.dataJson = new DataJsonController('Menu',controller.auth);

            if(this.controller.$state.current.name == 'menu-create') {
                this.initEdit();
            }            

        }

        initEdit() {
            var self = this;
            var content = this.controller.content;

            this.controller.FilesService.resetFiles();
            this.controller.FilesService.setController('menuCtrl');

            this.pickadateInit = $('#init').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                onSet: function(dateSet) {
                    self.controller.content.attributes.scheduled.init = dateSet.select;
                }
              });

            if( this.controller.content.attributes.scheduled.init ) {
                var pickadateInit = this.pickadateInit.pickadate('picker');
                pickadateInit.set('select', this.controller.content.attributes.scheduled.init );
            }

            this.pickadateEnd = $('#end').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                onSet: function(dateSet) {
                    self.controller.content.attributes.scheduled.end = dateSet.select;
                }
              });

            if( this.controller.content.attributes.scheduled.end ) {
                var pickadateEnd = this.pickadateEnd.pickadate('picker');
                pickadateEnd.set('select', this.controller.content.attributes.scheduled.end );
            }

            var self = this;
            var userId = this.controller._user.userNeo4j;

            //Para los restaurantes
            this.controller.RestaurantApi.getAllByUserId(userId).then(function(response) {
                var data = [];
                angular.forEach(response,function(restaurant,index) {
                    data.push({
                        id:restaurant.data.id,
                        text:restaurant.data.attributes.name,
                        image:restaurant.data.attributes.images.thumbnails.square.url
                    });
                });


                self.autocompleteRestaurant = $('input.restaurant-autocomplete').materialize_autocomplete({
                    limit: 20,
                    multiple: {
                        enable: true,
                    },
                    appender: {
                        el: '',
                        tagName: 'ul',
                        className: 'ac-appender',
                        tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %> <i class="material-icons close">close</i></div>'
                    },
                    dropdown: {
                        el: '',
                        tagName: 'ul',
                        className: 'collection',
                        itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                        noItem: ''
                    },
                    getData: function (value, callback) {
                        var dataSet = self.controller.$filter('filter')(data, value);
                        callback(value, dataSet);
                    }
                });

                if(data.length <= 1) {
                    self.autocompleteRestaurant.setValue(data[0]);
                    angular.element('[for=restaurant-input]').addClass('active');
                }
                else if(content.relationships.relatedFrom.have_menu.length > 0){
                    angular.forEach(content.relationships.relatedFrom.have_menu,function(restaurant,key) {
                        angular.forEach(data,function(item,index) {
                            if(item.id == restaurant.data.id) {
                                self.autocompleteRestaurant.setValue(data[index]);
                            }
                        });
                    });
                    angular.element('[for=starters-input]').addClass('active');
                }

            });

            //Para los platos
            this.controller.PlateApi.getAllByUserId(userId).then(function(response) {
                var data = [];
                angular.forEach(response,function(plate,index) {
                    data.push({
                        id:plate.data.id,
                        text:plate.data.attributes.name,
                        image:plate.data.attributes.images.thumbnails.square.url
                    });
                });

                if(data.length > 0) {

                    self.autocompleteStarters = $('input.starters-autocomplete').materialize_autocomplete({
                        limit: 20,
                        multiple: {
                            enable: true,
                        },
                        appender: {
                            el: '',
                            tagName: 'ul',
                            className: 'ac-appender',
                            tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %> <i class="material-icons close">close</i></div>'
                        },
                        dropdown: {
                            el: '',
                            tagName: 'ul',
                            className: 'collection',
                            itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                            noItem: ''
                        },
                        getData: function (value, callback) {
                            var dataSet = self.controller.$filter('filter')(data, value);
                            callback(value, dataSet);
                        }
                    });

                    if(content.relationships.relatedTo.have_plate.starters.length > 0){
                        angular.forEach(content.relationships.relatedTo.have_plate.starters,function(starter,key) {
                            angular.forEach(data,function(item,index) {
                                if(item.id == starter.data.id) {
                                    self.autocompleteStarters.setValue(data[index]);
                                }
                            });
                        });
                        angular.element('[for=starters-input]').addClass('active');
                    }

                    self.autocompleteFirsts = $('input.firsts-autocomplete').materialize_autocomplete({
                        limit: 20,
                        multiple: {
                            enable: true,
                        },
                        appender: {
                            el: '',
                            tagName: 'ul',
                            className: 'ac-appender',
                            tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %> <i class="material-icons close">close</i></div>'
                        },
                        dropdown: {
                            el: '',
                            tagName: 'ul',
                            className: 'collection',
                            itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                            noItem: ''
                        },
                        getData: function (value, callback) {
                            var dataSet = self.controller.$filter('filter')(data, value);
                            callback(value, dataSet);
                        }
                    });

                    if(content.relationships.relatedTo.have_plate.firsts.length > 0){
                        angular.forEach(content.relationships.relatedTo.have_plate.firsts,function(first,key) {
                            angular.forEach(data,function(item,index) {
                                if(item.id == first.data.id) {
                                    self.autocompleteFirsts.setValue(data[index]);
                                }
                            });
                        });
                        angular.element('[for=firsts-input]').addClass('active');
                    }

                    self.autocompleteSeconds = $('input.seconds-autocomplete').materialize_autocomplete({
                        limit: 20,
                        multiple: {
                            enable: true,
                        },
                        appender: {
                            el: '',
                            tagName: 'ul',
                            className: 'ac-appender',
                            tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %> <i class="material-icons close">close</i></div>'
                        },
                        dropdown: {
                            el: '',
                            tagName: 'ul',
                            className: 'collection',
                            itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                            noItem: ''
                        },
                        getData: function (value, callback) {
                            var dataSet = self.controller.$filter('filter')(data, value);
                            callback(value, dataSet);
                        }
                    });

                    if(content.relationships.relatedTo.have_plate.seconds.length > 0){
                        angular.forEach(content.relationships.relatedTo.have_plate.seconds,function(second,key) {
                            angular.forEach(data,function(item,index) {
                                if(item.id == second.data.id) {
                                    self.autocompleteSeconds.setValue(data[index]);
                                }
                            });
                        });
                        angular.element('[for=seconds-input]').addClass('active');
                    }

                    self.autocompleteDesserts = $('input.desserts-autocomplete').materialize_autocomplete({
                        limit: 20,
                        multiple: {
                            enable: true,
                        },
                        appender: {
                            el: '',
                            tagName: 'ul',
                            className: 'ac-appender',
                            tagTemplate: '<div class="chip" data-id="<%= item.id %>" data-text="<% item.text %>" data-image="<% item.image %>"><img src="<%= item.image %>" /><span> <%= item.text %> <i class="material-icons close">close</i></div>'
                        },
                        dropdown: {
                            el: '',
                            tagName: 'ul',
                            className: 'collection',
                            itemTemplate: '<li class="collection-item avatar" data-id="<%= item.id %>" data-text="<%= item.text %>" data-image="<%= item.image %>"><a href="javascript:void(0)"><img class="square" src="<%= item.image %>" /><span><%= item.text %></span></a></li>',
                            noItem: ''
                        },
                        getData: function (value, callback) {
                            var dataSet = self.controller.$filter('filter')(data, value);
                            callback(value, dataSet);
                        }
                    });

                    if(content.relationships.relatedTo.have_plate.desserts.length > 0){
                        angular.forEach(content.relationships.relatedTo.have_plate.desserts,function(dessert,key) {
                            angular.forEach(data,function(item,index) {
                                if(item.id == dessert.data.id) {
                                    self.autocompleteDesserts.setValue(data[index]);
                                }
                            });
                        });
                        angular.element('[for=desserts-input]').addClass('active');
                    }

                }

            });

            if(content.attributes.daily != "") {
                var daily = content.attributes.daily.split(",");
                if(!content.attributes.dailyForm) {
                    content.attributes.dailyForm = {}
                }
                angular.forEach(daily,function(day) {
                    content.attributes.dailyForm[day] = true;
                });
            }

            setTimeout(function() {
                Materialize.updateTextFields();
            },200);

        }

        syncPreviewCard() {
            
        }

        isSubmitActive(){
            var content = this.controller.content;
            if( 
                !content.attributes.name || 
                !content.attributes.price ||
                !content.attributes.desserts
                //(( !content.attributes.daily || content.attributes.daily.length < 1) && (!content.attributes.scheduled || !content.attributes.scheduled.init))
                /*||
                this.controller.FilesService.fileElemImage.length < 1*/
            ){
                return false
            }
            return true;
        }

        submit(newPostForm,update?) {
            var self = this.controller;
            var _this = this;
            var content = this.controller.content;

            if(!_this.autocompleteRestaurant || !_this.autocompleteRestaurant.value || _this.autocompleteRestaurant.value.length < 1) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar un restaurante'});

                this.progressCancel();
                return null;
            }

            if(!this.controller._user.isLogged()) {
                this.progressCancel();
                return null;
            }

            if(!content.attributes.name) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar un nombre para el menú'});

                this.progressCancel();
                return null;
            }

            if(!content.attributes.price) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que especificar un precio para el menú'});

                this.progressCancel();
                return null;
            }

            content.attributes.date = this.controller.DateService.getCurrentDateInUnix();

            //Prepara el data y lo envía.
            this.formEntity();

            return null;

        }

        formEntity() {

            var content = this.controller.content;
            var dataJson = this.dataJson;
            var attributes = content.attributes;
            var daily = [];

            angular.forEach(attributes.dailyForm,function(value,day) {
                daily.push(day);
            });

            attributes.daily = daily.toString();

            dataJson.addAttributes(attributes);

            var user = this.controller._user.currentUser;
            var id = user.username;
            var idNeo4j = this.controller._user.userNeo4j;

            //Relationships del usuario que crea la publicación
            var restaurants = this.autocompleteRestaurant.value;
            var idsRestaurants = [];
            angular.forEach(restaurants,function(restaurant) {
                idsRestaurants.push(restaurant.id);
            })
            var params = {
                "admin":[idNeo4j],
                "have_menu": idsRestaurants
            };

            dataJson.addNewRelationships('relatedFrom',params);

            var starters = this.autocompleteStarters.value;
            var idsStarters = [];
            angular.forEach(starters,function(starter) {
                idsStarters.push(starter.id);
            });
            var firsts = this.autocompleteFirsts.value;
            var idsFirsts = [];
            angular.forEach(firsts,function(first) {
                idsFirsts.push(first.id);
            });
            var seconds = this.autocompleteSeconds.value;
            var idsSeconds = [];
            angular.forEach(seconds,function(second) {
                idsSeconds.push(second.id);
            });
            var desserts = this.autocompleteDesserts.value;
            var idsDesserts = [];
            angular.forEach(desserts,function(dessert) {
                idsDesserts.push(dessert.id);
            });
            var paramsPlates = {
               "have_plate": {
                    "starters":idsStarters,
                    "firsts":idsFirsts,
                    "seconds":idsSeconds,
                    "desserts":idsDesserts
                }
            };

            dataJson.addNewRelationships('relatedTo',paramsPlates);            

            //Obtenemos la nueva entidad
            var newEntity = dataJson.getOutput();

            if(this.controller.isUpdate()) {
                var entity = jQuery.extend({},newEntity);
                entity.data.id = content.id;

                this.controller.update(entity);
            }else {
                this.controller.add(newEntity);
            }

        }

        advanceProgressbar() {
            this.progressbarPartial ++;
            this.progressbar = this.progressbarPartial  / this.progressbarTotal;
            if(this.progressbar == 1) {
                this.progressbarRes.resolve();
            }else {
                this.progressbarRes.notify(this.progressbar);
            }
        }

        progressbar = 0;
        progressbarPartial = 0;
        progressbarTotal = 1;
        progressbarRes:any;

        progressStart(newPostForm) {
            this.progressbarRes = this.controller.$q.defer();

            this.controller.submit(newPostForm);

            return this.progressbarRes.promise;
        }

        progressCancel() {
            this.progressbarRes.reject();
        }

        isUpdate() {
            if(this.controller.$state.current.name == 'menu-update') {
                return true;
            }else {
                return false;
            }
        }

        regenerateForm() {
            this.initEdit();
        }

        editarPublicacion(event,card) {
            if(event) {
                event.preventDefault();
            }

            if(card.id) {
                var dataJson = new DataJsonController(this.controller.type,this.controller.auth);
                var attributes = {
                    id: card.id,
                    fecha:this.controller.DateService.getCurrentDateInUnix()
                };

                dataJson.addAttributes(attributes);

                var newEntity = dataJson.getOutput();
                //this.controller.delete(newEntity);
            }
        }

    }

}