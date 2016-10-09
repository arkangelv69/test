/// <reference path="../../../typings/jquery/jquery.d.ts" />

module ILovePlatos{

    export class DataJsonController{

            id:string;
            type:string;
            guid:string;

            output = {
                "data": {
                    "id":"",
                    "type": "##type_contenido##",
                    "attributes": {
                    },
                    "relationships": {}
                }
            };
            
            titulo:string;
            subtitulo:string;
            seo_titulo:string;
            seo_og_titulo:string;
            fecha:string;
            relevancia:string;
            //entrada:string;
            slug:string;
            formato:string;
            seo_twitter_titulo:string;
            cuerpo:string;
            tipoDeModulo:string;
            mostrarImagenDentro: number;
            usarImagenDeFondo: number;
            _user:any;

            constructor(type,auth?){
                type = type || null;
                this.type = type;
                this.guid = this.generareGuid();
                
                this.output.data.id = this.guid;
                this.output.data.type = this.output.data.type.replace("##type_contenido##",this.type);

                //Obtenemos el usuario
                /*var user = auth.profile;
                if(user) {
                    var userId = user.user_id;
                    var sessionToken = auth.idToken;
                    this.addNewRelationships('usuarios',{"userId":userId,"sessionToken":sessionToken});
                }*/
            }

            setId(id) {
                this.guid = id;
                this.output.data.id = id;
            }

            /*@attributes {
                titulo:string;
                seo_titulo:string;
                seo_og_titulo:string;
                fecha:string;
                relevancia:string;
                entrada:string;
                slug:string;
                formato:string;
                seo_twitter_titulo:string;
                cuerpo:string;
            }
            */
            addAttributes(attributes) {
                if(!attributes) {
                    return null;
                }

                this.output.data.attributes = attributes;
            }

            /*{
                @type contenidos,categorias,comentarios,autores: Required
                @params 
                {
                    id: Required
                    nombre: Required
                }
            }*/
            addNewRelationships(type:string,params:Object) {
                var types = ['Restaurant','restaurant','relatedTo','relatedFrom'];
                if( jQuery.inArray(type,types) == -1 ) {
                    return null;
                }
                if(!params) {
                    return null;
                }

                this.output.data.relationships[type] = params;
            }

            getOutput() {
                return this.output;
            }

            generareGuid() {
              function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
              }
              return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
            }

    }

}