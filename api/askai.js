import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import { useApiUtility } from './_utility.js';

export async function POST(request) {
  const body = await request.json();
  const lang = body.lang;
  const word = body.word;
  const type = body.type;

  const util = useApiUtility();

  if (!lang || !word || !type) {
    return util.errorResponse();
  }

  const typeText = type && type !== 'other' ? `${type}` : '';
  const prompt = `You are an expert of ${lang}.
  Explain grammatical details of a ${lang} ${typeText} "${word}".`;

  const apiKey = process.env.GEMINI_APIKEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('prompt: ' + prompt);
  const result = await model.generateContent(prompt);
  const response = result.response;
  if (response.candidates.length === 0) {
    return util.okResponse('no result responded.');
  } else {
    const text = response.text();
    const markdown = await marked(text);
    return util.okResponse({ prompt, markdown });
  }
}
