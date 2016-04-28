'use strict';

var app = angular.module('gae-uploader-comp', []);

app.directive('uploadFile', ['SETTINGS', '__Uploader', '$rootScope', function(SETTINGS, __Uploader, $rootScope) {
    return {
        restrict: 'A',
        scope: {
            actionUrl: '@',
            completeUrl: '@',
            emit: '@',
            render: '@'
        },
        link:function(scope, element, attrs){

            $(element.find('input[type=file]')[0]).on('change', function(event){
                console.log(scope.actionUrl);
                if(scope.actionUrl !== null){
                    var filestag = element.find('input[type=file]');
                    if(filestag.length > 0){
                        var formData = new FormData();
                        formData.append('complete_url', scope.completeUrl);
                        var files_list = filestag[0].files;

                        if(files_list.length > 0){
                            for(var i = 0; i < files_list.length; i++){
                                var file = files_list[i];
                                formData.append(file.name, files_list[i]);
                            }

                            var responseUploaderService = __Uploader.uploadFile(scope.actionUrl, formData);
                            responseUploaderService.success(function(data){
                                console.log(data);
                                if(data.file_list_loaded.length > 0){
                                    var imgtag = element.find('img');
                                    if(imgtag.length > 0){
                                        var url = data.file_list_loaded[0].serving_url + scope.render;
                                        imgtag[0].src = url;
                                        // imgtag.css('display', 'none');
                                    }else{
                                        var atag =  element.find('a');
                                        if(atag.length > 0){
                                            atag[0].href = data.file_list_loaded[0].serving_url;
                                        }
                                    }
                                    console.log("event: ", scope.emit);
                                    if(scope.emit !== undefined){
                                        $rootScope.$broadcast(scope.emit, data);
                                    }
                                }
                            }).error(function(data){
                                console.log(data);
                                var uploaderCreateUrlService = __Uploader.createUploadUrl({
                                    'bucket': SETTINGS.UPLOADER.BUCKET,
                                    'folder': SETTINGS.UPLOADER.FOLDER
                                });
                                uploaderCreateUrlService.success(function(data){
                                    scope.actionUrl = data.upload_url;
                                    scope.completeUrl = data.complete_url;
                                }).error(function(data){
                                    console.log("error");
                                    scope.actionUrl = null;
                                });
                            });

                        }else{
                            console.log("File tag is empty");
                        }
                    }else{
                        console.log("File tag is empty");
                    }
                }else{
                    console.log("actionUrl is null,");
                }
            })
        },
        controller: function(__Uploader, $scope){
            console.log(SETTINGS);
            var uploaderCreateUrlService = __Uploader.createUploadUrl({
                'bucket': SETTINGS.UPLOADER.BUCKET,
                'folder': SETTINGS.UPLOADER.FOLDER
            });
            uploaderCreateUrlService.success(function(data){
                $scope.actionUrl = data.upload_url;
                $scope.completeUrl = data.complete_url;
            }).error(function(data){
                console.log("error");
                $scope.actionUrl = null;
            });
        }
    };
}])
.service('__Uploader', ['$http', 'SETTINGS', function($http, SETTINGS){
    var services = {
        createUploadUrl: function(data){
            var url = SETTINGS.UPLOADER.REQUEST_URL;
            var req = $http({
                'method': 'GET',
                'url': url,
                'params': data
            });

            return req;
        },
        uploadFile: function(url, formData){
            var req = $http({
                'method': 'POST',
                'url': url,
                'data': formData,
                'headers': {
                  'Content-Type': undefined
                },
                transformRequest: angular.identity,
            });
            return req;
        }
    }
    return services;
}]);
