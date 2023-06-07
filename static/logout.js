'use strict';

async function logout() {
    let userData = {
        'username': document.getElementById()
    }

    let request = await fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify()
    })
}

document.onload(logout());