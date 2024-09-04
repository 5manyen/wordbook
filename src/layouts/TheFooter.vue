<template>
  <!-- <v-bottom-navigation v-model="value" color="primary" grow v-if="store.isLoggedIn">
    <v-btn>
      <v-icon>mdi-dumbbell</v-icon>
      Weak
    </v-btn>

    <v-btn>
      <v-icon>mdi-chart-bar</v-icon>
      Stats
    </v-btn>

    <v-btn>
      <v-icon>mdi-pencil-plus</v-icon>
      <span>Add</span>
      <AddWord></AddWord>
    </v-btn>
  </v-bottom-navigation> -->
  <v-footer app class="d-flex justify-end">
    <!-- <v-sheet height="50">
      <v-fab class="me-4" location="top end" icon="mdi-plus" absolute offset>
        <AddWord></AddWord>
      </v-fab>
    </v-sheet> -->
  </v-footer>
</template>

<script setup>
import { ref } from 'vue';
import AddWord from '../components/dialogs/AddWord.vue';

import { useUserStore } from '@/stores/user';

const value = ref(0);
const store = useUserStore();
</script>
