<template>
  <v-row>
    <v-col cols="1"></v-col>
    <v-col cols="8">
      <FilterChips :keys="keys" v-if="keys.length > 0" @clearFilter="onClearFilter"></FilterChips>
    </v-col>
    <v-col cols="2" class="d-flex align-center">
      <v-btn size="small" variant="plain" @click="filterDialog = true">
        <v-icon size="x-large" v-if="!store.isFilterOn"> mdi-filter-outline </v-icon>
        <v-icon size="x-large" v-else color="indigo-darken-3"> mdi-filter </v-icon>
        <v-dialog v-model="filterDialog" :fullscreen="isFullscreen">
          <WordListFilter @close="filterDialog = false"></WordListFilter>
        </v-dialog>
      </v-btn>
    </v-col>
    <v-col cols="1"></v-col>
  </v-row>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useWordStore } from '@/stores/word';

import WordListFilter from './WordListFilter.vue';
import FilterChips from '../parts/FilterChips.vue';

const display = useDisplay();
const store = useWordStore();

const filterDialog = ref(false);
const keys = computed(() => {
  const arr = [];
  const filterCondition = store.getFilterCondition();
  const sortway = store.getSortway();
  const byLetter = filterCondition.byLetter;
  if (byLetter && byLetter !== '') {
    arr.push({ kind: 'byLetter', value: byLetter });
  }
  const byType = filterCondition.byType;
  if (byType && byType.length > 0) {
    byType.forEach((type) => {
      arr.push({ kind: 'byType', value: type });
    });
  }
  const sortValue = sortway.value;
  if (sortValue !== 1) {
    arr.push({ kind: 'sort', value: sortway.otherName });
  }
  return arr;
});

const isFullscreen = computed(() => {
  return display.xs.value;
});

function onClearFilter(target) {
  const found = keys.value.find((key) => key.value === target.value);
  const currentFilterCondition = store.getFilterCondition();
  if (found?.kind === 'byLetter') {
    store.setFilterCondition('', currentFilterCondition.byType);
  } else if (found?.kind === 'byType') {
    const arr = [...currentFilterCondition.byType];
    const index = arr.findIndex((type) => type === found.value);
    arr.splice(index, 1);
    store.setFilterCondition(currentFilterCondition.byLetter, arr);
  } else if (found?.kind === 'sort') {
    store.setSortway();
  }
}
</script>
