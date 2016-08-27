/// <reference path="../../../../typings/jquery/jquery.d.ts" />

module ILovePlatos{

    declare var preview:any;
    declare var tinymce:any;
    declare var cordova:any;
    declare var window:any;

    export class SystemMessages{

        controller:MainController;

        constructor(controller:MainController) {
            this.controller = controller;
        }

        resetMessages() {
            if(this.controller.$stateParams.reset == 'false') {
                return '';
            }
            this.controller.messages = [];
            if( !this.controller.$scope.$$phase  ) {
                this.controller.$scope.$apply();
            }
        }

        setMessage(message) {
            var html = '';
            if(this.controller.isCordovaApp()) {
                window.plugins.toast.showWithOptions(
                    {
                      message: message.text,
                      duration: 1500, // ms
                      position: "bottom",
                      addPixelsY: -80,  // (optional) added a negative value to move it up a bit (default 0)
                    });
                //this.controller.$cordovaToast.show(message.text, 'short', 'bottom');
            }else {
                if(message && message.type && message.text) {
                    html = '<p class="message alert alert-'+message.type+'" role="alert">\
                        <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> '+message.text+'<span class="close">Close</span></p>'
                    this.controller.messages.push(this.controller.$sce.trustAsHtml(html));
                }
                if( !this.controller.$scope.$$phase  ) {
                    this.controller.$scope.$apply();
                }
            }
        }

        closeMessage(event,index) {
            event.preventDefault();
            this.controller.messages.splice(index,1);
        }

        isAdviseVissibleByName(name) {
            var visibility = '';
            var isVisible = true;
            var key = name;

            if(this.controller._user.isLogged()) {
                var username = this.controller._user.username;
                key = username+'-'+name;
            }

            //Compruebo si se ha establezido un tiempo de expiración
            var time = this.controller.store.get(key+'-ttl');
            var d = new Date();
            var n = d.getTime();
            if(time && time < n) {
                this.controller.store.remove(key);
                this.controller.store.remove(key+'-ttl');
                return true;
            }
            
            visibility = this.controller.store.get(key);
            
            if(visibility == 'hidden') {
                isVisible = false;
            }
            return isVisible;
        }

        showAdvise(target,id) {
            var isAdviseVissible = this.isAdviseVissibleByName(id);
            if( isAdviseVissible ) {
                angular.element(target).removeClass('hide');
            }else {
                angular.element(target).addClass('hide');
            }

            return isAdviseVissible;
        }

        closeAdvise(name,ttl) {
            var key = name;
            if(this.controller._user.isLogged()) {
                var username = this.controller._user.username;
                key = username+'-'+name;
            }
            
            this.controller.store.set(key,'hidden');

            if(ttl) {
                var d = new Date();
                var n = d.getTime();
                var time = n+ttl;
                this.controller.store.set(key+'-ttl',time);
            }
        }

        setTTLAdvise(name,ttl) {
            var key = name;
            if(this.controller._user.isLogged()) {
                var username = this.controller._user.username;
                key = username+'-'+name;
            }
            
            this.controller.store.set(key,'hidden');

            if(ttl) {
                var d = new Date();
                var n = d.getTime();
                var time = n+ttl;
                this.controller.store.set(key+'-ttl',time);
            }
        }

    }

}