<template>
  <div class="d-flex justify-end">
    <v-btn size="small" variant="plain" @click="filterDialog = true">
      <v-icon size="x-large" v-if="!store.isFilterOn"> mdi-filter-outline </v-icon>
      <v-icon size="x-large" v-else> mdi-filter </v-icon>
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

import WordListFilter from './WordListFilter.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useWordStore } from '@/stores/word';

const emits = defineEmits(['updateFilter', 'updateSort']);

const display = useDisplay();
const store = useWordStore();

const filterDialog = ref(false);

const isFullscreen = computed(() => {
  return display.xs.value;
});

function onUpdateFilter(filter, sort) {
  emits('updateFilter', filter, sort);
}
</script>
