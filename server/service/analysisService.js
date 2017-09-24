/**
 * analysis service
 * @author JoeHu
 * @date 2017-Sep-24
 */

var dbPool = require('../util/dbConnection').pool;
const log4js = require('log4js');
const log = log4js.getLogger("analysisService");
const util = require("util");
const commonUtil = require("../util/commonUtil");

exports.analysis = function(stage, timeRange, userName){

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
        });

}