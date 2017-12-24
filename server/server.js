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
    socket.broadcast.emit('newMessage', {
        from:'Admin',
        text:'New User Joined',
        createdAt: new Date().getTime()
    });

    socket.emit('newMessage', {
        from:'Admin',
        text:'Welcome to Vroom Chat',
        createdAt: new Date().getTime()
    });

    socket.on('disconnect',()=>{
        console.log("User was disconnected");
    });

    socket.on('createMessage', (newMsg, callback) =>{
        //io.emit to emit to all connected clients.
        io.emit('newMessage', {
            from:newMsg.from,
            text:newMsg.text,
            createdAt: new Date().getTime()
        });

        callback("Yeah!! Server Acknowledged receiving the message");
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});