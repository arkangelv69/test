/// <reference path="EntityApirestService.ts" />

module ILovePlatos{    

    export class PlateApirestService extends EntityApirestService{

        type = 'plate';
        typeAll = 'plates';

        constructor($config,$http,$q,$log,auth,store) {
            super($config,$http,$q,$log,auth,store);
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

        addLike(data): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http({
                method: 'POST',
                //url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/today/"+entityId,
                url: this.$config.protocolApirest+this.$config.domainApirest+"/public/"+this.type+"/addLike",
                data: data,
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

        removeLike(data): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http({
                method: 'POST',
                //url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/today/"+entityId,
                url: this.$config.protocolApirest+this.$config.domainApirest+"/public/"+this.type+"/removeLike",
                data: data,
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