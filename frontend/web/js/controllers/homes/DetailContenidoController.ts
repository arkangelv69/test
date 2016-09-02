/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../models/mainModel.ts" />
/// <reference path="../../models/entityModel.ts" />
/// <reference path="../../services/DateService.ts" />

module ILovePlatos{

    export class DetailContenidoController {
        static $inject = [
            "config",
            "$rootScope",
            "$controller",
            "$stateParams",
            "$scope",
            "$state",
            "$translate",
            "$filter",
            "$window",
            "ContenidoApirestService",
            "DateService",
            "store"
        ];
        
        _main:IMainScope;
        _user:IUserScope;
        id:string;
        categoria:string;
        slug:string;
        nickname = 'adminBuho';
        template = '';

        constructor($config:any,
        $rootScope: IBuhoRootScopeService,$controller:any,$stateParams:any,$scope:ng.IScope,private $state,$translate:any,$filter,$window,private svc,private DateService,private store){

            this._main = $rootScope.$$childHead.mainCtrl;
            this._user = $rootScope.$$childHead.$$childHead.userCtrl;
            //var title = $filter('translate')($stateParams.id);
            this._main.resetMessages();
            if(this._main.prevState == "comentariosbycontenido") {
                this._main.setPrevious('home');
            }else {
                this._main.setPrevious('history');
            }
            
            this._main.setId('detalle-noticia');
            this._main.setMenuId('detail');
            this.id = $stateParams.id;
            this.categoria = $stateParams.categoria;
            this.slug = $stateParams.slug;
            this._main.hideLogin();
            jQuery(".overlayer").addClass("hidden");

            var self = this;
            this._main.intervalPaginaVista = setTimeout(function(){
                self.saveLocalPaginaVista();
                self.sendPaginaVista();
            },1000*20);

            //Mensaje emitido desde el controlador de contenidos
            $scope.$on('newDetailContent', function(event,contenido,nickname,action){

            });

        }

        getAutor(content) {
            if(content && content.relationships && content.relationships.usuarios && content.relationships.usuarios.data) {
                var autores = content.relationships.usuarios.data[0];
                if(content.relationships.usuarios.data.length > 1) {
                    autores = content.relationships.usuarios.data[0];
                }             
                return autores.id;
            }else {
                return 'buho';
            }
        }

        getSubcategoriasByContenido(content) {
            var subcategorias = [];
            if( content.relationships && content.relationships.subcategorias && content.relationships.subcategorias.data && content.relationships.subcategorias.data) {
                subcategorias = content.relationships.subcategorias.data;
            }
            return subcategorias;
        }

        sendPaginaVista() {

            var dataJson = new DataJsonController('contenidos_paginasvistas');
            var attributes = {
                fecha:0,
            };
            attributes.fecha = this.DateService.getCurrentDateInUnix();

            dataJson.addAttributes(attributes);

            var user = this._user;
            var username = user.username;

            if(user && user.username) {
                var paramsAutores = {"username":username};
                dataJson.addNewRelationships('autores',paramsAutores);

                var paramsContenidos = {"id":this.id,"categoria":this.categoria,"slug":this.slug};
                dataJson.addNewRelationships('contenidos',paramsContenidos);

                var newEntity = dataJson.getOutput();

                return this.svc.sendPaginaVista(newEntity)
                    .then((response) => {
                        if(!response) {
                            console.log('algo salio mal');
                        }
                    },(error) => {
                        console.log(error);
                    });
            }

        }

        saveLocalPaginaVista() {
            var id = this.id;
            var categoria  = this.categoria;
            var slug  = this.slug;

            var paginasVistas = this.store.get('paginas-vistas');

            if(!paginasVistas || !paginasVistas.data || paginasVistas.data.length < 1) {
                paginasVistas = {};
                paginasVistas.data = [];
            }

            paginasVistas.data = _.without(paginasVistas.data, _.findWhere(paginasVistas.data, {id: id}));

            paginasVistas.data.unshift({"id":id,"categoria":categoria,"slug":slug});

            this.store.set('paginas-vistas', paginasVistas);
        }

        setWayPoint() {

            $(document).scroll(function() {

                var salto = 0;
                if($(document).width() < 768) {

                    var waypoints = $('article .cnt-video');
                    waypoints.each(function(index){
                        var scrollTop     = $(window).scrollTop(),
                        elementOffset = $(this).offset().top,
                        distance      = (elementOffset - scrollTop);
                        //console.log('indice: '+index+' scroll:'+distance);
                        var outerHeight = angular.element(this).outerHeight();

                        if(distance < salto && !angular.element(this).hasClass('down')) {
                            angular.element(this).addClass("down");   
                            angular.element(this).siblings('.clear').css('height',outerHeight);
                            angular.element(this).siblings('.clear').addClass("down");
                        }

                    });

                    var waypoints = $('article .clear');
                    waypoints.each(function(index){
                        var scrollTop     = $(window).scrollTop(),
                        elementOffset = $(this).offset().top,
                        distance      = (elementOffset - scrollTop);
                        //console.log('indice: '+index+' scroll:'+distance);
                        var outerHeight = angular.element(this).outerHeight();

                        if(distance > salto && outerHeight > 0 && angular.element(this).siblings('.cnt-video').hasClass('down')) {
                            angular.element(this).siblings('.cnt-video').removeClass("down");
                            angular.element(this).removeAttr('style');
                            angular.element(this).removeClass('down');
                        }

                    });

                }

            });

        }

    }

}
