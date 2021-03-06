/**
 * Greeting handler
 * @author JoeHu
 * @date 2017-Sep-23
 */

var dbPool = require('../util/dbConnection').pool;
const log4js = require('log4js');
const log = log4js.getLogger("greetingHandler");
const util = require("util");
const commonUtil = require("../util/commonUtil");

/**
 * return greeting message list
 * @returns {*}
 */
exports.greeting = function(stage, timeRange, userName){

    var messages = [];
    return dbPool.query("SELECT * FROM general_message WHERE type='GREETING' AND (stage=? OR stage='ALL') " +
        "AND (time_range=? OR time_range='ALL')", [stage, timeRange])
        .then(function(greetings){ //greeting primary
            var greetingPrimarys = greetings.filter(g=>g['level']=='PRIMARY');
            //randomly choose one message
            var idx = commonUtil.getRandomNumber(0, greetingPrimarys.length-1);
            var greetingPrimary = greetingPrimarys[idx];
            var message = greetingPrimary["content"];
            message = util.format(message, userName);
            var messageObj = {
                "code": "GREETING_PRIMARY",
                "message": message
            }
            messages.push(messageObj);
            return greetings;
        })
        .then(function(greetings){ //greeting secondary
            var greetingSecondarys = greetings.filter(g=>g['level']=='SECONDARY');
            //randomly choose one message
            var idx = commonUtil.getRandomNumber(0, greetingSecondarys.length-1);
            var greetingSecondary = greetingSecondarys[idx];
            var message = greetingSecondary["content"];
            var messageObj = {
                "code": "GREETING_SECONDARY",
                "message": message
            }
            messages.push(messageObj);
            return messages;
        });

};

/**
 * return self intro
 * @returns {*}
 */
exports.selfIntro = function(stage, timeRange, userName){

    var messages = [];
    return dbPool.query("SELECT * FROM general_message WHERE type='SELFINTRO' AND (stage=? OR stage='ALL') " +
        "AND (time_range=? OR time_range='ALL')", [stage, timeRange])
        .then(function(selfIntroes){ //self intro primary
            var selfIntroPrimarys = selfIntroes.filter(g=>g['level']=='PRIMARY');
            //randomly choose one message
            var idx = commonUtil.getRandomNumber(0, selfIntroPrimarys.length-1);
            var selfIntroPrimary = selfIntroPrimarys[idx];
            var message = selfIntroPrimary["content"];
            var messageObj = {
                "code": "SELFINTRO_PRIMARY",
                "message": message,
                "next": "ANALYSIS"
            }
            messages.push(messageObj);
            return messages;
        });
};