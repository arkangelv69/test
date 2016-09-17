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
