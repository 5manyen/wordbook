<template>
  <v-main>
    <RouterView></RouterView>
    <v-fab
      class="mb-8 mr-16"
      location="bottom end"
      icon="mdi-plus"
      app
      absolute
      offset
      v-if="store.isLoggedIn"
      @click="dialog = true"
    >
    </v-fab>
    <v-dialog v-model="dialog" :fullscreen="isFullscreen" transition="dialog-bottom-transition">
      <AddWord @close="dialog = false"></AddWord>
    </v-dialog>
  </v-main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useUserStore } from '@/stores/user';
import AddWord from '@/components/dialogs/AddWord.vue';

const display = useDisplay();
const store = useUserStore();

const dialog = ref(false);
const isFullscreen = computed(() => {
  return display.xs.value;
});
</script>
