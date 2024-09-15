import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { useWordStore } from './word';
import { useApi } from '@/composables/api';

export const useUserStore = defineStore('user', () => {
  const store = useWordStore();

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
    const api = useApi();
    const userData = await api.signup(userName, password);
    if (userData) {
      localStorage.setItem('uid', userData.uid);
      userContext.value.loginUser = userData;
      await store.initialize();
      return true;
    }
    return false;
  }

  async function login(userName, password) {
    const api = useApi();
    const userData = await api.login(userName, password);
    console.log(userData);
    if (userData) {
      localStorage.setItem('uid', userData.uid);
      userContext.value.loginUser = userData;
      await store.initialize();
      return true;
    }
    return false;
  }

  function logout() {
    const uid = userContext.value.loginUser.uid;
    localStorage.removeItem('uid');
    userContext.value.loginUser = null;
    const api = useApi();
    api.logout(uid);
    store.clearWordData();
  }

  async function tryLogin() {
    const uid = localStorage.getItem('uid');
    if (uid) {
      userContext.value.loginUser = {
        uid
      };
      await store.initialize();
    }
  }

  return { currentUser, isLoggedIn, signUp, login, logout, tryLogin };
});
