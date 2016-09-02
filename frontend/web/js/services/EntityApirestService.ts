/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../models/mainModel.ts" />
/// <reference path="../models/entityModel.ts" />

module ILovePlatos{

    export class EntityApirestService {
        static $inject = [
            "config",
            "$http",
            "$q",
            "$log",
            "auth"
        ];

        type = 'entities';

        constructor(
            protected $config: any,
            protected $http: ng.IHttpService,
            protected $q: ng.IQService,
            protected $log: ng.ILogService,
            protected auth
        )
        {
            
        }

        getTypeAccess() {
            if(this.auth.profile) {
                return 'private';
            }else {
                return 'public';
            }
        }

        getParamsUser() {
            var params = {};
            return params;
        }

        getAll(queryString): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = {};
            params = $.extend({}, queryString, this.getParamsUser());

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type,{params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getByCategoria(categoriaId:string,queryString?): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = {};
            params = $.extend({}, queryString, this.getParamsUser());

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"?filter[categorias]="+categoriaId, {params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getById(entityId:string|number): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/"+entityId, {params:params})
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

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type, {params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getByLink(link:string): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();            

            this.$http.get(link,{params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        //@deprecated
        get(id:string): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();

            return this.getAll('all')
                .then((contents: iEntityApirest) => {
                    return contents.data.filter((t) => t.id == id)[0];
                });

            return d.promise;
        }

        add(entity: iEntityApirest,user?): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();

            this.$http({
                method: 'POST',
                url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/create",
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

        delete(entity: iEntityApirest,user?): ng.IPromise<boolean>{
            var d = this.$q.defer();

            this.$http({
                method: 'POST',
                url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/delete",
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

        update(entity: iEntityApirest,user?): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();

            this.$http({
                method: 'POST',
                url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/update",
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