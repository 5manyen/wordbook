import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const lang = params.get('lang');
  const word = params.get('word');
  const type = params.get('type');

  const allowOrigin = 'http://127.0.0.1:5173';

  if (!lang || !word || !type) {
    return new Response('Invalid parameters.', {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin
      }
    });
  }

  const typeText = type && type !== 'other' ? `${type}` : '';
  const prompt = `You are an expert of ${lang}.
  Explain grammatical details of a ${lang} ${typeText} "${word}".`;

  const apiKey = process.env.VITE_GEMINI_APIKEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('prompt: ' + prompt);
  const result = await model.generateContent(prompt);
  const response = result.response;
  if (response.candidates.length === 0) {
    return new Response('no result.', {
      headers: {
        'Access-Control-Allow-Origin': 'http://127.0.0.1:5173'
      }
    });
  } else {
    const text = response.text();
    const markdown = await marked(text);
    return new Response(JSON.stringify({ prompt, markdown }), {
      headers: {
        'Access-Control-Allow-Origin': 'http://127.0.0.1:5173'
      }
    });
  }
}
