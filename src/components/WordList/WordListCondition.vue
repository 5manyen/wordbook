<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title static>
        <span class="text-caption">Search & Sort</span>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <WordListFilter @updateFilter="onUpdateFilter"></WordListFilter>
        <WordSort></WordSort>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import WordListFilter from './WordListFilter.vue';
import WordSort from './WordSort.vue';

const emits = defineEmits(['updateFilter', 'updateSort']);

function onUpdateFilter(value) {
  emits('updateFilter', value);
}
</script>
