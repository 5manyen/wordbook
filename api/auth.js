import { useApiUtility } from './_utility.js';
const util = useApiUtility();

export async function POST(request) {
  const body = await request.json();
  const mode = body.mode;

  if (!mode) {
    return util.errorResponse('Invalid parameter: mode must be set.');
  }

  if (mode === 'refresh') {
    const uid = body.uid;
    if (uid) {
      return await refreshIfNecessary(uid);
    }
    return util.errorResponse('Invalid parameter: uid must be set when mode is set to refresh.');
  } else if (mode === 'logout') {
    const uid = body.uid;
    if (uid) {
      return await logout(uid);
    }
    return util.errorResponse('Invalid parameter: uid must be set when mode is set to logout.');
  } else {
    const userName = body.userName;
    const password = body.password;
    if (!userName || !password) {
      return util.errorResponse(
        'Invalid parameter: username and password must be set when mode is either login or signup.'
      );
    }
    if (mode === 'login') {
      return await authenticate(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword',
        userName,
        password
      );
    } else if (mode === 'signup') {
      return await authenticate(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp',
        userName,
        password
      );
    }
    return util.errorResponse('Invalid parameter: mode value was invalid.');
  }
}

async function authenticate(endpoint, userName, password) {
  const apiKey = process.env.FIREBASE_APIKEY;
  const authUrl = `${endpoint}?key=${apiKey}`;

  const payload = {
    email: `${userName}@wordbook.test.com`,
    password: password,
    returnSecureToken: true
  };
  const option = {
    method: 'POST',
    body: JSON.stringify(payload)
  };

  try {
    const result = await fetch(authUrl, option);
    if (result.ok) {
      const json = await result.json();
      const uid = json.localId;
      const idToken = json.idToken;
      const expiresIn = json.expiresIn;
      const refreshToken = json.refreshToken;
      const expiration = new Date().getTime() + expiresIn * 1000;
      const kvResult = await util.kvSet(uid, { idToken, expiration, refreshToken });
      if (!kvResult) {
        return util.errorResponse('Storing session failed.');
      }
      return util.okResponse({ uid });
    }
    return util.errorResponse('Authentication failed.');
  } catch (err) {
    return util.errorResponse('Unexpected error occurred as authenticating.');
  }
}

async function logout(uid) {
  try {
    const result = await util.kvDel(uid);
    if (!result) {
      return util.errorResponse('Deleting session failed.');
    }
    return util.okResponse({ result: true });
  } catch (err) {
    return util.errorResponse('Unexpected error occurred as deleting session.');
  }
}

export async function refreshIfNecessary(uid) {
  const session = await util.kvGetAll(uid);
  const expiration = session.expiration;
  const threshold = process.env.EXPIRATION_THRESHOLD;
  const isExpired = new Date().getTime() - expiration < threshold;

  if (isExpired) {
    const apiKey = process.env.FIREBASE_APIKEY;
    const url = `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;
    const refreshToken = session.refreshToken;
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };
    const option = {
      method: 'POST',
      body: JSON.stringify(payload)
    };

    try {
      const result = await fetch(url, option);
      if (result.ok) {
        const json = await result.json();
        const newIdToken = json.id_token;
        const newExpiresIn = json.expires_in;
        const newExpiration = new Date().getTime() + newExpiresIn * 1000;
        const newRefreshToken = json.refresh_token;
        const kvResult = await util.setKv(uid, {
          idToken: newIdToken,
          expiration: newExpiration,
          refreshToken: newRefreshToken
        });
        if (kvResult) {
          return util.okResponse({ refreshed: true });
        }
        return util.errorResponse('Refreshing session failed.');
      }
    } catch (err) {
      return util.errorResponse('Unexpected error occurred as refreshing session.');
    }
  }

  return util.okResponse({ refreshed: false });
}
