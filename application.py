import os

from flask import Flask, render_template, request, session, redirect, url_for, g
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.secret_key = (os.urandom(16))
socketio = SocketIO(app)

# Keeps track of created channels
channels = []
# Keeps track of created user profiles
users = []

@app.route("/")
def index():
    return render_template('index.html')


'''
@app.route("/login", methods=["POST","GET"])
def login():
    if request.method == "POST":
        # Fetches the username from the form
        new_user = request.form['displayname']

        # Removes existing session
        session.pop('user', None)

        # Checks for length of username, can't be empty
        if len(new_user) < 1 or new_user == '':
            return render_template('error.html', message="Display name can't be empty")

        # Check if the display name is taken
        if new_user in users:
            return render_template('error.html', message="User already exists")

        # Add the username to the list of users
        users.append(new_user)

        # Creates a session with the username
        session['user'] = new_user

        # Creates a permanent session, keeping user logged in after browser close
        session.permanent = True

        return redirect(url_for('index'))
    else:
        return render_template('login.html')

@app.route("/logout")
def logout():
    g.user = None
    session.pop('user', None)
    return redirect(url_for('index'))

@app.route()
def error(error):
    return render_template('error.html', error=error)

@app.before_request
def before_request():
    g.user = None

    if 'user' in session:
        g.user = session['user']
'''
if __name__ == '__main__':
    socketio.run(app)