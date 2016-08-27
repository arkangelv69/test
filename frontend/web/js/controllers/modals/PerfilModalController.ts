/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/parse/parse.d.ts" />
/// <reference path="../../services/modules/files/service.ts" />

module ILovePlatos{

    export class PerfilModalController implements iUserModel{

        static $inject = [
            "config",
            "$rootScope",
            "$scope",
            "$state",
            "$window",
            "$stateParams",
            "$modalInstance",
            "FilesService"
        ];

        _main:IMainScope;
        _user:IUserScope;
        maxSizeImages = 10485760;
        constructor($config:any,
        $rootScope: IBuhoRootScopeService,private $scope:any,private $state:any,private $window:any,private $stateParams:any,private $modalInstance:any,private FilesService){

            var self = this;
            self._main = $rootScope.$$childHead.mainCtrl;
            self._user = $rootScope.$$childHead.$$childHead.userCtrl;

            $scope.nickname = self._user.nickname;
            $scope.imageBackground = self._user.imageBackground;
            $scope.colorBackground = self._user.colorBackground;
            $scope.imagePerfil = self._user.imagePerfil;

            $scope.submitName = function () {
              var form = $scope.user;
              var name = form.nickname.$viewValue;
              var user = self._user.currentUser;

              if(!name) {
                $scope.resetMessages();
                $scope.setMessage({type:'danger',text:'Upss! algo a sucedido al guardar tus datos.'});
                return null;
              }

                self._user.updateMeta("nickname", name).then(function(response) {
                  $scope.resetMessages();
                  $scope.setMessage({type:'success',text:'Tu Nombre se ha actualizado correctamente.'});
                },function(error) {
                  $scope.resetMessages();
                  $scope.setMessage({type:'danger',text:'Upss! algo a sucedido al guardar tus datos.'});
                });

                self._user.nickname = name;
                self._user.updateProfile({'nickname':name});
                self._user.saveUserInStorageLocal();
                $modalInstance.close();
            };

            $scope.submitDescription = function () {
              var form = $scope.user;
              var description = form.description.$viewValue;
              var user = self._user.currentUser;

              if(!description) {
                $scope.resetMessages();
                $scope.setMessage({type:'danger',text:'Upss! algo a sucedido al guardar tus datos.'});
                return null;
              }

                self._user.updateMeta("description", description).then(function(response) {
                  $scope.resetMessages();
                  $scope.setMessage({type:'success',text:'Tu descripción se ha actualizado correctamente.'});
                },function(error) {
                  $scope.resetMessages();
                  $scope.setMessage({type:'danger',text:'Upss! algo a sucedido al guardar tus datos.'});
                });

                self._user.description = description;
                self._user.updateProfile({'description':description});
                self._user.saveUserInStorageLocal();
                $modalInstance.close();
            };

            $scope.submitPassword = function () {
              var form = $scope.user;
              var password = form.password.$viewValue;
              var user = self._user.currentUser;

              if(!password) {
                $scope.resetMessages();
                $scope.setMessage({type:'danger',text:'Upss! algo a sucedido al guardar tus datos.'});
                return null;
              }

              self._user.updateMeta("password", password).then(function(response) {
                  $modalInstance.close();
                },function(error) {
                  $scope.resetMessages();
                  $scope.setMessage({type:'danger',text:'Upss! algo a sucedido al guardar tus datos.'});
                });
            };

            $scope.submitImagePerfil = function () {
              var form = $scope.user;
              var crop = $('.avatar-data').val();
              $scope.uploadImages(FilesService.fileElemImage[0], crop, 'imagePerfil');
            };

            $scope.submitImageBackground = function () {
              var form = $scope.user;
              var crop = $('.avatar-data').val();
              $scope.uploadImages(FilesService.fileElemImage[0], crop, 'imageBackground');
            };

            $scope.uploadImages = function(file, crop, imageType){

              var MAX_WIDTH = null;
              var MAX_HEIGHT = null;

              switch (imageType) {
                case "imagePerfil":
                  MAX_WIDTH = 100;
                  MAX_HEIGHT = 100;
                  endpointURLCrop = $config.protocolFront+$config.domainFront+"/private/images/upload/canvas";
                  break;
                case "imageBackground":
                  MAX_WIDTH = 2000;
                  MAX_HEIGHT = 768;
                  endpointURLCrop = $config.protocolFront+$config.domainFront+"/private/images/upload/canvas";
                  break;
              }

              var canvasBinary = FilesService.getBinaryCanvas({
                  'MAX_WIDTH':MAX_WIDTH,
                  'MAX_HEIGHT':MAX_HEIGHT
              });

              if(canvasBinary){
                var endpointURLCrop = $config.protocolFront+$config.domainFront+"/private/images/upload/canvas";
                $.ajax({
                    url: endpointURLCrop,
                    type: "POST",
                    data: '{ "imageData" : "' + canvasBinary + '" }',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    success: function(response){
                      if(response && response.data && !response.error) {
                        //Espero 2 segundo(s) para que opere la cola SNS para subir al S3.
                        var data = response.data;
                        self._user.updateMeta(imageType, data).then(function() {
                            $scope.resetMessages();
                            $scope.setMessage({type:'success',text:'Tu imagen se ha actualizado correctamente.'});
                        },function() {
                            $scope.resetMessages();
                            $scope.setMessage({type:'danger',text:'Upss! algo a sucedido al guardar tus datos.'});
                        });

                        //Damos por supuesto que se sube bien
                        if(imageType == "imagePerfil"){
                            self._user.imagePerfil = data;
                            self._user.updateProfile({'avatar':data});
                            self._user.saveUserInStorageLocal();
                        }
                        else if (imageType == "imageBackground"){
                            self._user.imageBackground = data;
                            self._user.updateProfile({'imageBackground':data});
                            self._user.saveUserInStorageLocal();
                        }

                        $modalInstance.close();

                      }

                    }
                });
              }else{
                $scope.resetMessages();
                $scope.setMessage({type:'danger',text:'El archivo no es de un tipo válido o es mayor a '+(self.maxSizeImages / (1024 * 1024))});
              }
            }

            $scope.submitColorBackground = function () {
              var form = $scope.user;
              var colorBackground = $scope.colorBackground;
              var user = self._user.currentUser;

              if(!colorBackground) {
                $scope.resetMessages();
                $scope.setMessage({type:'danger',text:'Upss! algo a sucedido al guardar tus datos.'});
                return null;
              }

              self._user.updateMeta("colorBackground", colorBackground).then(function() {
                  $scope.resetMessages();
                  $scope.setMessage({type:'success',text:'Tu imagen se ha actualizado correctamente.'});
              },function() {
                  $scope.resetMessages();
                  $scope.setMessage({type:'danger',text:'Upss! algo a sucedido al guardar tus datos.'});
              });

              self._user.colorBackground = colorBackground;
              $modalInstance.close();
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };

            $scope.resetMessages = function() {
                $scope.messages = [];
            }

            $scope.setMessage = function(message) {
                var html = '';
                if(message && message.type && message.text) {
                    html = '<p class="alert alert-'+message.type+'" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> '+message.text+'</p>'
                    $scope.messages.push(html);
                }
                if( !$scope.$$phase  ) {
                    $scope.$apply();
                }
            }

            $scope.hasImageSelected = function() {
              var images = FilesService.getFileElement();
              if(images && images.length > 0) {
                  return true;
              }else {
                  return false;
              }
            }
        }
    }

}
