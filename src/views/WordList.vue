<template>
  <v-card class="mx-auto pa-2 pb-8" max-width="448" rounded="lg" variant="text">
    <v-skeleton-loader type="card" v-if="isProcessing"></v-skeleton-loader>
    <div v-else-if="isVisibleWords">
      <WordListLangTabs></WordListLangTabs>
      <WordListCondition @updateFilter="onUpdateFilter"></WordListCondition>
      <WordListItem :words="displayWords"></WordListItem>
    </div>
    <v-container v-else>No word found.</v-container>
  </v-card>
</template>

<script setup>
import WordListItem from '../components/WordList/WordListItem.vue';
import WordListCondition from '../components/WordList/WordListCondition.vue';
import WordListLangTabs from '../components/WordList/WordListLangTabs.vue';
import { useWordStore } from '@/stores/word';
import { computed, ref, watch } from 'vue';

const store = useWordStore();

const filterCondtions = ref({
  searchWord: '',
  searchTypes: []
});

const sortway = ref(store.getSortway()[0]);

const displayWords = computed(() => {
  const filteredWords = [...store.filteredWords];
  const sortValue = sortway.value;
  if (Number.isInteger(sortValue)) {
    let sortedWords;
    switch (sortValue) {
      case 1:
        // date ascending
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
  return filteredWords;
});

const isVisibleWords = computed(() => {
  return !!store.currentTab;
});

const isProcessing = computed(() => {
  return store.isProcessing;
});

function onUpdateFilter(filter, sort) {
  filterCondtions.value = filter;
  sortway.value = sort;
}

watch(filterCondtions, () => {
  store.setFilterCondition(filterCondtions.value.searchWord, filterCondtions.value.searchTypes);
});

watch(sortway, () => {
  store.setSortway(sortway.value);
});
</script>
