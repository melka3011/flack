document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
        socket.send('user has connected');
    });

    socket.on('message', function(message) {
            
            const li = document.createElement('li');
            li.innerHTML = message;

            document.querySelector("#messages").append(li);

            return false;
    });

    document.querySelector('#sendbutton').onclick = () => {

            const msg = document.querySelector('#myMessage').value;

            socket.send(msg);

            document.querySelector('#myMessage').value = '';
    };
});


//localStorage.setItem("displayname", name)