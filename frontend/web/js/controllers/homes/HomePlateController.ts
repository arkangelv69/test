module ILovePlatos{

    export class HomePlateController {
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
            this._main.resetMessages();
            this._main.setTitle('Buhos');
            this._main.setId('card');
            this._main.setPrevious('home');
            this._main.setMenuId('default');
            
            this._main.hideLogin();

            setTimeout(function()  {
                self.setWayPoing();
            },50);

        }

        setWayPoing() {
            $('.card').waypoint(function(direction) {
                if(direction == 'up') {
                    angular.element('body').addClass("card-up");
                    angular.element('body').removeClass("card-down");
                    angular.element(".card-image-shadow").height(0);
                    setTimeout(function(){
                        angular.element('body').removeClass("card-up");
                    },1500);
                }else {
                    angular.element('body').addClass("card-down");
                    var height = angular.element('.card-image').height();
                    angular.element(".card-image-shadow").height(height);
                }
            }, {
              offset: -100
            });
        }

    }

}
