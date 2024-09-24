<template>
  <div class="text-center">
    <!-- <v-btn
      append-icon="mdi-open-in-new"
      color="deep-purple-accent-4"
      @click="overlay = !overlay"
    >
      Launch Application
    </v-btn> -->

    <v-overlay :model-value="isActive" class="align-center justify-center" persistent>
      <v-progress-circular color="blue-grey" size="64" indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup>
const props = defineProps({
  isActive: Boolean
});
</script>
