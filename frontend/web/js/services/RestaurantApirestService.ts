/// <reference path="EntityApirestService.ts" />

module ILovePlatos{    

    export class RestaurantApirestService extends EntityApirestService{

        type = 'restaurantes';

        constructor($config,$http,$q,$log,auth) {
            super($config,$http,$q,$log,auth);
        }

        getPortadas(category:string): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            var url = this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/portadas";
            if(category) {
                url = this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/portadas?filter[categorias]="+category;
            }

            this.$http.get(url, {params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getNoticiasPrincipales(category:string): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            var url = this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/noticias-principales";
            if(category) {
                url = this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/noticias-principales?filter[categorias]="+category;
            }

            this.$http.get(url, {params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getByUserId(entityId:string|number): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/publicados?filter[usuarios]="+entityId, {params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getByTag(tagId:string,queryString?): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = {};
            params = $.extend({}, queryString, this.getParamsUser());

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"?filter[tags]="+tagId, {params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getByHashtag(hastagId:string): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = {};

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"?filter[hashtags]="+hastagId)
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getRelacionadosByContenidoId(contenidoId:string,numPage:string|number): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/"+contenidoId+"/relacionado", {params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getmetasBySlug(slug:string): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/metas/"+slug, {params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        search(search:string|number): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/search?filter[query]="+search)
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getPaginasVistas(): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = {};

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/paginasvistas")
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        sendPaginaVista(entity: iEntityApirest,user?): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();

            this.$http({
                method: 'POST',
                url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/paginasvistas/create",
                data: entity,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });
                

            return d.promise;
        }

    }

}