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
            "auth",
            "store"
        ];

        type = 'entities';

        constructor(
            protected $config: any,
            protected $http: ng.IHttpService,
            protected $q: ng.IQService,
            protected $log: ng.ILogService,
            protected auth,
            protected store
        )
        {
            /*var token = store.get("token");
            $http.common['Authorization'] = "Bearer "+token;*/
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

        get(id:string): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();

            this.$http({
                method: 'GET',
                url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/"+id,
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

        add(entity: iEntityApirest,user?): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();

            this.$http({
                method: 'POST',
                url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type,
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
                method: 'DELETE',
                url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type,
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
                method: 'PUT',
                url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type,
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