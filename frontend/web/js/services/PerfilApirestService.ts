/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../models/mainModel.ts" />
/// <reference path="../models/entityModel.ts" />
/// <reference path="./EntityApirestService.ts" />

module ILovePlatos{

    export class PerfilApirestService extends EntityApirestService {
        
        type = 'perfiles';        

        constructor($config,$http,$q,$log,auth) {
            super($config,$http,$q,$log,auth);
        }

        getByUserId(userId): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/"+userId,{params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        existEmail(email): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/existemail/"+email,{params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        existUsername(username): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/existusername/"+username,{params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        getByUsername(username): ng.IPromise<iEntityApirest>{
            var d = this.$q.defer();
            var params = this.getParamsUser();

            this.$http.get(this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/"+username,{params:params})
                .success((data: iEntityApirest) => {
                    d.resolve(data);
                })
                .error((error) => {
                    this.$log.error(error);
                    d.reject(error);
                });

            return d.promise;
        }

        updateMetas(entity,userId) {
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

        linkPerfil(entity) {
          var d = this.$q.defer();

            this.$http({
                method: 'POST',
                url: this.$config.protocolApirest+this.$config.domainApirest+"/"+this.getTypeAccess()+"/"+this.type+"/link",
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
