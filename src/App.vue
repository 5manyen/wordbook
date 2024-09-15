<template>
  <v-app>
    <TheHeader></TheHeader>

    <TheMain></TheMain>

    <TheFooter></TheFooter>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';

import TheHeader from './layouts/TheHeader.vue';
import TheFooter from './layouts/TheFooter.vue';
import TheMain from './layouts/TheMain.vue';

onMounted(async () => {
  const store = useUserStore();
  await store.tryLogin();
});
</script>
