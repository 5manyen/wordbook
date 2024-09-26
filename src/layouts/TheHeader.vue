<template>
  <v-app-bar color="blue-darken-4" density="compact">
    <v-app-bar-title> Wordbook </v-app-bar-title>
    <template v-slot:append>
      <v-btn v-if="userStore.isLoggedIn">
        <v-icon size="large"> mdi-menu </v-icon>
        <v-menu activator="parent">
          <v-card>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon> mdi-account-circle </v-icon>
                </template>
                <v-list-item-title>{{ wordStore.userName }}</v-list-item-title>
                <v-list-item-subtitle>Last Login: xx/xx/xx</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="onLogout" size="small" variant="tonal" color="blue-grey">
                Log out
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useWordStore } from '@/stores/word';
import { computed } from 'vue';

const router = useRouter();

const userStore = useUserStore();
const wordStore = useWordStore();

function onLogout() {
  userStore.logout();
  router.replace('login');
}
</script>
