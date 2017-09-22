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
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', function(socket){
    console.log('a user connected');

    // disconnect event
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // chat message event
    socket.on('messaging', function(msg){
        console.log('receive message: ' + msg);
        socket.emit("messaging", "i am chatbot, received your message!");
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});