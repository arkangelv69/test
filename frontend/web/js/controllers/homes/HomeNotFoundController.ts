/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../models/mainModel.ts" />
/// <reference path="../../models/entityModel.ts" />

module Buho{

    export class HomeNotFoundController {
        static $inject = [
            "config",
            "$rootScope",
            "$controller",
            "$stateParams",
            "$scope",
            "$state",
            "$translate"
        ];
        
        _main:IMainScope;

        constructor($config:any,
        $rootScope: IBuhoRootScopeService,$controller:any,$stateParams:any,$scope:ng.IScope,private $state,$translate:any){
            this._main = $rootScope.$$childHead.mainCtrl;
            this._main.resetMessages();
            this._main.setTitle('Contenido no encontrado');
            this._main.setId('notfound');
            this._main.setPrevious('home');
            this._main.setMenuId('default');
            this._main.hideLogin();
            jQuery(".overlayer").addClass("hidden");

            var keywords =  'notfound';
            var titular = 'Not Found';
            var name = $config.name;

            this._main.setOmniture({
                seccion:'notfound',
                subseccion1:'',
                subseccion2:'',
                subseccion3:'',
                subseccion4:'',
                titular:titular,
                id:'notfound',
                tags:keywords,
                multimedia:'foto',
                tipo:'notfound',
                autor:name
            });
            this._main.sendOmniture();
            this._main.sendGoogleAnalytics();

            this._main.setChartBeat({
                sections:'notfound',
                authors:name
            });
            this._main.initChartBeat();
        }

    }

}
