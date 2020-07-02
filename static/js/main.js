document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //Collect users local storage
    var user_storage = window.localStorage;

    // When connected, configure buttons
    socket.on('connect', () => {
        socket.send('user has connected');
        //check if user is in local storage
        if (!user_storage.getItem('displayname')){

            document.getElementById("login_wrapper").style.display = 'flex';
            document.getElementById("chatwindow").style.display = 'none';

        };
        if (!user_storage.getItem('channel')){
            user_storage.setItem('channel','/general')
        }
        
        // TODO set general chatroom if no chatroom selected
    });

    socket.on('message', function(message) {

            const li = document.createElement('li');
            li.innerHTML = message;

            document.querySelector("#messages").append(li);

            return false;
    });

    socket.on('add_user', function(data){

        if (data["error"] != ""){
              //show error that username is taken
            alert('Username is taken, try again');

            return false;
        }
        else{
            //add user to local storage and enable chatrooms
            user_storage.setItem('displayname', data['displayname']);
            user_storage.setItem('channel', '/general');

            document.getElementById("login_wrapper").style.display = 'none';
            document.getElementById("chatwindow").style.display = 'flex';
        }
    });
    socket.on('disconnect', () => {
        socket.send('user disconnected');
    });

    document.querySelector('#sendbutton').onclick = () => {

            const msg = document.querySelector('#myMessage').value;

            socket.send(msg);
            
            document.querySelector('#myMessage').value = '';
    };

    document.querySelector('#logout').onclick = () => {
        // clears the whole user local storage    
        localStorage.clear();
        socket.emit('disconnect',{'msg':'user disconnected'});
        location.reload();

    };

    document.querySelector('#myForm').onsubmit = function() {

            // Collect display name from the form
            const displayname = document.getElementById('login').value;
            console.log('form has been submitted:'+displayname);
            socket.emit('new_user',{'displayname':displayname});

            return false;
    };
});


//localStorage.setItem("displayname", name)