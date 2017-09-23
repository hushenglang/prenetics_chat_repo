/**
 * Greeting handler
 * @author JoeHu
 * @date 2017-Sep-23
 */

var dbPool = require('../util/dbConnection').pool;
const log4js = require('log4js');
const log = log4js.getLogger("greetingHandler");

/**
 * return greeting message list
 * @returns {*}
 */
exports.greeting = function(){

    return dbPool.query("SELECT * FROM message where type='GREETING'");

}