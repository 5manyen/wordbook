<template>
  <v-chip :color="type.color" :variant="variant || 'flat'">{{ type.text }}</v-chip>
</template>

<script setup>
import { useWordStore } from '@/stores/word';

const props = defineProps({
  typeKey: String,
  variant: String
});

const store = useWordStore();
const type = store.getType(props.typeKey);
</script>
