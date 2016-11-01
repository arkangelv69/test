module ILovePlatos{

    declare var cordova:any;

    export class ContenidoCard{

        controller:RestaurantController;

        constructor(controller) {
            this.controller = controller;
        }

        getUrlContenido(card:iDataApirest) {
            var url = '';
            var categoria = 'contenido';
            if(!card) {
                return '';
            }
            if( card.relationships && card.relationships.categorias && card.relationships.categorias.data && card.relationships.categorias.data && card.relationships.categorias.data[0] && card.relationships.categorias.data[0].id) {
                categoria = card.relationships.categorias.data[0].id
            }


            if(card && card.attributes && card.attributes.urlDestino) {
                url = card.attributes.urlDestino;
            }
            else if(card && card.attributes && card.attributes.id && card.attributes.numeroDeReposts != "0") {
                url = this.controller.$state.href('contenido',{categoria:categoria,slug:card.attributes.slug,id:card.attributes.id});
            }
            else if(card && card.id && card.attributes && card.attributes.slug) {
                url = this.controller.$state.href('contenido',{categoria:categoria,slug:card.attributes.slug,id:card.id});
            }
            else if(card && card.id) {
                url = this.controller.$state.href('contenido',{categoria:categoria,id:card.id});
            }
            return url;
        }

        getImageOriginal(card) {
            var original = {};
            if(card && card.attributes && card.attributes.images && card.attributes.images.original) {
                original = card.attributes.images.original;
            }
            return original;
        }

        getUrlImgOriginal(card) {
            var url = "";
            if(card && card.attributes && card.attributes.images && card.attributes.images.original) {
                url = card.attributes.images.original.url;
            }
            return url;
        }

        getUrlImgMain(card) {
            var url = "";
            if(card && card.attributes && card.attributes.images && card.attributes.images.thumbnails && card.attributes.images.thumbnails.main) {
                url = card.attributes.images.thumbnails.main.url;
            }
            return url;
        }

        getUrlImgSquare(card) {
            var url = "";
            if(card && card.attributes && card.attributes.images && card.attributes.images.thumbnails && card.attributes.images.thumbnails.square) {
                url = card.attributes.images.thumbnails.square.url;
            }
            return url;
        }

        getUrlImgLandscape(card) {
            var url = "";
            if(card && card.attributes && card.attributes.images && card.attributes.images.thumbnails && card.attributes.images.thumbnails.landscape) {
                url = card.attributes.images.thumbnails.landscape.url;
            }
            return url;
        }

        getName(card) {
            if(card && card.attributes && card.attributes.name) {
                return card.attributes.name;
            }
            return '';
        }

    }

}