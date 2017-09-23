/**
 * rest api controller
 * @author JoeHu
 * @date 2017-Sep-er
 */

'use strict';

const express = require('express');
const router = express.Router();
const log4js = require('log4js');
const log = log4js.getLogger("restApiController");
const accountRepo = require("./repo/accountRepo");

/**
 * if user account exist return user obj, if not create new one and return user obj.
 */
router.post("/register", function(req, res, next){
    var userName = req.body.userName;
    log.info("user registration...", userName);
    var isInsert = false;
    accountRepo.findByUserName(userName)
        .then(function(userObj){
            log.info("query user..", userObj);
            if(userObj.length>0){
                log.info("user exist, return...");
                res.json(userObj);
                return;
            }else{
                log.info("user does not exist, create new one...");
                isInsert = true;
                return accountRepo.insertAccount(userName)
            }
        })
        .then(function(){
            if(isInsert) {
                accountRepo.findByUserName(userName)
                    .then(function (userObj) {
                        if (userObj) {
                            res.json(userObj);
                        } else {
                            res.status(403);
                        }
                    });
            }
        })
        .catch(function(err){
            next(err);
        });
});

module.exports = router;