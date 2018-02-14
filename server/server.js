const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {createMessage, createCoordsMessage, validateParams} = require('./utils/utils');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 8080;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();


app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("New User Connected");

    socket.on('join', (params, callback) =>{
        if(!validateParams(params.name) || !validateParams(params.room)){
            return callback('Name / Room Name are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage',createMessage('Admin','Welcome to Vroom Chat'));
        socket.broadcast.to(params.room).emit('newMessage', createMessage('Admin',`${params.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (newMsg, callback) =>{
        //io.emit to emit to all connected clients.
        let user = users.getUser(socket.id);
        if(user && validateParams(newMsg.text)){
            io.to(user.room).emit('newMessage',createMessage(user.name, newMsg.text));
        }
        callback();
    });

    socket.on('createLocationMessage', (coords, callback) =>{
        let user = users.getUser(socket.id);
        if(user && coords){
            io.to(user.room).emit('newLocationMessage',createCoordsMessage(user.name, coords.latitude, coords.longitude));
        }
        callback();
    });

    socket.on('disconnect',()=>{
        let user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', createMessage('Admin',`${user.name} has left.`));
        }

        console.log("User was disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
