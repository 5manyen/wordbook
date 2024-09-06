export function useApi() {
  return { callAskaiApi, callAuthApi, callWordApi };
}

async function callAskaiApi(langName, typeText, word) {
  const askaiUrl = '/api/askai';
  const option = {
    method: 'POST',
    body: JSON.stringify({
      lang: langName,
      type: typeText,
      word: word
    })
  };
  const response = await fetch(askaiUrl, option);

  const result = {
    error: false,
    content: null
  };

  if (!response.ok) {
    result.error = true;
    result.content = response.status;
  } else {
    const json = await response.json();
    result.content = json.markdown;
  }
  return result;
}
async function callAuthApi(userName, password, mode) {
  const authApi = '/api/auth';
  const option = {
    method: 'POST',
    body: JSON.stringify({
      userName: userName,
      password: password,
      mode: mode
    })
  };
  const response = await fetch(authApi, option);
  const result = {
    userData: {
      uid: null,
      idToken: null,
      userName: userName
    },
    error: false
  };
  if (response.ok) {
    const json = await response.json();
    const uid = json.uid;
    const idToken = json.idToken;
    if (uid && idToken) {
      result.userData.uid = uid;
      result.userData.idToken = idToken;

      if (mode !== 'login') {
        const template = {
          userName: userName,
          words: {},
          languages: []
        };
        const updated = await callWordApi(uid, idToken, template);
        if (!updated) {
          result.error = true;
        }
      }
    } else {
      result.error = true;
    }
  } else {
    result.error = true;
  }
  return result;
}
async function callWordApi(uid, idToken, wordData) {
  const wordUrl = '/api/word';
  const method = wordData ? 'PATCH' : 'POST';
  const option = {
    method: method,
    body: JSON.stringify({
      uid: uid,
      idToken: idToken,
      wordData: wordData
    })
  };
  const response = await fetch(wordUrl, option);
  return method === 'PATCH' ? response.ok : await response.json();
}
