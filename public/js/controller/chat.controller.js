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

    const user = angular.fromJson(sessionStorage.getItem("user"));
    const userId = user.id;
    const userName = user.user_name;

    $scope.sendMessage = sendMessage;
    $scope.logout = logout;

    var socket = io();
    $scope.messages = [];// local cache all sending/receiving message;

    var lastMsgObj = null; //last message

    init_chat();

    function init_chat(){

        // register on server;
        socket.emit('register', user);

        // listening on messaging event.
        socket.on("messaging", function (msgObj) {
            var msg = msgObj['message'];
            lastMsgObj = msgObj;
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.messages.push({"sender":"server", "message_text":msg});
                    $location.hash('chat_content_bottom');
                    $anchorScroll();
                });
            },100);
        });

        // avoid refresh the page
        // $location.hash('chat_content_bottom');
        // $anchorScroll();
    }

    // send message function
    function sendMessage(){
        var msg = $scope.message_text;
        if(msg) {
            socket.emit('messaging', {
                "next": lastMsgObj.next,
                "user_id": user.id,
                "user_name": user.user_name,
                "message": msg,
                "sequence": lastMsgObj.sequence,
                'code': lastMsgObj.code
            });
            $scope.message_text = "";
            $scope.messages.push({"sender":"client", "message_text":msg});
            $location.hash('chat_content_bottom');
            $anchorScroll();
        }
    }

    function logout(){
        socket.disconnect();
        sessionStorage.removeItem("user");
        $location.path('/login');
    }


}