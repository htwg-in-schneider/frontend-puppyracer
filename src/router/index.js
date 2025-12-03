import { createRouter, createWebHistory } from 'vue-router';
import ProductCatalog from '../views/ProductCatalog.vue';
import ProductDetail from '../views/ProductDetail.vue';

const routes = [
  { path: '/', component: ProductCatalog },
  { path: '/product/view/:id', component: ProductDetail } // Detailseite
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;