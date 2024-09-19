<template>
  <v-card class="mx-auto pa-4 pb-8" elevation="8" max-width="100%" rounded="lg">
    <div class="pb-3 text-h6 text-medium-emphasis d-flex justify-space-between">
      <v-icon size="small"> mdi-filter-outline </v-icon>
      Word Filter
      <v-icon size="small" @click="emits('close')"> mdi-close </v-icon>
    </div>
    <v-divider class="mb-2"></v-divider>

    <div class="text-subtitle-1 text-medium-emphasis">Word</div>

    <v-text-field density="compact" variant="outlined" v-model="inputWord"></v-text-field>

    <div class="text-subtitle-1 text-medium-emphasis">Type</div>

    <v-responsive class="overflow-y-auto" max-height="280">
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
    </v-responsive>

    <div class="text-subtitle-1 text-medium-emphasis">Sort</div>

    <v-select
      :items="sortItemList"
      item-title="title"
      item-value="value"
      v-model="sortItem"
      density="compact"
      variant="outlined"
    ></v-select>

    <v-btn color="blue" size="large" variant="tonal" block @click="apply"> Apply </v-btn>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useWordStore } from '@/stores/word';
import WordTypeChip from '../parts/WordTypeChip.vue';

const emits = defineEmits(['updateFilter', 'close']);

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

const sortItemList = [
  {
    title: 'Date Asc',
    value: 1
  },
  {
    title: 'Date Desc',
    value: 2
  },
  {
    title: 'Alph - Asc',
    value: 3
  },
  {
    title: 'Alph - Desc',
    value: 4
  }
];
const sortItem = ref(sortItemList[0]);

function chipStyle(key) {
  const isSelected = selectedTypes.value.includes(key);
  return isSelected ? 'elevated' : 'outlined';
}

function apply() {
  emits('updateFilter', filterCondition.value);
  emits('close');
}
</script>
