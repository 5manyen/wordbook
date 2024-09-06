<template>
  <v-card
    class="mx-auto pa-4 pb-8"
    elevation="8"
    max-width="100%"
    rounded="lg"
    :min-width="minWidth"
  >
    <div class="text-h6 text-medium-emphasis d-flex justify-space-between">
      <WordTypeChip :type-key="word.type"></WordTypeChip>
      <v-icon size="small" @click="close"> mdi-close </v-icon>
    </div>

    <div class="text-h4 font-weight-black pt-5 pb-2 pl-2">{{ word.text }}</div>

    <v-card-text class="pt-0 px-sm-4 px-2">
      <v-list>
        <v-list-item class="pl-0 px-1 pt-3">
          <v-list-item-title class="pb-1">Memo</v-list-item-title>
          <div class="text-medium-emphasis">{{ word.description }}</div>
        </v-list-item>
        <v-list-item class="pl-0 px-1 pt-3" v-if="isGenerating || existsResult">
          <v-list-item-title class="pb-1">Ask AI</v-list-item-title>
          <v-skeleton-loader type="article" v-if="isGenerating"></v-skeleton-loader>
          <div class="text-medium-emphasis markdown-body" v-html="resultHtml"></div>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions class="mt-3 mb-0 d-flex justify-end">
      <v-btn
        class="text-none"
        :text="askAICaption"
        variant="tonal"
        color="blue"
        @click="onClickAskAI(word.text, word.type)"
        :loading="isGenerating"
      >
      </v-btn>
      <v-btn class="text-none" text="Edit" variant="tonal" color="blue" @click="edit"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useWordStore } from '@/stores/word';
import { useApi } from '@/composables/api';

import WordTypeChip from '../../parts/WordTypeChip.vue';

const props = defineProps({
  lang: String,
  word: Object
});
const emits = defineEmits(['edit', 'close']);

const display = useDisplay();
const store = useWordStore();

const langName = store.obtainLangName(props.lang);
const minWidth = computed(() => {
  return display.xs.value ? undefined : '545';
});

const isGenerating = ref(false);
const existsResult = computed(() => {
  return resultHtml.value === '' ? false : true;
});
const askAICaption = computed(() => {
  return existsResult.value ? 'Re-Gen' : 'Ask AI';
});
const resultHtml = ref('');

async function onClickAskAI(word, type) {
  resultHtml.value = '';
  isGenerating.value = true;

  const typeText = type && type !== 'other' ? ` ${type} ` : ' ';

  const api = useApi();
  const { content, error } = await api.callAskaiApi(langName, typeText, word);

  if (error) {
    resultHtml.value = 'Something went wrong. Please try again later!';
  } else {
    resultHtml.value = content;
  }
  isGenerating.value = false;
}

function edit() {
  emits('edit');
}

function close() {
  emits('close');
}
</script>
