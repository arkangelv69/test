/// <reference path="EntityApirestService.ts" />

module ILovePlatos{    

    export class RestaurantApirestService extends EntityApirestService{

        type = 'restaurant';

        constructor($config,$http,$q,$log,auth) {
            super($config,$http,$q,$log,auth);
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

    }

}