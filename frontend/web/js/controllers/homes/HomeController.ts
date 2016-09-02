/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../models/mainModel.ts" />
/// <reference path="../../models/entityModel.ts" />

module ILovePlatos{

    export class HomeController {
        static $inject = [
            "config",
            "$rootScope",
            "$controller",
            "$stateParams",
            "$scope",
            "$state",
            "$translate",
            "ngMeta"
        ];
        
        _main:IMainScope;

        constructor($config:any,
        $rootScope: IBuhoRootScopeService,$controller:any,$stateParams:any,$scope:ng.IScope,private $state,$translate:any,ngMeta){

            var self = this;
            
            this._main = $rootScope.$$childHead.mainCtrl;
            this._main.setCache('home');
            this._main.setCache('home.inicio');
            this._main.resetMessages();
            this._main.setTitle('Buhos');
            this._main.setId('home');
            this._main.setPrevious('home');
            this._main.setMenuId('default');
            
            this._main.hideLogin();

            var keywords =  '';
            if($rootScope.ngMeta && $rootScope.ngMeta.keywords) {
                keywords = $rootScope.ngMeta.keywords;
            }

            var titular = 'buho';
            if($rootScope.ngMeta && $rootScope.ngMeta.title) {
                titular = $rootScope.ngMeta.title;
            }            

            this._main.setOmniture({
                seccion:'home',
                subseccion1:'',
                subseccion2:'',
                subseccion3:'',
                subseccion4:'',
                titular:titular,
                id:'home',
                tags:keywords,
                multimedia:'foto',
                tipo:'home',                
                autor:'buho'
            });
            this._main.sendOmniture();
            this._main.sendGoogleAnalytics();

            this._main.setChartBeat({
                sections:'home',
                authors:'buho'
            });
            this._main.initChartBeat();

            setTimeout(function()  {
                self.setWayPoing();
            },50);

        }

        setWayPoing() {
            $('#home header').waypoint(function(direction) {
                if(direction == 'up') {
                    angular.element('body').addClass("logo-up");
                    angular.element('body').removeClass("logo-down");
                    setTimeout(function(){
                        angular.element('body').removeClass("logo-up");
                    },1500);
                }else {
                    angular.element('body').addClass("logo-down");
                }
            }, {
              offset: -150
            });
        }

    }

}
