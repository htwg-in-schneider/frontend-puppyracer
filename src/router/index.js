import { createRouter, createWebHistory } from 'vue-router'
import ProductCatalog from '@/views/ProductCatalog.vue'
import ProductDetail from '@/views/ProductDetail.vue'

const base = import.meta.env.VITE_BASE || '/' // falls du base benötigst for GitHub Pages

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    { path: '/', component: ProductCatalog },
    { path: '/product/:id', component: ProductDetail, props: true }
  ]
})

export default router