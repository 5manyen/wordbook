import { ref } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';

export async function useGemini(promptText) {
  console.log(`[prompt] ${promptText}`);

  const generated = ref(null);
  const error = ref(null);

  const apiKey = import.meta.env.VITE_GEMINI_APIKEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(promptText);
  const response = result.response;
  if (response.candidates.length === 0) {
    error.value = 'responded no result.';
  } else {
    const text = response.text();
    generated.value = await marked(text);
  }
  return { generated, error };
}
