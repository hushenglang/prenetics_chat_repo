/**
 * Defining angular routes
 * @author JoeHu
 * @date 2017-Sep-22
 */

'use strict';

angular.module('prenetics_chat')
    .config(routeConfig)

//config routes
routeConfig.$inject = ['$routeProvider'];
function routeConfig($routeProvider) {
    $routeProvider
        .when('/chat', {
            controller: 'ChatController',
            templateUrl: 'view/chat.view.html',
        })

        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'view/login.view.html',
        })

        .otherwise({ redirectTo: '/login' });
}