<template>
  <v-responsive class="overflow-y-auto" max-height="280">
    <v-chip v-for="key in keys" closable @click:close="onClose(key)">
      {{ key }}
    </v-chip>
  </v-responsive>
</template>

<script setup>
const props = defineProps({
  keys: Array
});

const emits = defineEmits('clearFilter');

function onClose(key) {
  emits('clearFilter', key);
}
</script>
