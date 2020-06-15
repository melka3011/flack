import os

from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room

app = Flask(__name__)
app.secret_key = (os.urandom(16))
socketio = SocketIO(app) 

# Keeps track of created channels
channels = {}
# Keeps track of created user profiles
users = ['Luka','Marko']

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)
    send(message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app)