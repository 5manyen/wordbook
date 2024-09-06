import { useApiUtility } from './_utility.js';

export async function PATCH(request) {
  const body = await request.json();
  const uid = body.uid;
  const idToken = body.idToken;
  const wordData = body.wordData;

  const util = useApiUtility();

  if (!uid || !idToken || !wordData) {
    return util.errorResponse();
  }

  const baseUrl = process.env.FIREBASE_DOMAIN_DATA;
  const wordsUrl = `${baseUrl}/users/${uid}/data.json?auth=${idToken}`;
  const option = {
    method: 'PATCH',
    body: JSON.stringify(wordData)
  };
  return await fetch(wordsUrl, option);
}

export async function POST(request) {
  const body = await request.json();
  const uid = body.uid;
  const idToken = body.idToken;

  const util = useApiUtility();

  if (!uid || !idToken) {
    return util.errorResponse();
  }

  const baseUrl = process.env.FIREBASE_DOMAIN_DATA;
  const wordsUrl = `${baseUrl}/users/${uid}/data.json?auth=${idToken}`;
  const response = await fetch(wordsUrl);
  if (response.ok) {
    const wordData = await response.json();
    return util.okResponse(wordData);
  }
  return util.okResponse({});
}
