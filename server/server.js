const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {createMessage, createCoordsMessage, validateParams} = require('./utils/utils');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 8080;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("New User Connected");
    socket.on('disconnect',()=>{
        console.log("User was disconnected");
    });

    socket.on('join', (params, callback) =>{
        if(!validateParams(params.name) || !validateParams(params.room)){
            callback('Name/RoomName are not valid');
        }

        socket.join(params.room);
        socket.emit('newMessage',createMessage('Admin','Welcome to Vroom Chat'));
        socket.broadcast.to(params.room).emit('newMessage', createMessage('Admin','New User Joined'));


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
