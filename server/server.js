const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {createMessage, createCoordsMessage} = require('./utils/utils');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("New User Connected");
    socket.broadcast.emit('newMessage', createMessage('Admin','New User Joined'));
    socket.emit('newMessage',createMessage('Admin','Welcome to Vroom Chat'));

    socket.on('disconnect',()=>{
        console.log("User was disconnected");
    });

    socket.on('createMessage', (newMsg, callback) =>{
        //io.emit to emit to all connected clients.
        io.emit('newMessage',createMessage(newMsg.from,newMsg.text));
        callback();
    });

    socket.on('createLocationMessage', (coords, callback) =>{
        io.emit('newLocationMessage', createCoordsMessage('Admin',coords.latitude, coords.longitude));
        callback();
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});