import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { useWordStore } from './word';
import { useFirebase } from '@/composables/firebase';

export const useUserStore = defineStore('user', () => {
  const userContext = ref({
    loginUser: null
  });

  const currentUser = computed(() => {
    return userContext.value.loginUser;
  });

  const isLoggedIn = computed(() => {
    return userContext.value.loginUser !== null;
  });

  async function signUp(userName, password) {
    const firebase = useFirebase();
    const result = await firebase.signUp(userName, password);

    if (!result.error) {
      const userData = result.userData;
      userContext.value.loginUser = userData;
      const store = useWordStore();
      store.initialize();
      return true;
    }
    return false;
  }

  async function login(userName, password) {
    const firebase = useFirebase();
    const result = await firebase.logIn(userName, password);

    if (!result.error) {
      const userData = result.userData;
      userContext.value.loginUser = userData;
      const store = useWordStore();
      store.initialize();
      return true;
    }
    return false;
  }

  function logout() {
    userContext.value.loginUser = null;
    const store = useWordStore();
    store.clearWordData();
  }

  return { currentUser, isLoggedIn, signUp, login, logout };
});
