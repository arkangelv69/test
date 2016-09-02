
module ILovePlatos{

    	export interface iEntityApirest {
                        meta?: {
                            "total-pages": string;
                        };
                        data?: Array<iDataApirest>;
                        links?:{
                            self:string;
                        first:string;
                        prev:string;
                        next:string;
                        last:string
                        }
                        error?:any;
            }
            export interface iEntitySingleApirest {
            	meta?: {
            		"total-pages": string;
            	};
            	data?:iDataApirest;
            	links?:{
            	    self:string;
    		    first:string;
    		    prev:string;
    		    next:string;
    		    last:string
            	}
    	}

            export interface iContenidoApirest extends iEntityApirest {
    	}

    	export interface iCategoriaApirest  extends iEntityApirest{
    	}

    	export interface iComentarioApirest  extends iEntityApirest{
    	}

            export interface iPerfilApirest  extends iEntityApirest{
            }

    	export interface iEntityModel {
	            contents: Array<any>;
                        total:number;
                        currentState: iContenidoApirest;
                        nextState: iContenidoApirest;
                        terminadas: iContenidoApirest;
                        getAll (): ng.IPromise<iContenidoApirest>;
    	}

    	export interface iContenidoModel extends iEntityModel{
                  getByCategoria (categoriaId:string): ng.IPromise<iContenidoApirest>;
	      getSrcMiniaturasOriginal (card:iDataApirest): string;
    	}

    	export interface iComentarioModel  extends iEntityModel{
    	}

    	export interface iCategoriaModel  extends iEntityModel{
            }

            export interface iCalificacionModel  extends iEntityModel{
    	}

            export interface iPerfilModel  extends iEntityModel{
            }
            
            export interface iListaDeLecturaModel  extends iEntityModel{
    	}

    	export interface iEntityApirestService{
                getAll(numPage:string|number): ng.IPromise<iEntityApirest>;
                getById(categoriaId:string): ng.IPromise<iEntityApirest>;
                getByLink(string): ng.IPromise<iEntityApirest>;
                getByCategoria(categoriaId:string,numPage:string|number): ng.IPromise<iContenidoApirest>;
                add(iEntityApirest): ng.IPromise<iEntityApirest>;
                delete(string): ng.IPromise<boolean>;
                modify(iEntityApirest): ng.IPromise<iEntityApirest>;
                get(string): ng.IPromise<iEntityApirest>;
            }
}