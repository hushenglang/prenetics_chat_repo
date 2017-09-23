/**
 * message controller
 * @author JoeHu
 * @date 2017-Sep-23
 */

const greetingHandler = require('./handler/greetingHandler');
const log4js = require('log4js');
const log = log4js.getLogger("messageController");

/**
 * return greeting message list
 * @returns {*}
 */
exports.greeting = function(socket){

    greetingHandler.greeting()
        .then(function(greetings){
            var greetingPrimarys = greetings.filter(g=>g['code']=='GREETING_PRIMARY');
            var greetingPrimary = greetingPrimarys[0];
            var message = greetingPrimary["content"];
            var messageObj = {
                "code": "GREETING_PRIMARY",
                "message": message
            }
            socket.emit("messaging", messageObj);
            return greetings;
        })
        .then(function(greetings){
            var greetingSecondarys = greetings.filter(g=>g['code']=='GREETING_SECONDARY');
            var greetingSecondary = greetingSecondarys[0];
            var message = greetingSecondary["content"];
            var messageObj = {
                "code": "GREETING_SECONDARY",
                "message": message
            }
            socket.emit("messaging", messageObj);
            return greetings;
        });


}