/**
 * provide all router registration & token verification handler
 * @author JoeHu
 * @date 2017-Sep-22
 */

'use strict';

/**
 * Module dependencies.
 */
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const log4js = require('log4js');
const log = log4js.getLogger("server");

const messageController = require("./server/messageController");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(log4js.connectLogger(log4js.getLogger('access'), { level: log4js.levels.DEBUG })); //config log4js access log, request's http header info would be logged.
app.use('/api',require('./server/restApiController'));

io.on('connection', function(socket){
    console.log('a user connected');

    messageController.greeting(socket);

    // disconnect event
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // chat message event
    socket.on('messaging', function(msg){
        console.log('receive message: ' + msg);

    });
});

//app middleware for general error handling
app.use(function (err, req, res, next) {
    log.error(err);
    res.status(500).send("server throws exception, please try it again!");
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});