/// <reference path="../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../../typings/angularjs/angular.d.ts" />

module ILovePlatos{

  export function FileImageDirective($compile,$http, $templateCache): ng.IDirective{
   return {
    restrict: 'E',
    replace: true,
    scope:true,
    link: function($scope:IFileImageScope, $element:ng.IAugmentedJQuery, $attributes:IFileImageAttributes,$controller: any[]) {

      var template = '';
      if($attributes.template) {
        template = $attributes.template;
      }

      var name = 'fileimage';
      var url = 'partials/modules/'+name+'/template-'+template+'.html';

      $http.get(url, {cache: $templateCache}).success(function(tplContent) {
        $element.replaceWith($compile(tplContent)($scope)).promise().done(function(){
        });
      });

    }
  };

}

}