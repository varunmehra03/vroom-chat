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
    let li = jQuery('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);
    jQuery("#messages").append(li);
});


socket.on('newLocationMessage', function(msg){
    console.log('newLocationMessage');
    console.log(msg);
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My Current Location</a>');
    a.attr('href',msg.url);
    li.text(`${msg.from}: `);
    li.append(a);
    jQuery("#messages").append(li);
});


jQuery('#chat-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage', {
        from:'User',
        text:jQuery('input[name=message]').val()
    }, function(serverResp){
        console.log(serverResp);
    });
});

var locationButton = jQuery('#send-location');
if(locationButton){
    locationButton.on('click',function(e){
        if (!navigator.geolocation) {
             alert('Geolocation is not supported by your browser')
        }
        navigator.geolocation.getCurrentPosition(function(position){
            socket.emit('createLocationMessage', {
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            }, function(serverResp){
                console.log(serverResp);
            });
        }, function(){
             alert('Unable to fetch location')
        });
    });
}