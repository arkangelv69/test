/// <reference path="EntityApirestService.ts" />

module ILovePlatos{    

    export class RestaurantApirestService extends EntityApirestService{

        type = 'restaurant';
        typeAll = 'restaurants';

        constructor($config,$http,$q,$log,auth,store) {
            super($config,$http,$q,$log,auth,store);
        }

        //public/restaurant/40.396761351388115/-3.489304971752527/0.3/44
        getAll(lat,lng,range,deviceId) {
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/public/"+this.type+"/"+lat+"/"+lng+"/"+range+"/"+deviceId, {params:params})
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