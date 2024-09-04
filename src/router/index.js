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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  const store = useUserStore();
  if (!store.isLoggedIn && to.name !== 'login') {
    next('login');
    return;
  }
  next();
});

export default router;
