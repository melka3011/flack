from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputReqired, Length, EqualTo

class RegistrationForm(FlaskForm):
    """ Registration Form """

    displayname = StringField('displayname',)