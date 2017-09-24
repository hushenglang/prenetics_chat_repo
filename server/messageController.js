/**
 * message controller
 * @author JoeHu
 * @date 2017-Sep-23
 */

const util = require("util");
const greetingService = require('./service/greetingService');
const analysisService = require('./service/analysisService');
const accountService = require('./service/accountService');
const questionService = require('./service/questionService');
const log4js = require('log4js');
const log = log4js.getLogger("messageController");

const userCache = require("./util/userCache");
const commonUtil = require("./util/commonUtil");


/**
 * return greeting message list
 * @returns {*}
 */
exports.greetingSelfIntro = function (user, socket) {
    log.debug("user greeting...", user);

    //1. find the time range;
    var timeRange = commonUtil.getTimeRange();

    //2.find stage.
    // query db to find the stage
    accountService.getUserStage(user.id)
        .then(function (stage) {
            user.stage = stage;
            userCache.cacheUserById(user.id, user);
            return sendGreetingAndSelfIntro(stage, timeRange, user.user_name, socket)
        });

    //send greeting message and self intro
    function sendGreetingAndSelfIntro(stage, timeRange, userName, socket) {
        return greetingService.greeting(stage, timeRange, userName)
            .then(function (messages) {
                messages.forEach(function (messageObj) {
                    socket.emit("messaging", messageObj);
                })
            })
            .then(function () { // sending self intro
                return greetingService.selfIntro(stage, timeRange, userName);
            })
            .then(function (messages) {
                messages.forEach(function (messageObj) {
                    socket.emit("messaging", messageObj);
                })
            });
    }
};

exports.processMessage = function (msgObj, socket) {
    var next = msgObj["next"];
    var userId = msgObj["user_id"];
    var msg = msgObj['message'].trim();
    if (next == 'ANALYSIS') {
        analysis(userId, socket);
    } else if (next == 'FILL_PROFILE') {
        fillProfile(msg, socket);
    } else if(next == "QUESTION") {
        log.info("processMessage QUESTION...");
        questionService.processQA(msg, msgObj['sequence'], msgObj['code'], userId)
            .then(function(messageObj){
                log.info("next question is ", messageObj);
                socket.emit("messaging", messageObj);
            })
    } else if(next =="COMPLETE") {
        log.info("The whole process is completed, just causal chat with user");
        socket.emit("messaging", {
            "next": "COMPLETE",
            "message": "This is demo application, chat bot need more intelligence. See you util i am smart enough..."
        });
    }
}

/////////////////// below's code will move to server folder later on.
function fillProfile(msg, socket) {
    log.info("fill profile...");
    if (msg == 'no') {
        socket.emit("messaging", {
            "code": "",
            "message": "Ok no worries, when you are available, feel free to come back and we can talk more. See you..."
        });
    } else {
        questionService.getQuestion(1)
            .then(function(msgObj){
                socket.emit("messaging", msgObj);
        });
    }
}

function analysis(userId, socket) {
    log.debug("user analysis...");

    //1. find the time range;
    var timeRange = commonUtil.getTimeRange();

    //2.find stage.
    var cachedUser = userCache.getUserById(userId);
    var stage = cachedUser.stage;

    log.info("stage.......... ", stage);

    analysisService.analysis(stage, timeRange, userId)
        .then(function (messages) {
            messages.forEach(function (messageObj) {
                socket.emit("messaging", messageObj);
            })
        });
}
