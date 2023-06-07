# PYDO - A FIDO2 Implementation

## About

PYDO is a basic FIDO2 implementation including a server and a web app. It has no database or intricate user management, 
it only works on Flask sessions.

PYDO runs on a Python Flask web application and uses Jinja templates and JavaScript as frontend.

**IMPORTANT**

This is not for use in a production environment! Only run this server locally!

## How to Run

1. Download or clone this repo, either by going to releases and downloading a provided zip (and unpacking it to a new
directory) or running 
`git clone https://github.com/hcwf/pydo` in a new directory.
2. Open a shell / terminal in the directory and install the requirements by running `pip install -r requirements.txt`.
3. Start the server by running `py .\server.py`.
4. Open your browser and navigate to https://localhost:5000 / https://127.0.0.1:5000. Make sure to use HTTPS, otherwise
you won't be able to see or use the web interface, as WebAuthn requires a SSL certificate to work.
5. Register a new account and log in! User accounts only last as long as the server is running.