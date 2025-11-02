import { createRouter, createWebHistory } from 'vue-router';
import Products from '@/views/Products.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', name: 'products', component: Products }],
});

export default router;
