import { kv } from '@vercel/kv';

export const useApiUtility = () => {
  const allowOrigin = 'http://127.0.0.1:5173';

  function errorResponse(message = 'Something went wrong!', status = 400) {
    return new Response(JSON.stringify(message), {
      status: status,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin
      }
    });
  }

  function okResponse(data) {
    return new Response(JSON.stringify(data), {
      headers: {
        'Access-Control-Allow-Origin': allowOrigin
      }
    });
  }

  async function kvSet(key, obj) {
    try {
      await kv.hset(key, obj);
      return true;
    } catch (e) {
      console.log('an error occurred as setting value into kv.');
      console.log(e);
      return false;
    }
  }

  async function kvGet(key, field) {
    try {
      const value = await kv.hget(key, field);
      return value;
    } catch (e) {
      console.log('an error occurred as retrieving value from kv.');
      console.log(e);
      return null;
    }
  }

  async function kvGetAll(key) {
    try {
      const obj = await kv.hgetall(key);
      return obj;
    } catch (e) {
      console.log('an error occurred as retrieving value from kv.');
      console.log(e);
      return null;
    }
  }

  async function kvDel(key) {
    try {
      const obj = await kv.del(key);
      return obj;
    } catch (e) {
      console.log('an error occurred as deleting value from kv.');
      console.log(e);
      return null;
    }
  }

  return { errorResponse, okResponse, kvSet, kvGet, kvGetAll, kvDel };
};
