# Author: H. Frederich (h.frederich@protonmail.com)
# Date: 2023-06-16
# Version: 1.0.2

import fido2.features

from flask import Flask, redirect, render_template, session

from secrets import token_bytes

import api

# Transforms bytes into JSON-friendly Base64 encoded strings.
fido2.features.webauthn_json_mapping.enabled = True

# Creating a new Flask app.
app = Flask(import_name=__name__, static_url_path='')

# Secret key for signing the session cookie.
app.secret_key = token_bytes(nbytes=32)

# Registering the API blueprint.
app.register_blueprint(blueprint=api.bp)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/register')
def register():
    if check_login_status():
        return redirect('/')

    return render_template('register.html')


@app.route('/login')
def login():
    if check_login_status():
        return redirect('/')

    return render_template('login.html')


@app.route('/logout')
def logout():
    # Removing the user information from the session, thereby logging them out.
    session.pop('username')
    session.pop('display_name')

    return redirect('/')


@app.context_processor
def display_status():
    if check_login_status():
        return dict(login=True)

    return dict(login=False)


def check_login_status():
    if 'username' in session:
        return True

    return False


if __name__ == '__main__':
    # Runs the server in an SSL context with an automatically created SSL-certificate.
    app.run(ssl_context='adhoc')
