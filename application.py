import os

from flask import Flask,render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/chatrooms")
def chatrooms():
    return render_template('chatrooms.html')
