const sendButton = jQuery('#send-message');
const msgTextBox = jQuery('input[name=message]');
const chatForm = jQuery('#chat-form');
const locationButton = jQuery('#send-location');
const buttonText = {'Sending':'Sending location...', 'Default':'Send location'};

var socket = io();
socket.on('connect',function(){
    console.log('Connected to server...');
});
socket.on('disconnect', function(){
    console.log('Disconnected from server...');
});

socket.on('newMessage', function(msg){
    let li = jQuery('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);
    jQuery("#messages").append(li);
});

socket.on('newLocationMessage', function(msg){
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My Current Location</a>');
    a.attr('href',msg.url);
    li.text(`${msg.from}: `);
    li.append(a);
    jQuery("#messages").append(li);
});

msgTextBox.on('input',function(){
    if(!msgTextBox.val()){
        sendButton.attr('disabled','disabled');
    }else{
        sendButton.removeAttr('disabled');
    }
});

chatForm.on('submit', function(e){
    e.preventDefault();
    if(msgTextBox.val()){
        socket.emit('createMessage', {
            from:'User',
            text:msgTextBox.val()
        }, function(){
            //Clear the input and disable the send button
            msgTextBox.val('');
            sendButton.attr('disabled','disabled');
        });
    }
});

locationButton.on('click',function(){
    locationButton.attr('disabled', 'disabled').text(buttonText.Sending);
    if (!navigator.geolocation) {
         alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage', {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }, function(){
            locationButton.removeAttr('disabled').text(buttonText.Default)
        });
    }, function(){
        locationButton.removeAttr('disabled').text(buttonText.Default);
         alert('Unable to fetch location');
    });
});
