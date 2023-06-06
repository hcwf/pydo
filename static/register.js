import {create, parseCreationOptionsFromJSON} from './webauthn-json.browser-ponyfill.js';

'use strict';

async function register() {
    // Reading the username and display name to send with the fetch request.
    let userData = {
        'username': document.getElementById('username').value,
        'display_name': document.getElementById('dp-name').value,
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

    const options = parseCreationOptionsFromJSON(json);

    const response = await create(options);

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
}

document.getElementById('register').addEventListener('click', () => {
    register();
    document.getElementById('success').hidden = true;
    document.getElementById('failure').hidden = true;
});