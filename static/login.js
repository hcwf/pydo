/**
 * Author: H. Frederich (h.frederich@protonmail.com)
 * Date: 2023-06-16
 * Version: 1.0.2
 */

import {get, parseRequestOptionsFromJSON} from './webauthn-json.browser-ponyfill.js';

'use strict';

async function authenticate() {
    let request = await fetch('/api/authenticate/begin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(!request.ok) {
        document.getElementById('no_creds').hidden = false;
    }

    let json = await request.json();

    let response = await get(parseRequestOptionsFromJSON(json));

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

    // Wait three seconds before redirecting the user to the starting page.
    // This is to show the login was successful.
    setTimeout(() => {
        window.location.replace('/');
    }, 5000);
}

document.getElementById('authenticate').addEventListener('click', () => {
    authenticate();
    document.getElementById('success').hidden = true;
    document.getElementById('failure').hidden = true;
    document.getElementById('no_creds').hidden = true;
});