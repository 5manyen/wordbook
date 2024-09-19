<template>
  <div class="d-flex justify-end">
    <v-btn size="small" variant="plain" @click="filterDialog = true">
      <v-icon size="x-large"> mdi-filter-outline </v-icon>
      <v-dialog v-model="filterDialog" :fullscreen="isFullscreen">
        <WordListFilter
          @updateFilter="onUpdateFilter"
          @close="filterDialog = false"
        ></WordListFilter>
      </v-dialog>
    </v-btn>
    <!-- <v-btn size="small" variant="plain">
      <v-icon size="x-large"> mdi-sort-clock-ascending-outline </v-icon>
      <v-menu activator="parent">
        <v-list density="compact">
          <v-list-item>Date Desc</v-list-item>
          <v-list-item>Date Asc</v-list-item>
          <v-list-item>Alph Desc</v-list-item>
          <v-list-item>Alph Asc</v-list-item>
        </v-list>
      </v-menu>
    </v-btn> -->
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import WordListFilter from './WordListFilter.vue';
import WordSort from './WordSort.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const emits = defineEmits(['updateFilter', 'updateSort']);

const display = useDisplay();

const filterDialog = ref(false);

const isFullscreen = computed(() => {
  return display.xs.value;
});

function onUpdateFilter(value) {
  emits('updateFilter', value);
}
</script>
