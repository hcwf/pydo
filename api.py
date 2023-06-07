'''
    Author: H. Frederich (h.frederich@protonmail.com)
    Date: 2023-06-07
    Version: 1.0.0
'''

from fido2.webauthn import PublicKeyCredentialRpEntity, PublicKeyCredentialUserEntity
from fido2.server import Fido2Server

from flask import abort, Blueprint, jsonify, request, session

import uuid

from db import user_database

# Creating a new relying party.
relying_party = PublicKeyCredentialRpEntity(name='FIDO2 Server', id='localhost')

# Creating a new FIDO2 server.
server = Fido2Server(rp=relying_party)

# Creating a new Flask blueprint for all API calls.
# url_prefix is used for all routes in this blueprint, making it easier to distinguish between API and non-API requests.
bp = Blueprint(name='api', import_name=__name__, url_prefix='/api')


@bp.route('/register/begin', methods=['POST'])
def api_register_begin():
    print('Received API request:', request.json)

    # Beginning the registration by creating a new user entity and providing a storage for credentials.
    options, state = server.register_begin(
        PublicKeyCredentialUserEntity(
            name=request.json['username'],
            id=uuid.uuid4().bytes,
            display_name=request.json['display_name']
        ),
        credentials=user_database,
        user_verification='discouraged'
    )

    print('Options:', dict(options))

    # Saving the internal state provided by 'register_begin()' to the Flask session.
    session['state'] = state

    print('State:', session['state'])

    # Saving the username and display name to the Flask session for later use.
    session['username'] = request.json['username']
    session['display_name'] = request.json['display_name']

    return jsonify(dict(options))


@bp.route('/register/complete', methods=['POST'])
def api_register_complete():
    print('Received API request:', request.json)

    # Completing the registration by providing the curren state of the session and the user request.
    authenticator_data = server.register_complete(state=session['state'], response=request.json)

    print('Created credential data:', authenticator_data.credential_data)

    # Adding the credentials to the "database".
    user_database.append(authenticator_data.credential_data)

    print('Registration complete!')

    return jsonify({'status': 'OK'})


@bp.route('/authenticate/begin', methods=['POST'])
def api_authenticate_begin():
    if not user_database:
        return abort(400, 'No credentials')

    # Beginning the authentication by loading the "database".
    options, state = server.authenticate_begin(credentials=user_database)

    # Saving the internal state provided by authenticate_begin() to the Flask session.
    session['state'] = state

    print('State:', session['state'])

    return jsonify(dict(options))


@bp.route('/authenticate/complete', methods=['POST'])
def api_authenticate_complete():
    if not user_database:
        return abort(400, 'No credentials')

    try:
        # Completing the authentication by verifying the user assertion data.
        # The state is removed from the session to make room for another registration.
        server.authenticate_complete(
            state=session.pop('state'),
            credentials=user_database,
            response=request.json
        )
    except:
        return abort(400, 'Wrong client data')

    return jsonify({'status': 'OK'})
