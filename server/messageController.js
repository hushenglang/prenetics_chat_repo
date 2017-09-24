/**
 * message controller
 * @author JoeHu
 * @date 2017-Sep-23
 */

const util = require("util");
const greetingService = require('./service/greetingService');
const accountService = require('./service/accountService');
const log4js = require('log4js');
const log = log4js.getLogger("messageController");

const userCache = require("./util/userCache");
const commonUtil = require("./util/commonUtil");


/**
 * return greeting message list
 * @returns {*}
 */
exports.greeting = function(user, socket){
    log.debug("user greeting...", user);

    //1. find the time range;
    var timeRange = commonUtil.getTimeRange();

    //2.find stage.
    var cachedUser = userCache.getUserById(user.id);
    if(!cachedUser){
        // query db to find the stage
        accountService.getUserStage(user.id)
            .then(function(stage){
                user.stage = stage;
                userCache.cacheUserById(user.id, user);
                sendGreeting(stage, timeRange, user.user_name, socket)
            });
    }else{
        sendGreeting(cachedUser.stage, timeRange, user.user_name, socket)
    }

    //send greeting message
    function sendGreeting(stage, timeRange, userName, socket){
        greetingService.greeting(stage, timeRange, userName)
            .then(function(messages){
                messages.forEach(function(messageObj){
                    socket.emit("messaging", messageObj);
                })
            })
    }
}

