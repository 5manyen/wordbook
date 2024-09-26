import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';

import { useUserStore } from './user';
import { wordTypeData } from './data/wordData';
import { langData } from './data/langData';
import { useApi } from '@/composables/api';

export const useWordStore = defineStore('word', () => {
  const userStore = useUserStore();
  const currentUser = computed(() => userStore.currentUser);

  const wordTypes = wordTypeData;

  const userWords = ref(null);

  const isProcessing = ref(false);

  const filterCondition = ref({
    byLetter: '',
    byType: []
  });

  const sortDefs = [
    {
      name: 'Date Asc',
      otherName: 'date↑',
      value: 1
    },
    {
      name: 'Date Desc',
      otherName: 'date↓',
      value: 2
    },
    {
      name: 'Alph Asc',
      otherName: 'abc↑',
      value: 3
    },
    {
      name: 'Alph Desc',
      otherName: 'abc↓',
      value: 4
    }
  ];

  const sortWay = ref(sortDefs[0]);

  const isFilterOn = computed(() => {
    const filterOn =
      filterCondition.value?.byLetter !== '' || filterCondition.value?.byType?.length > 0;
    const sortOn = sortDefs.findIndex((elm) => elm.value === sortWay.value?.value);
    return filterOn || sortOn;
  });

  async function loadUserWords() {
    const api = useApi();
    const wordData = await api.callWordApi(currentUser.value.uid);
    if (wordData) {
      if (!wordData.languages) {
        wordData.languages = [];
      }
      if (!wordData.words) {
        wordData.words = {};
      }
      userWords.value = wordData;
      return;
    }
  }

  const userLanguages = computed(() => {
    return userWords.value?.languages || [];
  });

  const userName = computed(() => {
    return userWords.value?.userName || '';
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
      const sortValue = sortWay.value.value;
      if (Number.isInteger(sortValue)) {
        let sortedWords;
        // shallow copy
        filteredWords = [...filteredWords];
        switch (sortValue) {
          case 1:
            sortedWords = filteredWords.sort((a, b) => {
              const aDate = a.date || 0;
              const bDate = b.date || 0;
              return aDate - bDate;
            });
            break;
          case 2:
            sortedWords = filteredWords.sort((a, b) => {
              const aDate = a.date || 0;
              const bDate = b.date || 0;
              return bDate - aDate;
            });
            break;
          case 3:
            sortedWords = filteredWords.sort((a, b) => {
              const aText = a.text;
              const bText = b.text;
              return aText.localeCompare(bText);
            });
            break;
          case 4:
            sortedWords = filteredWords.sort((a, b) => {
              const aText = a.text;
              const bText = b.text;
              return -1 * aText.localeCompare(bText);
            });
            break;
          default:
            sortedWords = filteredWords;
        }
        return sortedWords;
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

    const api = useApi();
    const result = await api.callWordApi(currentUser.value.uid, userWords.value);
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

      const api = useApi();
      const result = await api.callWordApi(currentUser.value.uid, userWords.value);
      return result;
    }
    return false;
  }

  async function deleteWord(lang, id) {
    const index = userWords.value.words[lang].findIndex((word) => word.id === id);
    if (index > -1) {
      userWords.value.words[lang].splice(index, 1);

      const api = useApi();
      const result = await api.callWordApi(currentUser.value.uid, userWords.value);
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

  function getFilterCondition() {
    return filterCondition.value;
  }

  function setSortway(value = sortDefs[0]) {
    sortWay.value = value;
  }

  function getSortway() {
    return sortWay.value;
  }

  function clearFilterCondition() {
    setFilterCondition();
  }

  function clearWordData() {
    clearFilterCondition();
    userWords.value = null;
    setCurrentTab(null);
  }

  async function initialize() {
    isProcessing.value = true;
    clearWordData();
    await loadUserWords();
    isProcessing.value = false;
  }

  return {
    userLanguages,
    filteredWords,
    userTabs,
    currentTab,
    supportLang,
    isProcessing,
    userName,
    sortDefs,
    isFilterOn,
    getWord,
    addWord,
    editWord,
    deleteWord,
    getType,
    setFilterCondition,
    getFilterCondition,
    setSortway,
    getSortway,
    clearFilterCondition,
    obtainLangName,
    getTypeKeys,
    setCurrentTab,
    initialize,
    clearWordData
  };
});
