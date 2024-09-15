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

const displayWords = computed(() => {
  let filteredWords = store.filteredWords;
  return filteredWords;
});

const isVisibleWords = computed(() => {
  return !!store.currentTab;
});

const isProcessing = computed(() => {
  return store.isProcessing;
});

function onUpdateFilter(value) {
  filterCondtions.value = value;
}

watch(filterCondtions, () => {
  store.setFilterCondition(filterCondtions.value.searchWord, filterCondtions.value.searchTypes);
});
</script>
