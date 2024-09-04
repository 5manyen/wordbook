<template>
  <v-app-bar color="blue-darken-4">
    <v-app-bar-title> Wordbook </v-app-bar-title>
    <template v-slot:append>
      <v-btn v-if="store.isLoggedIn">
        <v-icon size="large"> mdi-account-circle </v-icon>
        <v-menu activator="parent">
          <v-list>
            <v-list-item>
              <v-list-item-title @click="onLogout"> Log Out </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();

const store = useUserStore();

function onLogout() {
  store.logout();
  router.replace('login');
}
</script>
