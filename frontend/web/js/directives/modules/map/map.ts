/// <reference path="../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../../typings/angularjs/angular.d.ts" />

module ILovePlatos{

  export function MapDirective($compile,$http, $templateCache): ng.IDirective{
   return {
    restrict: 'E',
    replace: true,
    scope:true,
    controller:"MapController",
    controllerAs:"mapCtrl",
    link: function($scope, $element:ng.IAugmentedJQuery, $attributes,$controller: any[]) {

      var name = 'map';
      var nameTemplate = 'template';

      if($attributes.template) {
        nameTemplate = 'template.html';
      }

      var url = 'partials/modules/'+name+'/'+nameTemplate+'.html';

      $http.get(url, {cache: $templateCache}).success(function(tplContent) {
        $element.replaceWith($compile(tplContent)($scope)).promise().done(function(){});
      });

    }
  };

}

}