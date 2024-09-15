import { useApiUtility } from './_utility.js';
import { refreshIfNecessary } from './auth.js';

export async function PATCH(request) {
  const body = await request.json();
  const uid = body.uid;
  const wordData = body.wordData;

  const util = useApiUtility();

  if (!uid || !wordData) {
    return util.errorResponse('Invalid parameter: uid, wordData must be set in patch method.');
  }

  const checkResult = await refreshIfNecessary(uid);
  if (!checkResult.ok) {
    return util.errorResponse('Token expired. Re-authentication required.');
  }
  const idToken = await util.kvGet(uid, 'idToken');

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

  const util = useApiUtility();

  if (!uid) {
    return util.errorResponse('Invalid parameter: uid must be set in post method.');
  }

  const checkResult = await refreshIfNecessary(uid);
  if (!checkResult.ok) {
    return util.errorResponse('Token expired. Re-authentication required.');
  }

  const idToken = await util.kvGet(uid, 'idToken');

  const baseUrl = process.env.FIREBASE_DOMAIN_DATA;
  const wordsUrl = `${baseUrl}/users/${uid}/data.json?auth=${idToken}`;
  const response = await fetch(wordsUrl);
  if (response.ok) {
    const wordData = await response.json();
    return util.okResponse(wordData);
  }
  return util.okResponse({});
}
