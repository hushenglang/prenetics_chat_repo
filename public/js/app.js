/**
 * angular app entry point file, config angular app.
 * @author JoeHu
 * @date 2017-Sep-22
 */

'use strict';

var app = angular.module('prenetics_chat', ['ngRoute', 'ui.bootstrap']);

//set listener and others
app.run(['$rootScope', '$location', '$http', function($rootScope, $location, $http){
    $rootScope.$on('$locationChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var user = sessionStorage.getItem("user");
        if(!user){
            $location.path('/login');
        }else{
            $location.path('/chat');
        }
    });
}]);