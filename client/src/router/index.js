import { createRouter, createWebHashHistory } from 'vue-router';
import ContentPage from '/src/pages/ContentPage.vue';

const routes = [{ path: '/', name: 'Dashboard', component: ContentPage }];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
