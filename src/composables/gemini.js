export async function useGemini(langName, typeText, word) {
  const response = await fetch(
    `http://localhost:3000/api/askai?lang=${langName}&type=${typeText}&word=${word}`
  );

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
