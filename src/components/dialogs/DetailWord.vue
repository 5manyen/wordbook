<template>
  <DetailWordView
    v-if="!editMode"
    :word="word"
    :lang="lang"
    @edit="onEdit"
    @close="onClose"
  ></DetailWordView>
  <DetailWordEdit
    v-else
    :word="word"
    :lang="lang"
    @editSave="onEditSave"
    @editCancel="onEditCancel"
    @delete="onDelete"
  ></DetailWordEdit>
</template>

<script setup>
import { ref } from 'vue';

import DetailWordView from './parts/DetailWordView.vue';
import DetailWordEdit from './parts/DetailWordEdit.vue';

const props = defineProps({
  lang: String,
  word: Object
});
const emits = defineEmits(['close', 'modified', 'delete']);

function onClose() {
  editMode.value = false;
  emits('close');
}

const editMode = ref(false);
function onEdit() {
  editMode.value = true;
}
function onEditCancel() {
  editMode.value = false;
}
function onEditSave(payload, callback) {
  emits('modified', payload, callback);
  editMode.value = false;
}
function onDelete(callback) {
  emits('delete', callback);
}
</script>
