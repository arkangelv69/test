/// <reference path="../../../../typings/jquery/jquery.d.ts" />

/// <reference path="../../data/DataJsonController.ts" />

module ILovePlatos{

    declare var preview:any;
    declare var tinymce:any;
    declare var Camera:any;
    declare var window:any;
    declare var navigator:any;

    export class MenuEdit{

        controller:MenuController;

        dataJson:any;

        constructor(controller) {
            this.controller = controller;
            this.dataJson = new DataJsonController('Menu',controller.auth);
        }

        initEdit() {
            var self = this;

            this.controller.FilesService.resetFiles();
            this.controller.FilesService.setController('menuCtrl');

        }

        syncPreviewCard() {
            
        }

        isSubmitActive(){
            var content = this.controller.content;
            if( 
                !content.attributes.name || 
                !content.attributes.price ||
                !content.attributes.drink ||
                !content.attributes.drinkDescription ||
                !content.attributes.desserts ||
                
                (( !content.attributes.daily || content.attributes.daily.length < 1) && (!content.attributes.scheduled || !content.attributes.scheduled.init))
                /*||
                this.controller.FilesService.fileElemImage.length < 1*/
            ){
                return false
            }
            return true;
        }

        submit(newPostForm,update?) {
            var self = this.controller;
            var _this = this;
            var content = this.controller.content;

            if(!this.controller._user.isLogged()) {
                this.progressCancel();
                return null;
            }

            if(!content.attributes.name) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que seleccionar un nombre para el menú'});

                this.progressCancel();
                return null;
            }

            if(!content.attributes.price) {
                self._main.resetMessages();
                self._main.setMessage({type:'danger',text:'Tienes que especificar un precio para el menú'});

                this.progressCancel();
                return null;
            }

            content.attributes.date = this.controller.DateService.getCurrentDateInUnix();

            //Prepara el data y lo envía.
            this.formEntity();

            return null;

        }

        formEntity() {

            var content = this.controller.content;
            var dataJson = this.dataJson;
            var attributes = content.attributes;

            dataJson.addAttributes(attributes);

            var user = this.controller._user.currentUser;
            var id = user.username;

            //Relationships del usuario que crea la publicación
            var paramsUsuario = {"admin":['David']};
            dataJson.addNewRelationships('relatedFrom',paramsUsuario);

            //Obtenemos la nueva entidad
            var newEntity = dataJson.getOutput();

            if(this.controller.isUpdate()) {
                var entity = jQuery.extend({},newEntity);
                entity.data.id = content.id;

                this.controller.update(entity);
            }else {
                this.controller.add(newEntity);
            }

        }

        advanceProgressbar() {
            this.progressbarPartial ++;
            this.progressbar = this.progressbarPartial  / this.progressbarTotal;
            if(this.progressbar == 1) {
                this.progressbarRes.resolve();
            }else {
                this.progressbarRes.notify(this.progressbar);
            }
        }

        progressbar = 0;
        progressbarPartial = 0;
        progressbarTotal = 1;
        progressbarRes:any;

        progressStart(newPostForm) {
            this.progressbarRes = this.controller.$q.defer();

            this.controller.submit(newPostForm);

            return this.progressbarRes.promise;
        }

        progressCancel() {
            this.progressbarRes.reject();
        }

        isUpdate() {
            if(this.controller.$state.current.name == 'editarpost') {
                return true;
            }else {
                return false;
            }
        }

        regenerateFormulario() {
            
        }

        editarPublicacion(event,card) {
            if(event) {
                event.preventDefault();
            }

            if(card.id) {
                var dataJson = new DataJsonController(this.controller.type,this.controller.auth);
                var attributes = {
                    id: card.id,
                    fecha:this.controller.DateService.getCurrentDateInUnix()
                };

                dataJson.addAttributes(attributes);

                var newEntity = dataJson.getOutput();
                //this.controller.delete(newEntity);
            }
        }

    }

}