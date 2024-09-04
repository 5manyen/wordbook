<template>
  <v-tabs
    v-model="currentTab"
    align-tabs="center"
    color="indigo"
    density="compact"
    show-arrows
    stacked
    center-active
    class="mb-4"
  >
    <v-tab v-for="tab in tabInfo" :key="tab.key" :value="tab.key" @click="onSelect(tab.key)">
      <v-icon size="small" v-if="isSelected(tab.key)"> mdi-folder-open </v-icon>
      <v-icon size="small" v-else> mdi-folder-outline </v-icon>
      <span class="text-subtitle-2">{{ tab.engName }}</span>
    </v-tab>
  </v-tabs>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

import { useWordStore } from '@/stores/word';

const store = useWordStore();
const tabInfo = computed(() => store.userTabs);

const currentTab = ref(store.currentTab);
const hook = computed(() => store.currentTab);

function isSelected(value) {
  return currentTab.value === value;
}

function onSelect(value) {
  store.setCurrentTab(value);
}

watch(hook, (newVal) => {
  currentTab.value = newVal;
});
</script>
