export function useApi() {
  return { callAskaiApi, callWordApi, login, signup, logout };
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

async function login(userName, password) {
  const option = {
    method: 'POST',
    body: JSON.stringify({
      userName: userName,
      password: password,
      mode: 'login'
    })
  };
  const json = await callAuthApi(option);
  if (json) {
    const userData = { uid: json.uid };
    return userData;
  }
}

async function signup(userName, password) {
  const option = {
    method: 'POST',
    body: JSON.stringify({
      userName: userName,
      password: password,
      mode: 'signup'
    })
  };
  const json = await callAuthApi(option);
  if (json) {
    const uid = json.uid;
    const userData = { uid };
    const template = {
      userName: userName,
      words: {},
      languages: []
    };
    const updated = await callWordApi(uid, template);
    if (!updated) {
      return null;
    }

    return userData;
  }
}

async function logout(uid) {
  const option = {
    method: 'POST',
    body: JSON.stringify({
      uid,
      mode: 'logout'
    })
  };
  callAuthApi(option);
}

async function callAuthApi(option) {
  const authApi = '/api/auth';
  const response = await fetch(authApi, option);
  if (response.ok) {
    const json = await response.json();
    return json;
  }
}

async function callWordApi(uid, wordData) {
  const wordUrl = '/api/word';
  const method = wordData ? 'PATCH' : 'POST';
  const option = {
    method: method,
    body: JSON.stringify({
      uid: uid,
      wordData: wordData
    })
  };
  const response = await fetch(wordUrl, option);
  console.log('method: ' + method + ', result: ' + response.ok);
  if (method === 'PATCH') {
    return response.ok;
  } else {
    console.log('POST result: ' + response.ok);
    console.log(response);
    if (response.ok) {
      return await response.json();
    }
    return null;
  }
}
