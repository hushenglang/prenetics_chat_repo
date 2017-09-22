/**
 * login controller
 * view: view/login.view.html
 * @author JoeHu
 * @date 2017-Sep-22
 */

'use strict';

angular
    .module('prenetics_chat')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$location'];
function LoginController($scope, $location) {

    // define handlers
    $scope.login = loginHandler;

    //login handler
    function loginHandler() {
        sessionStorage.setItem("user_name", $scope.user_name);
        $location.path('/chat');
    }
}
