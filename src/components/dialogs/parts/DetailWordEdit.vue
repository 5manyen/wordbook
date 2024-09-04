<template>
  <v-card class="mx-auto pa-4 pb-8" elevation="8" max-width="100%" rounded="lg">
    <div class="pb-3 text-h6 text-medium-emphasis d-flex justify-space-between">
      <v-icon size="small"> mdi-tag-text-outline </v-icon>
      Edit
      <v-icon size="small" @click="onCancel"> mdi-arrow-left </v-icon>
    </div>

    <div class="text-subtitle-1 text-medium-emphasis">Word Text</div>

    <v-text-field density="compact" variant="outlined" v-model="wordText"></v-text-field>

    <div class="text-subtitle-1 text-medium-emphasis">Word Type</div>

    <v-radio-group inline v-model="wordType" density="comfortable">
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
      v-model="wordDesc"
      variant="outlined"
    ></v-textarea>

    <v-btn color="blue" size="large" variant="tonal" block @click="onSave" :loading="isSaving">
      Save
    </v-btn>

    <div class="pt-4 text-center">
      <a class="text-red text-decoration-none" @click="confirmDelete">
        <v-icon size="small"> mdi-delete-alert </v-icon>
        DELETE
      </a>
    </div>

    <v-dialog v-model="deleteDialog">
      <v-card prepend-icon="mdi-alert-circle-outline" text="This operation CANNOT revert.">
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="cancelDelete"> Cancel </v-btn>

          <v-btn @click="onDelete" :loading="isDeleting"> Delete </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  lang: String,
  word: Object
});
const emits = defineEmits(['editSave', 'editCancel', 'delete']);

const wordText = ref(props.word.text);
const wordType = ref(props.word.type);
const wordDesc = ref(props.word.description);
const deleteDialog = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);

function onSave() {
  // TODO Add validation
  isSaving.value = true;
  const payload = {
    text: wordText.value,
    type: wordType.value,
    description: wordDesc.value
  };
  emits('editSave', payload, () => (isSaving.value = false));
}
function onCancel() {
  emits('editCancel');
}
function onDelete() {
  isDeleting.value = true;
  deleteDialog.value = false;
  emits('delete', () => (isDeleting.value = false));
}
function cancelDelete() {
  deleteDialog.value = false;
}
function confirmDelete() {
  deleteDialog.value = true;
}
</script>
