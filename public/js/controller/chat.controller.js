/**
 * chat controller
 * view: view/login.view.html
 * @author JoeHu
 * @date 2017-Sep-22
 */

'use strict';

angular
    .module('prenetics_chat')
    .controller('ChatController', ChatController);

ChatController.$inject = ['$scope', '$location', '$timeout', '$anchorScroll'];
function ChatController($scope, $location, $timeout, $anchorScroll) {

    const userName = sessionStorage.getItem("user_name");

    $scope.sendMessage = sendMessage;
    $scope.logout = logout;

    var socket = io();
    $scope.messages = [];// local cache all sending/receiving message;

    init_chat();

    function init_chat(){
        $timeout(function(){
            $scope.messages.push({"sender":"server", "message_text":"Hi "+userName+", Welcome to Prenetics!"});
        }, 500);

        // listening on messaging event.
        socket.on("messaging", function (msg) {
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.messages.push({"sender":"server", "message_text":msg});
                    $location.hash('chat_content_bottom');
                    $anchorScroll();
                });
            },100);
        });

        // avoid refresh the page
        $location.hash('chat_content_bottom');
        $anchorScroll();
    }

    // send message function
    function sendMessage(){
        var msg = $scope.message_text;
        if(msg) {
            socket.emit('messaging', msg);
            $scope.message_text = "";
            $scope.messages.push({"sender":"client", "message_text":msg});
            $location.hash('chat_content_bottom');
            $anchorScroll();
        }
    }

    function logout(){
        socket.disconnect();
        sessionStorage.removeItem("user_name");
        $location.path('/login');
    }


}