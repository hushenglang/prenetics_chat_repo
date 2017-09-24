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

LoginController.$inject = ['$scope', '$location', 'HttpRequestService'];
function LoginController($scope, $location, HttpRequestService) {

    // define handlers
    $scope.login = loginHandler;

    //login handler
    function loginHandler() {
        $scope.dataLoading = true;
        HttpRequestService.post("/api/register", {userName:$scope.user_name})
            .then(function(response){
                if(response) {
                    var userObj = response;
                    sessionStorage.setItem("user", angular.toJson(userObj));
                    $location.path('/chat');
                }
                $scope.dataLoading = false;
            });
    }
}
