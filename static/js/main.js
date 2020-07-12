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

            return false;
        };
        if (!user_storage.getItem('channel')){
            user_storage.setItem('channel','General')
        }
        const displayname = user_storage.getItem('displayname');
        const active_channel = user_storage.getItem('channel')
        const time = new Date().toLocaleString();

        socket.emit('join',{'channel':active_channel,'message':'has joined the room','displayname':displayname,'time':time});

    });

    socket.on('msg', function(data) {

            const div = document.createElement('div');
            const div_msg = document.createElement('div');
            const div_img = document.createElement('div');
            const span = document.createElement('span');

            //Checks if the message is from user or from someone else and puts the message from user to the right, others to the left
            if(data['user']==user_storage['displayname']){
                div.className = 'd-flex justify-content-end mb-4';
                div_msg.className = 'msg_cotainer_send';
                span.className = 'msg_time_send';
            }
            else{
                div.className = 'd-flex justify-content-start mb-4';
                div_msg.className = 'msg_cotainer';
                span.className = 'msg_time';
            }
            
            span.innerHTML = data['time'];
            div_img.className = 'img_cont_msg';
            div_msg.innerHTML = data['text'];
            
            div_msg.appendChild(span);
            div.appendChild(div_img);
            div.appendChild(div_msg);
            
            document.querySelector("#messages").appendChild(div);

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
            user_storage.setItem('channel', 'General');

            document.getElementById("login_wrapper").style.display = 'none';
            document.getElementById("chatwindow").style.display = 'flex';
        }
    });
    socket.on('disconnect', () => {
        socket.send('user disconnected');
    });

    document.querySelector('#sendbutton').onclick = () => {

            const msg = document.querySelector('#myMessage').value;
            const user = user_storage.getItem('displayname');
            const current_channel = user_storage.getItem('channel');
            const time = new Date().toLocaleString();
            console.log(msg,user,current_channel,time)
            socket.emit('message',{'msg':msg,'user':user,'current':current_channel,'time':time});
            
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

//function loadMessages(data){
    // for message in channel create div element like in msg socket
//}
//localStorage.setItem("displayname", name)