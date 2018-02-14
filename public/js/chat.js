const sendButton = jQuery('#send-message');
const msgTextBox = jQuery('input[name=message]');
const chatForm = jQuery('#chat-form');
const locationButton = jQuery('#send-location');
const messagesElem = jQuery('#messages');
const buttonText = {'Sending':'Sending location...', 'Default':'Send location'};


function scrollToBottom(){
    let clientHeight = messagesElem.prop('clientHeight');
    let scrollTop = messagesElem.prop('scrollTop');
    let scrollHeight = messagesElem.prop('scrollHeight');
    const newMessageElem = messagesElem.children('li:last-child');
    let newMessageHeight = newMessageElem.innerHeight();
    let lastMessageHeight = newMessageElem.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messagesElem.scrollTop(scrollHeight);
    }

}

var socket = io();
socket.on('connect',function(){
    var params = jQuery.deparam(window.location.search);
    socket.emit('join',params, function(err){
        if(err){
            alert(err);
            window.location.href='/';
        }
    });
    console.log('Connected to server...');
});
socket.on('disconnect', function(){
    console.log('Disconnected from server...');
});

socket.on('updateUserList', function(users){
    console.log('Users List', users);
    let ol = jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
        jQuery('#users').html(ol);
    })
});

socket.on('newMessage', function(msg) {
    let template = jQuery('#message-template').html();
    let formattedTime = moment(msg.createdAt).format('h:mm:ss a');
    let html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

//     // let formattedTime = moment(msg.createdAt).format('h:mm:ss a');
//     // let li = jQuery('<li></li>');
//     // li.text(`${msg.from} ${formattedTime}: ${msg.text}`);
//     // jQuery("#messages").append(li);
// });

socket.on('newLocationMessage', function(msg){
    let template = jQuery('#location-template').html();
    let formattedTime = moment(msg.createdAt).format('h:mm:ss a');
    let html = Mustache.render(template, {
        url: msg.url,
        from: msg.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();

    //
    // let formattedTime = moment(msg.createdAt).format('h:mm:ss a');
    // let li = jQuery('<li></li>');
    // let a = jQuery('<a target="_blank">My Current Location</a>');
    // a.attr('href',msg.url);
    // li.text(`${msg.from} ${formattedTime}: `);
    // li.append(a);
    // jQuery("#messages").append(li);
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
