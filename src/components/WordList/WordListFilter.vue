<template>
  <v-container>
    <v-text-field
      prepend-icon="mdi-magnify"
      label="search"
      density="compact"
      v-model="inputWord"
    ></v-text-field>
    <v-chip-group multiple filter column v-model="selectedTypes">
      <WordTypeChip
        v-for="key in typeKeys"
        :key="key"
        :type-key="key"
        :value="key"
        :variant="chipStyle(key)"
        size="small"
      ></WordTypeChip>
    </v-chip-group>
  </v-container>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useWordStore } from '@/stores/word';
import WordTypeChip from '../parts/WordTypeChip.vue';

const emits = defineEmits(['updateFilter']);

const store = useWordStore();
const typeKeys = store.getTypeKeys();

const inputWord = ref('');
const selectedTypes = ref([]);
const filterCondition = computed(() => {
  const condition = {
    searchWord: inputWord.value,
    searchTypes: selectedTypes.value
  };
  return condition;
});

watch(selectedTypes, () => {
  emits('updateFilter', filterCondition.value);
});

watch(inputWord, () => {
  emits('updateFilter', filterCondition.value);
});

function chipStyle(key) {
  const isSelected = selectedTypes.value.includes(key);
  return isSelected ? 'elevated' : 'outlined';
}
</script>
