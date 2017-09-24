/**
 * rest api controller
 * @author JoeHu
 * @date 2017-Sep-24
 */

'use strict';

const log4js = require('log4js');
const log = log4js.getLogger("accountService");
const accountRepo = require("../repo/accountRepo");

/**
 * get user stage
 * @param userId
 * @return String [ROOKIE | VETERAN]
 */
exports.getUserStage = function(userId){
    return accountRepo.findProfileByUserId(userId)
        .then(function(rows){
            if(rows.length==0){
                return "ROOKIE";
            }else{
                return "VETERAN";
            }
        });
}

