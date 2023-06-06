import fido2.features

from flask import Flask, redirect, render_template, request, session

from secrets import token_bytes

import api

# Transforms bytes into JSON-friendly Base64 encoded strings.
fido2.features.webauthn_json_mapping.enabled = True

app = Flask(import_name=__name__, static_url_path='')

# Secret key for signing the session cookie
app.secret_key = token_bytes(nbytes=32)

# Registering the API blueprint
app.register_blueprint(blueprint=api.bp)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/register')
def register():
    return render_template('register.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/logout')
def logout():
    return render_template('logout.html')


@app.context_processor
def check_login_status():
    navs = None

    if 'username' in session:
        username = session['username']
        display_name = session['username']

        navs = [{'url': "/logout",
                 'name': 'Logout'}]
    else:
        navs = [{'url': '/login',
                 'name': 'Login'},
                {'url': '/register',
                 'name': 'Register'}]

    return dict(navs=navs)


if __name__ == '__main__':
    # Runs the server in an SSL context with an automatically created SSL-certificate.
    app.run(ssl_context='adhoc')
