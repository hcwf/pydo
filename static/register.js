/**
 * Author: H. Frederich (h.frederich@protonmail.com)
 * Date: 2023-06-16
 * Version: 1.0.2
 */

import {create, parseCreationOptionsFromJSON} from './webauthn-json.browser-ponyfill.js';

'use strict';

async function register() {
    // Reading the username and display name to send with the fetch request.
    let userData = {
        'username': document.getElementById('username').value,
        'display_name': document.getElementById('display_name').value,
    };

    console.log('Fetching registration challenge:', userData);
    let request = await fetch('/api/register/begin', {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    console.log('Fetch complete:', request.statusText);
    let json = await request.json();

    const response = await create(parseCreationOptionsFromJSON(json));

    console.log('Completing registration')
    let result = await fetch('/api/register/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
    });
    if(!result.ok) {
        document.getElementById('failure').hidden = false;
        throw new Error('There was an error with your registration.');
    }
    document.getElementById('success').hidden = false;
    console.log('Registration successful!');
    console.log(result.json());

    // Wait three seconds before redirecting the user to the login.
    // This is to show the registration was successful.
    setTimeout(() => {
        window.location.replace('/login');
    }, 5000);
}

document.getElementById('register').addEventListener('click', () => {
    if(document.getElementById('username').value.length > 1 && document.getElementById('display_name').value.length > 1) {
        register();
        document.getElementById('success').hidden = true;
        document.getElementById('failure').hidden = true;
        document.getElementById('too_short').hidden = true;
    } else {
        document.getElementById('too_short').hidden = false;
    }
});