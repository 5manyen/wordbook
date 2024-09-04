export function useFirebase() {
  return {
    logIn,
    signUp,
    fetchWordData,
    updateWordData
  };
}

async function logIn(userName, pass) {
  const apiKey = import.meta.env.VITE_FIREBASE_APIKEY;
  const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  const payload = {
    email: `${userName}@wordbook.test.com`,
    password: pass,
    returnSecureToken: true
  };
  const option = {
    method: 'POST',
    body: JSON.stringify(payload)
  };
  console.log('login start...');
  const response = await fetch(authUrl, option);
  const result = {
    userData: {
      uid: null,
      idToken: null,
      userName: userName
    },
    error: false
  };
  if (response.ok) {
    console.log('login completed.');
    const json = await response.json();
    result.userData.uid = json.localId;
    result.userData.idToken = json.idToken;
  } else {
    result.error = true;
  }
  return result;
}

async function signUp(userName, pass) {
  const apiKey = import.meta.env.VITE_FIREBASE_APIKEY;
  const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
  const payload = {
    email: `${userName}@wordbook.test.com`,
    password: pass,
    returnSecureToken: true
  };
  const option = {
    method: 'POST',
    body: JSON.stringify(payload)
  };
  console.log('signup start...');
  const response = await fetch(authUrl, option);
  const result = {
    userData: {
      uid: null,
      idToken: null,
      userName: userName
    },
    error: false
  };
  if (response.ok) {
    console.log('signup completed.');
    const json = await response.json();
    const uid = json.localId;
    const idToken = json.idToken;
    result.userData.uid = uid;
    result.userData.idToken = idToken;

    const template = {
      userName: userName,
      words: {},
      languages: []
    };
    const updated = await updateWordData(uid, idToken, template);
    if (!updated) {
      result.error = true;
    }
  } else {
    result.error = true;
  }
  return result;
}

async function fetchWordData(uid, idToken) {
  console.log('words fetch start...');
  const baseUrl = import.meta.env.VITE_FIREBASE_DOMAIN_DATA;
  const wordsUrl = `${baseUrl}/users/${uid}/data.json?auth=${idToken}`;
  const response = await fetch(wordsUrl);

  if (response.ok) {
    console.log('words fetch completed.');
    const wordData = await response.json();
    return wordData;
  }
}

async function updateWordData(uid, idToken, wordData) {
  console.log('words update start...');
  const baseUrl = import.meta.env.VITE_FIREBASE_DOMAIN_DATA;
  const wordsUrl = `${baseUrl}/users/${uid}/data.json?auth=${idToken}`;
  const option = {
    method: 'PATCH',
    body: JSON.stringify(wordData)
  };
  const response = await fetch(wordsUrl, option);
  console.log('words update completed.');
  return response.ok;
}
