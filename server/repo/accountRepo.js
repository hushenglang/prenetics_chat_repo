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
    return dbPool.query("INSERT INTO `user` (`user_name`) VALUES (?)", [userName]);
};

exports.findByUserName = function(userName){
    return dbPool.query("SELECT id, user_name, create_date FROM user WHERE user_name=?", [userName]);
}

exports.findProfileByUserId = function(userId){
    return dbPool.query("SELECT * FROM user_profile WHERE user_id=?", [userId]);
}

exports.insertUserProfile = function(userId){
    return dbPool.query("INSERT INTO `user_profile` (`user_id`) VALUES (?)", [userId]);
}

exports.updateUserProfile = function(userId, columnName, value){
    return dbPool.query("UPDATE user_profile SET " +columnName+ "=? WHERE user_id=?", [value, userId]);
}