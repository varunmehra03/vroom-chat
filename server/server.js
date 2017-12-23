const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("New User Connected");
    socket.on('disconnect',()=>{
        console.log("User was disconnected");
    });

    socket.emit('newMessage', {
        from:"Varun",
        text:"All Good",
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (newMsg) =>{
        console.log("Create Email ", newMsg);
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});