<template>
  <v-card class="mx-auto pa-4 pb-8" elevation="8" max-width="100%" rounded="lg">
    <v-sheet>
      <div class="pb-3 text-h6 text-medium-emphasis d-flex justify-space-between">
        <v-icon size="small"> mdi-tag-text-outline </v-icon>
        Edit
        <v-icon size="small" @click="onCancel"> mdi-arrow-left </v-icon>
      </div>

      <div class="text-subtitle-1 text-medium-emphasis">Word Text</div>

      <v-text-field
        density="compact"
        variant="outlined"
        v-model="wordText"
        :rules="[textRules.required]"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis">Word Type</div>

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
        v-model="wordDesc"
        variant="outlined"
      ></v-textarea>

      <v-btn
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="onSave"
        :disabled="validationError || isSaving"
      >
        Save
      </v-btn>

      <div class="pt-4 text-center">
        <v-btn size="small" variant="text" class="text-red" @click="confirmDelete">
          <v-icon size="small"> mdi-delete-alert </v-icon>
          DELETE
        </v-btn>
      </div>

      <v-dialog v-model="deleteDialog" contained>
        <v-card>
          <v-alert
            icon="$warning"
            color="warning"
            title="Caution"
            variant="tonal"
            text="This action cannot be reversed."
          ></v-alert>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn @click="cancelDelete" variant="tonal" color="blue-grey"> Cancel </v-btn>

            <v-btn @click="onDelete" :disabled="isDeleting" variant="tonal" color="red-lighten-1">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-sheet>

    <LoaderOverlay :is-active="isSaving || isDeleting"></LoaderOverlay>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useWordStore } from '@/stores/word';

import WordTypeChip from '@/components/parts/WordTypeChip.vue';
import LoaderOverlay from '@/components/parts/LoaderOverlay.vue';

const props = defineProps({
  lang: String,
  word: Object
});
const emits = defineEmits(['editSave', 'editCancel', 'delete']);

const store = useWordStore();

const wordText = ref(props.word.text);
const wordDesc = ref(props.word.description);
const deleteDialog = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const typeKeys = store.getTypeKeys();
const initialType = typeKeys.find((key) => key === props.word.type);
const selectedType = ref(initialType);
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

function onSave() {
  isSaving.value = true;
  const payload = {
    text: wordText.value,
    type: selectedType.value,
    description: wordDesc.value
  };
  emits('editSave', payload, () => (isSaving.value = false));
}
function onCancel() {
  emits('editCancel');
}
function onDelete() {
  isDeleting.value = true;
  emits('delete', () => {
    deleteDialog.value = false;
    isDeleting.value = false;
  });
}
function cancelDelete() {
  deleteDialog.value = false;
}
function confirmDelete() {
  deleteDialog.value = true;
}
function chipStyle(key) {
  const isSelected = selectedType.value === key;
  return isSelected ? 'elevated' : 'outlined';
}
</script>
