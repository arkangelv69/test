/// <reference path="../../../typings/angularjs/angular.d.ts" />

module ILovePlatos{

    declare var google:any;

    export class MapController {
        static $inject = [
            "config",
        ];

        constructor(public $config) {
        }

        init() {
            $(".button-collapse").sideNav();
        }

        initCarrousel(selector) {
            setTimeout(function(){
                $(selector).carousel({full_width: true});
            },0);
        }

        initAccordion(selector) {
            setTimeout(function(){
                $(selector).collapsible({
                  accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
                });
            },0);
        }

    }

}