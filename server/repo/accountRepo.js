/**
 * account repo
 * @author JoeHu
 * @date 2017-Sep-23
 */

var dbPool = require('../util/dbConnection').pool;
const log4js = require('log4js');
const log = log4js.getLogger("accountRepo");

/**
 * return greeting message list
 * @returns {*}
 */
exports.insertAccount = function(userName){
    return dbPool.query("INSERT INTO `user` (`user_name`) VALUES (?)", [userName])
        .then(function(obj){
        log.info("@@@@@@@@@@@@@obj:", obj);
    });
};

exports.findByUserName = function(userName){
    return dbPool.query("SELECT id, user_name, create_date FROM user WHERE user_name=?", [userName])
}