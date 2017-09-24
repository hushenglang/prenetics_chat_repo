/**
 * analysis service
 * @author JoeHu
 * @date 2017-Sep-24
 */

var dbPool = require('../util/dbConnection').pool;
const accountRepo = require("../repo/accountRepo");
const log4js = require('log4js');
const log = log4js.getLogger("analysisService");
const util = require("util");
const commonUtil = require("../util/commonUtil");

exports.analysis = function(stage, timeRange, userId){

    var messages = [];
    return dbPool.query("SELECT * FROM general_message WHERE type='ANALYSIS' AND (stage=? OR stage='ALL') " +
        "AND (time_range=? OR time_range='ALL')", [stage, timeRange])
        .then(function(analysises){ //analysis primary
            var analysisPrimarys = analysises.filter(g=>g['level']=='PRIMARY');
            //randomly choose one message
            var idx = commonUtil.getRandomNumber(0, analysisPrimarys.length-1);
            var analysisPrimary = analysisPrimarys[idx];
            var message = analysisPrimary["content"];
            var messageObj = {
                "code": "ANALYSIS_PRIMARY",
                "message": message
            }
            messages.push(messageObj);
            return analysises;
        })
        .then(function(analysises){ //analysis secondary
            var analysisesecondarys = analysises.filter(g=>g['level']=='SECONDARY');
            //randomly choose one message
            var idx = commonUtil.getRandomNumber(0, analysisesecondarys.length-1);
            var analysisesecondary = analysisesecondarys[idx];
            var message = analysisesecondary["content"];
            var messageObj = {
                "code": "ANALYSIS_SECONDARY",
                "message": message
            }
            if(stage=='ROOKIE'){
                messageObj['next'] = 'FILL_PROFILE';
            }
            messages.push(messageObj);
            return messages;
        })
        .then(function(messages){
            // if user profile already existed, generate user profile and return;
            if(stage=='VETERAN'){
                return accountRepo.findProfileByUserId(userId)
                    .then(function(rows){
                        var userProfile= rows[0];
                        var messageObj = {
                            "code": "PROFILE",
                            "next": "COMPLETE",
                            "messageType": "profile",
                            "message": userProfile
                        };
                        messages.push(messageObj);
                        return messages;
                    });
            }else{
                return messages;
            }
        });

}