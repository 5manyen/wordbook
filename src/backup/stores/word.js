import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useWordStore = defineStore('word', () => {
  const words = ref([
    {
      id: 1,
      text: 'atlas',
      type: 'noun',
      description: 'The seal has an atlas.'
    },
    {
      id: 2,
      text: 'rebellious',
      type: 'adjective',
      description: 'The rebellious seals destroyed almost everything.'
    },
    {
      id: 3,
      text: 'shift',
      type: 'verb',
      description: 'The seal is shifted to the other pool.'
    }
  ]);
  //   const words = computed(() => count.value * 2);
  function addWord(text, type, description) {
    const newWord = {
      id: Date.now(),
      text: text,
      type: type,
      description: description
    };
    words.value.push(newWord);
  }

  return { words, addWord };
});
