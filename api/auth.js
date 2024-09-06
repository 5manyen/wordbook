import { useApiUtility } from './_utility.js';

export async function POST(request) {
  const body = await request.json();
  const userName = body.userName;
  const password = body.password;
  const mode = body.mode;

  const util = useApiUtility();

  if (!userName || !password || !mode) {
    return util.errorResponse();
  }

  const apiKey = process.env.VITE_FIREBASE_APIKEY;
  const authUrl =
    mode === 'login'
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

  const payload = {
    email: `${userName}@wordbook.test.com`,
    password: password,
    returnSecureToken: true
  };
  const option = {
    method: 'POST',
    body: JSON.stringify(payload)
  };

  const result = await fetch(authUrl, option);
  const json = await result.json();
  const uid = json.localId;
  console.log(uid);
  const idToken = json.idToken;
  return util.okResponse({ uid, idToken });
}
