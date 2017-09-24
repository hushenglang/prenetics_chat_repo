/**
 * question service
 * @author JoeHu
 * @date 2017-Sep-24
 */

var dbPool = require('../util/dbConnection').pool;
const accountRepo = require("../repo/accountRepo");
const log4js = require('log4js');
const log = log4js.getLogger("questionService");
const util = require("util");
const commonUtil = require("../util/commonUtil");

/**
 * get question by sequece
 * @param sequence
 * @returns {*}
 */
function getQuestion(sequence){
    return dbPool.query("SELECT * FROM question WHERE sequence = ? ", [sequence])
        .then(function(questions){
            if(questions.length>0) {
                var messageObj = {
                    "code": questions[0]['code'],
                    "message": questions[0]['content'],
                    "next": "QUESTION",
                    "sequence": sequence
                }
                return messageObj;
            }else{
                return null;
            }
        });
};

/**
 * proceed user's answers and return new question if there are more
 */
function processQA(answer, currentSequence, question_code, userId){
    if(currentSequence==1){
        log.info("insert user profile.....");
        return accountRepo.insertUserProfile(userId)
            .then(function(){ // update profile
                log.info("update user profile.....");
                return updateProfile(answer, question_code);
            })
            .then(function(){ // get next question if there are more;
                log.info("get next question.....");
                return getNextQuestion();
            });
    }else{
        return updateProfile(answer, question_code)
            .then(function () {
                return getNextQuestion();
            });
    }


    function updateProfile(answer, question_code) {
        log.info('question_code',  question_code);
        var columnName, columnValue;
        if (question_code == 'GENDER') {
            columnName = "gender";
            columnValue = "male";
            if (answer.trim() == 'no') {
                columnValue = "female";
            }
        }else if(question_code == "AGE"){
            columnName = "age";
            columnValue = answer;
        }else if(question_code == "HEIGHT"){
            columnName = "height";
            columnValue = answer;
        }else if(question_code == "WEIGHT"){
            columnName = "weight";
            columnValue = answer;
        }

        return accountRepo.updateUserProfile(userId, columnName, columnValue);
    }

    function getNextQuestion(){
        return getQuestion(currentSequence+1)
            .then(function(msgObj){
                if(msgObj==null){
                    return {
                        "code": "FINAL",
                        "next": "COMPLETE",
                        "message": 'Great!, seems we already know better about you, See you next time!'
                    };
                }else{
                    return msgObj;
                }
            })
    }

};


module.exports = {
    getQuestion: getQuestion,
    processQA: processQA
};