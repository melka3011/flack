import os

from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room
import json

app = Flask(__name__)
app.secret_key = (os.urandom(16))
socketio = SocketIO(app) 

# Keeps track of created channels and all messages
channels = {'General':[]}
# Keeps track of just the channel names
channel_list = []
# Keeps track of created user profiles and their sid's
users = {}
limit = 100

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_msg(json_data):
    try:
        data = json_data
        channel = data['current']
        print(channel)
        message = {'text':data['msg'],'user':data['user'],'time':data['time']}
        # Need to create a channel as a list to be able to append
        channels[channel].append(message)
        print(channels)
        if len(channels[channel])>limit:
            channels[channel].pop(0)
        emit('msg',{'user':message['user'],'text':message['text'],'time':message['time'],'channel':channel},room=channel)
    except TypeError:
        pass

@socketio.on('new_user')
def new_user(data):
    #checking the the users list if the display name is taken
    displayname = data['displayname']
    if displayname in users:
        error = 'Display name already in use. Please try another one,'
    else:
        error = ''
        users[displayname] = request.sid
        print (users)
    emit('add_user',{'displayname':displayname,'error':error})

@socketio.on('join')
def on_join(data):
    username = data['displayname']
    room = data['channel']
    join_room(room)
    emit('msg',{'text':username + ' has entered the room.','user':username,'time':''}, room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['displayname']
    room = data['channel']
    leave_room(room)
    emit('msg',{'text':username + ' has left the room.','user':username,'time':''}, room=room)

if __name__ == '__main__':
    socketio.run(app)