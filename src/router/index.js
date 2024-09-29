import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import WordList from '@/views/WordList.vue';

import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WordList
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const store = useUserStore();
  if (!store.isLoggedIn && to.name !== 'login') {
    next('/login');
    return;
  }
  if (store.isLoggedIn && to.name === 'login') {
    next('/');
    return;
  }
  next();
});

export default router;
