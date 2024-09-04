import { computed, ref, toValue, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import { useUserStore } from './user';
import { wordData, wordTypeData } from './data/wordData';
import { langData } from './data/langData';
import { useFirebase } from '@/composables/firebase';

export const useWordStore = defineStore('word', () => {
  const userStore = useUserStore();
  const currentUser = computed(() => userStore.currentUser);

  const wordTypes = wordTypeData;

  const userWords = ref(null);

  const filterCondition = ref({
    byLetter: '',
    byType: []
  });

  async function loadUserWords() {
    const firebase = useFirebase();
    const wordData = await firebase.fetchWordData(currentUser.value.uid, currentUser.value.idToken);
    if (wordData) {
      userWords.value = wordData;
      return;
    }
  }

  const userLanguages = computed(() => {
    return userWords.value?.languages || [];
  });

  const userTabs = computed(() => {
    const userTabs = [];
    userLanguages.value.forEach((userLang) => {
      const langDetail = langData[userLang];
      const userTab = {
        key: userLang,
        ...langDetail
      };
      userTabs.push(userTab);
    });
    return userTabs;
  });

  const currentTab = ref(null);

  function setCurrentTab(value) {
    currentTab.value = value;
  }

  watch(userTabs, () => {
    if (userTabs.value.length > 0) {
      setCurrentTab(userTabs.value[0].key);
    }
  });

  watch(currentTab, (to, from) => {
    console.log('currentTab changed from: ' + from + ' to ' + to);
  });

  const filteredWords = computed(() => {
    let filteredWords = [];
    if (userWords.value && currentTab.value) {
      filteredWords = userWords.value.words[currentTab.value];
      const letters = filterCondition.value.byLetter;
      if (letters !== '') {
        filteredWords = filteredWords.filter((word) => word.text.includes(letters));
      }
      const types = filterCondition.value.byType;
      if (types?.length > 0) {
        filteredWords = filteredWords.filter((word) => types.includes(word.type));
      }
    }
    return filteredWords;
  });

  const supportLang = ['EN', 'ES', 'NL'];

  function getWord(lang, id) {
    return userWords.value.words[lang].find((word) => word.id === id);
  }

  async function addWord(text, type, description, lang) {
    const newWord = {
      id: Date.now(),
      text: text,
      type: type,
      description: description
    };
    const userLangList = userWords.value.languages || [];
    const userWordsObject = userWords.value.words || {};
    if (!userLangList.includes(lang)) {
      userLangList.push(lang);
      userWords.value.languages = userLangList;
    }
    if (!Object.hasOwn(userWordsObject, lang)) {
      userWordsObject[lang] = [newWord];
      userWords.value.words = userWordsObject;
    } else {
      userWords.value.words[lang].push(newWord);
    }
    if (!currentTab.value) {
      currentTab.value = lang;
    }

    const firebase = useFirebase();
    const result = await firebase.updateWordData(
      currentUser.value.uid,
      currentUser.value.idToken,
      userWords.value
    );
    return result;
  }

  async function editWord(lang, id, text, type, description) {
    const index = userWords.value.words[lang].findIndex((word) => word.id === id);
    if (index > -1) {
      const edited = {
        id: id,
        text: text,
        type: type,
        description: description
      };
      userWords.value.words[lang].splice(index, 1, edited);
      const firebase = useFirebase();
      const result = await firebase.updateWordData(
        currentUser.value.uid,
        currentUser.value.idToken,
        userWords.value
      );
      return result;
    }
    return false;
  }

  async function deleteWord(lang, id) {
    const index = userWords.value.words[lang].findIndex((word) => word.id === id);
    if (index > -1) {
      userWords.value.words[lang].splice(index, 1);
      const firebase = useFirebase();
      const result = await firebase.updateWordData(
        currentUser.value.uid,
        currentUser.value.idToken,
        userWords.value
      );
      return result;
    }
    return false;
  }

  function getType(key) {
    const foundType = wordTypes[key];
    return foundType;
  }

  function getTypeKeys() {
    const keys = Object.keys(wordTypes);
    return keys;
  }

  function obtainLangName(langKey) {
    return langData[langKey].engName;
  }

  function setFilterCondition(byLetter = '', byType = []) {
    filterCondition.value = {
      byLetter,
      byType
    };
  }

  function clearFilterCondition() {
    setFilterCondition();
  }

  function clearWordData() {
    clearFilterCondition();
    userWords.value = null;
    setCurrentTab(null);
  }

  function initialize() {
    clearWordData();
    loadUserWords();
  }

  return {
    userLanguages,
    filteredWords,
    userTabs,
    currentTab,
    supportLang,
    getWord,
    addWord,
    editWord,
    deleteWord,
    getType,
    setFilterCondition,
    clearFilterCondition,
    obtainLangName,
    getTypeKeys,
    setCurrentTab,
    initialize,
    clearWordData
  };
});
