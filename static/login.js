import {get, parseRequestOptionsFromJSON} from './webauthn-json.browser-ponyfill.js';

'use strict';

async function authenticate() {
    let userData = {
        'username': document.getElementById('username').value
    };

    let request = await fetch('/api/authenticate/begin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    if(!request.ok) {
        document.getElementById('nocreds').hidden = false;
    }

    let json = await request.json();

    let options = parseRequestOptionsFromJSON(json);

    let response = await get(options);

    let result = await fetch('/api/authenticate/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
    });
    if(!result.ok) {
        document.getElementById('failure').hidden = false;
        throw new Error('There was an error with your authentication.');
    }
    document.getElementById('success').hidden = false;
    console.log('Authentication successful!');
    console.log(result.json());

    window
}

document.getElementById('authenticate').addEventListener('click', () => {
    authenticate();
    document.getElementById('success').hidden = true;
    document.getElementById('failure').hidden = true;
    document.getElementById('nocreds').hidden = true;
});