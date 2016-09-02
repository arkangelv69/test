/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/angularjs/angular.d.ts" />

module ILovePlatos{

  var setScrollTime:NodeJS.Timer;

  export function Scroll(): ng.IDirective{
        return{
          link: function($scope:ng.IScope, $element:ng.IAugmentedJQuery, $attributes:IScrollAttributes,$controller: any[]){

            var wrapperScroll = document;
            var scrollWallSelector = $attributes.scrollWallSelector;

            var position = 0;
            if($attributes.scroll && $attributes.scroll != 'document') {
              wrapperScroll = $attributes.scroll;
            }

            angular.element(wrapperScroll).data('scrollTarget',$element);
            angular.element(wrapperScroll).on('scroll', function(event) {

                  var vy = $(document).scrollTop() + $(window).height();
                  var widthW = $(window).width();


                  if (widthW > 800 && vy > $('#home .destacado, #homeContenidoByCategoria .destacado').eq(0).height()) {
                    $('#home .destacado, #homeContenidoByCategoria .destacado').css({position: 'fixed', bottom: 0});
                  } else if(widthW > 800){
                    $('#home .destacado, #homeContenidoByCategoria .destacado').css({position: 'relative'});
                  }

                  var elementBody = angular.element(this);
                  var econtroller = elementBody.data('scrollTarget');
                  var scontroller:EntityController = angular.element(econtroller).controller();

                  clearTimeout(setScrollTime);
                  setScrollTime = setTimeout(function(){
                    if(scontroller) {
                      scontroller.setScrollTop();
                    }
                  },500);

                  if(scontroller && scontroller.refreshRenderPageWithNextContent) {
                    if(angular.element(this)[0] && angular.element(this)[0].nodeName == '#document') {
                      if( $(window).scrollTop() !== 0 &&  (  ($(window).scrollTop() + $(window).height())/$(document).height() > 0.7) ) {
                            position = $(document).scrollTop();
                            scontroller.addElementToContent();
                      }
                    }else {
                      if( $(this).scrollTop() !== 0  && ( $(this).scrollTop()/$(this).height() > 0.7 ) ) {
                            position = $(this).scrollTop();
                            scontroller.addElementToContent();
                      }
                    }
                    position = $(this).scrollTop();
                  }
            });
          }
        };
    }

}
