var socket = io();
socket.on('connect',function(){
    console.log('connected to server');
});
socket.on('disconnect', function(){
    console.log('disconnected from server');
});

socket.on('newMessage', function(msg){
    console.log('newMessage');
    console.log(msg);
});

socket.emit('createMessage',{
    from:"Varun ",
    text:"Hello! How are you ?"
});