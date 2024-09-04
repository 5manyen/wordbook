<template>
  <v-card class="mx-auto pa-4 pb-8" elevation="8" max-width="100%" rounded="lg">
    <div class="pb-3 text-h6 text-medium-emphasis d-flex justify-space-between">
      <v-icon size="small"> mdi-tag-text-outline </v-icon>
      Add Word
      <v-icon size="small" @click="emits('close')"> mdi-close </v-icon>
    </div>

    <div class="text-subtitle-1 text-medium-emphasis">Language</div>

    <v-select :items="langNameList" v-model="lang" density="compact" variant="outlined"></v-select>

    <div class="text-subtitle-1 text-medium-emphasis">Word Text</div>

    <v-text-field
      density="compact"
      variant="outlined"
      v-model="text"
      :rules="[textRules.required]"
    ></v-text-field>

    <div class="text-subtitle-1 text-medium-emphasis">Word Type</div>

    <!-- <v-radio-group inline v-model="type" density="comfortable" :rules="[typeRules.required]">
      <v-radio label="Noun" value="noun"></v-radio>
      <v-radio label="Verb" value="verb"></v-radio>
      <v-radio label="Adjective" value="adjective"></v-radio>
      <v-radio label="Adverb" value="adverb"></v-radio>
      <v-radio label="Idiom" value="idiom"></v-radio>
      <v-radio label="Other" value="other"></v-radio>
    </v-radio-group> -->

    <v-responsive class="overflow-y-auto" max-height="280">
      <v-chip-group mandatory column filter v-model="selectedType">
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

    <div class="text-subtitle-1 text-medium-emphasis">Your Memo</div>

    <v-textarea
      density="compact"
      rows="2"
      clearable
      auto-grow
      v-model="description"
      variant="outlined"
    ></v-textarea>

    <v-btn
      color="blue"
      size="large"
      variant="tonal"
      block
      @click="submit"
      :disabled="validationError"
    >
      Submit
    </v-btn>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useWordStore } from '@/stores/word';

import WordTypeChip from '../parts/WordTypeChip.vue';

const emits = defineEmits(['close']);
const text = ref('');
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
const typeKeys = store.getTypeKeys();
const selectedType = ref(typeKeys[0]);

const validationError = computed(() => {
  return textError.value;
});
const textError = ref(false);

const textRules = {
  required: (value) => {
    if (!!value) {
      textError.value = false;
      return true;
    }
    textError.value = true;
    return 'Word text is required.';
  }
};

async function submit() {
  isLoading.value = true;
  const inputText = text.value;
  const inputType = selectedType.value;
  const inputDescription = description.value;
  const inputLang = supportLang[lang.value];
  await store.addWord(inputText, inputType, inputDescription, inputLang);
  isLoading.value = false;
  emits('close');
}

function chipStyle(key) {
  const isSelected = selectedType.value === key;
  return isSelected ? 'elevated' : 'outlined';
}
</script>
