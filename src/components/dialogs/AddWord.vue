<template>
  <v-card class="mx-auto pa-4 pb-8" elevation="8" max-width="100%" rounded="lg">
    <div class="pb-3 text-h6 text-medium-emphasis d-flex justify-space-between">
      <v-icon size="small"> mdi-tag-text-outline </v-icon>
      Add Word
      <v-icon size="small" @click="emits('close')"> mdi-close </v-icon>
    </div>

    <div class="text-subtitle-1 text-medium-emphasis">Language</div>

    <v-select :items="langNameList" v-model="lang" density="compact" variant="outlined"> </v-select>

    <div class="text-subtitle-1 text-medium-emphasis">Word Text</div>

    <v-text-field
      density="compact"
      variant="outlined"
      placeholder="doggo"
      v-model="text"
    ></v-text-field>

    <div class="text-subtitle-1 text-medium-emphasis">Word Type</div>

    <v-radio-group inline v-model="type" density="comfortable">
      <v-radio label="Noun" value="noun"></v-radio>
      <v-radio label="Verb" value="verb"></v-radio>
      <v-radio label="Adjective" value="adjective"></v-radio>
      <v-radio label="Adverb" value="adverb"></v-radio>
      <v-radio label="Idiom" value="idiom"></v-radio>
      <v-radio label="Other" value="other"></v-radio>
    </v-radio-group>

    <div class="text-subtitle-1 text-medium-emphasis">Your Memo</div>

    <v-textarea
      density="compact"
      rows="2"
      clearable
      auto-grow
      v-model="description"
      variant="outlined"
    ></v-textarea>

    <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="submit">
      Submit
    </v-btn>
  </v-card>
</template>

<script setup>
import { ref, toValue } from 'vue';
import { useWordStore } from '@/stores/word';

const emits = defineEmits(['close']);
const text = ref('');
const type = ref(null);
const description = ref('');
const isLoading = ref(false);

const store = useWordStore();
const supportLang = {};
const langNameList = [];
store.supportLang.forEach((key) => {
  const langName = store.obtainLangName(key);
  supportLang[langName] = key;
  langNameList.push(langName);
});
const lang = ref(null);
if (store.currentTab) {
  lang.value = store.obtainLangName(store.currentTab);
}

async function submit() {
  isLoading.value = true;
  const inputText = toValue(text);
  const inputType = toValue(type);
  const inputDescription = toValue(description);
  const inputLang = supportLang[toValue(lang)];
  await store.addWord(inputText, inputType, inputDescription, inputLang);
  isLoading.value = false;
  text.value = '';
  type.value = 0;
  description.value = '';
  lang.value = null;
  emits('close');
}
</script>
