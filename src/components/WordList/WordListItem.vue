<template>
  <v-list class="w-auto" density="compact" slim>
    <v-list-item
      v-for="(word, index) in words"
      :key="index"
      elevated="1"
      ripple
      @click="onSelect(index)"
    >
      <template v-slot:prepend>
        <v-icon :color="store.getType(word.type).color" size="small"> mdi-tag-text </v-icon>
      </template>
      <v-list-item-title>
        <span class="text-title-2">{{ word.text }}</span>
      </v-list-item-title>
    </v-list-item>
  </v-list>
  <v-dialog
    v-model="dialog"
    :fullscreen="isFullscreen"
    transition="slide-x-reverse-transition"
    scrollable
  >
    <DetailWord
      :word="selectedWord"
      :lang="store.currentTab"
      @close="onClose"
      @modified="onModified"
      @delete="onDelete"
    ></DetailWord>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useWordStore } from '@/stores/word';
import DetailWord from '../dialogs/DetailWord.vue';

const props = defineProps({
  words: Array
});

const display = useDisplay();
const store = useWordStore();

const dialog = ref(false);
const selectedWord = computed(() => {
  return props.words[selectedIndex.value];
});
const selectedIndex = ref(null);
const isFullscreen = computed(() => {
  return display.xs.value;
});

function onSelect(index) {
  selectedIndex.value = index;
  dialog.value = true;
}

function onClose() {
  dialog.value = false;
}

async function onModified(payload, callback) {
  await store.editWord(
    store.currentTab,
    selectedWord.value.id,
    payload.text,
    payload.type,
    payload.description
  );
  callback();
}

async function onDelete(callback) {
  await store.deleteWord(store.currentTab, selectedWord.value.id);
  callback();
  dialog.value = false;
}
</script>
