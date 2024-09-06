export const useApiUtility = () => {
  const allowOrigin = 'http://127.0.0.1:5173';

  function errorResponse() {
    return new Response('Invalid parameters.', {
      status: 400,
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

  return { errorResponse, okResponse };
};
