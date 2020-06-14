import os

from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, emit
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputRequired, Length, EqualTo, ValidationError

app = Flask(__name__)
app.secret_key = (os.urandom(16))
socketio = SocketIO(app) 

class RegistrationForm(FlaskForm):
    displayname = StringField('displayname',
        validators=[
            InputRequired(message="Displayname Required"),
            Length(min=4, max=25, message="Display Name must be between 4 and 25 char long")
        ])
        
    def validate_displayname(self, displayname):
        if displayname.data in users:
            raise ValidationError('Display Name already exists')

# Keeps track of created channels
channels = []
# Keeps track of created user profiles
users = ['Luka','Marko']

@app.route("/", methods=["POST","GET"])
def index():
    form = RegistrationForm()
    if form.validate():
        users.append(request.form('displayname'))
        return redirect('/success')
    return render_template('index.html', form=form)

@app.route("/success")
def success():
    return "Sucess!"
    
if __name__ == '__main__':
    socketio.run(app)