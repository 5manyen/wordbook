<template>
  <v-responsive class="overflow-y-auto" max-width="100%">
    <v-chip
      v-for="key in keys"
      :key="key"
      :text="key.value"
      closable
      @click:close="onClose(key)"
      size="x-small"
      color="grey-darken-1"
    >
    </v-chip>
  </v-responsive>
</template>

<script setup>
const props = defineProps({
  keys: Array
});

const emits = defineEmits(['clearFilter']);

function onClose(key) {
  emits('clearFilter', key);
}
</script>
