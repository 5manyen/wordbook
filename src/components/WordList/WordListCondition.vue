<template>
  <div class="d-flex justify-center">
    <FilterChips :keys="keys" v-if="keys.length > 0" @clearFilter=""></FilterChips>
    <v-spacer></v-spacer>
    <v-btn size="small" variant="plain" @click="filterDialog = true">
      <v-icon size="x-large" v-if="!store.isFilterOn"> mdi-filter-outline </v-icon>
      <v-icon size="x-large" v-else color="indigo-darken-3"> mdi-filter </v-icon>
      <v-dialog v-model="filterDialog" :fullscreen="isFullscreen">
        <WordListFilter
          @updateFilter="onUpdateFilter"
          @close="filterDialog = false"
        ></WordListFilter>
      </v-dialog>
    </v-btn>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useWordStore } from '@/stores/word';

import WordListFilter from './WordListFilter.vue';
import FilterChips from '../parts/FilterChips.vue';

const emits = defineEmits(['updateFilter', 'updateSort']);

const display = useDisplay();
const store = useWordStore();

const filterDialog = ref(false);
const keys = computed(() => {
  const arr = [];
  const filterCondition = store.getFilterCondition();
  const sortway = store.getSortway();
  const byLetter = filterCondition.byLetter;
  if (byLetter && byLetter !== '') {
    arr.push(byLetter);
  }
  const byType = filterCondition.byType;
  if (byType && byType.length > 0) {
    byType.forEach((type) => arr.push(type));
  }
  const sortValue = sortway.value;
  if (sortValue !== 1) {
    arr.push(sortway.otherName);
  }
  return arr;
});

const isFullscreen = computed(() => {
  return display.xs.value;
});

function onUpdateFilter(filter, sort) {
  emits('updateFilter', filter, sort);
}
</script>
