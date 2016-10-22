/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../services/PerfilApirestService.ts" />

module ILovePlatos{


    export class PerfilController extends EntityController {
        static $inject = [
            "config",
            "PerfilApirestService",
            "DateService",
            "$rootScope",
            "$controller",
            "$stateParams",
            "$scope",
            "$state",
            "$element",
            "$sce",
            "$modal",
            "$log",
            "auth",
            "store",
            "FilesService"
        ];

        type ='perfiles';
        subType = 'seguimiento';
        username:string;
        email:string;
        password:string;
        isSubmit = false;
        notInit = false;

        constructor($config,api,DateService,$rootScope,$controller,$stateParams,$scope,$state,$element,$sce,private $modal,private $log,auth,store, private FilesService){
            //Seteo el controlador principal
            super($config,api,DateService,$rootScope,$controller,$stateParams,$scope,$state,$element,$sce,auth,store);
            var self = this;            

            $scope.animationsEnabled = true;

            $rootScope.$on('changeSeguimiento', function (event,user,reciproco) {
                $scope.$broadcast('changeSeguimiento', user,reciproco);
            });

            $scope.$on('setUser', function (event,user) {
                $scope.user = user;
            });

            //Mensaje para refrescar los contenidos de la home
            $scope.$on("refreshMiPerfil",function(event,refreshHome) {
                if(refreshHome && !self.gettingUser) {
                    self.getByUsername(self._user.username);
                }
            });

            $scope.$on("newContents",function(event,content) {
                if(content && content.id) {
                    self.getUserFromContent(content);
                }
            });

            FilesService.resetFiles();
            FilesService.setController('perfilCtrl');

        }

        selectFile(event,selector) {
            event.preventDefault();
            if (selector) {
                angular.element(selector).click();
            }
        }

        changeFiles(files,relacion) {
            this.FilesService.fileElemImage = [];
            if(files.length > 1) {
                files.slice(0,1);
            }
            this.FilesService.loadImages(files);
            this.FilesService.previewRecorteImage(relacion);

            if(!this.$scope.$$phase) {
                this.$scope.$apply();
            }
        }

        rotateImage(event,grades) {
            event.preventDefault();
            this.FilesService.rotateImage(grades);
        }

        deleteImage(index){
            this.FilesService.deleteImage(index);
        }

        IAm(user) {
            if(user && user.id && user.id == this._user.username) {
                return true;
            }else {
                return false;
            }
        }

        isPublic(user) {
          if(user && user.attributes &&  ( user.attributes.privacidad == 'PUBLICO' || !user.attributes.privacidad )) {
            return true;
          }else {
            return false;
          }
        }

        MeSigoYleSigo(user) {
            if(user && user.attributes.leSigoYo == "1" && user.attributes.meSigueEl == "1") {
                return true;
            }else {
                return false;
            }
        }

        haveAccess(user) {
            if(this.IAm(user)) {
                return true;
            }else if(this.isPublic(user)) {
                return true;
            }else if(this.MeSigoYleSigo(user)){
                return true;
            }else {
                return false;
            }
        }

        getUserFromUrl() {
          var username = this.$stateParams.username;
          var self = this;
          if(username) {
            this.getByUsername(username);
          }
        }

        getUserFromContent(content) {
            var self =this;
            if(content && content.relationships && content.relationships.usuarios && content.relationships.usuarios.data) {
                var autores = content.relationships.usuarios.data[0];
                //Todo --> revisar porque entrega dos usuarios
                /*if(content.relationships.usuarios.data.length > 1) {
                    autores = content.relationships.usuarios.data[1];
                }*/
                self.$rootScope.$broadcast('setUser', autores);
            }
        }

        gettingUser = false;
        getByUsername(username) {
          if(!username) {
            return '';
          }
          var self = this;
          this.gettingUser = true;
            return this.api.getByUsername(username).then((contents: iEntityApirest) => {
                self.currentState = contents;
                self.contents = jQuery.extend([],contents.data); 
                self.gettingUser = false;               
                if(self.contents) {
                    var user = self.contents;
                    self.$rootScope.$broadcast('setUser', user);
                }else {
                    self._main.redirect404();
                }
            },(erros) => {
                self._main.redirect404();
            });
        }

        getNicknameByUsername(username) {
          if(username && this.contents[username].nickname) {
            return this.contents[username].nickname
          }else if (username) {
            return username;
          }else {
            return 'Anónimo';
          }
        }

        getAvatar(user,extra) {
            var avatar = '';
            if(user) {
                avatar = user.attributes.avatar
            }
            if(extra && extra.attributes && extra.attributes.avatar) {
                avatar = extra.attributes.avatar
            }
            return avatar;
        }

        getDescription(user) {
          var description = '';
          if(user && user.attributes && user.attributes.description && user.attributes.description != '-1') {
            description = user.attributes.description;
          }

          return user.attributes.description
        }

        classLongDescription(user) {
            var classDescription = '';
            var description = user.description || '';
            if(!description && user.attributes) {
                description = user.attributes.description || '';
            }

            if(user && description && description.length < 50) {
                classDescription = 'description-s';
            }
            else if(user && description && description.length < 100) {
                classDescription = 'description-m';
            }
            else if(user && description && description.length <= 150) {
                classDescription = 'description-l';
            }

            return classDescription;
        }

        hasDescription(user) {

            var description = user.description || '';
            if(!description && user.attributes) {
                description = user.attributes.description || '';
            }

            if(user &&description) {
                return true;
            }else {
                return false;
            }
        }

    }

}
