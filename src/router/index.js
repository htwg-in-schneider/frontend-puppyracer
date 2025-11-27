import { createRouter, createWebHistory } from 'vue-router'
import ProductCatalog from '../views/ProductCatalog.vue'
import ProductDetail from '../views/ProductDetail.vue'
import CreateProduct from '../views/CreateProduct.vue'
import EditProduct from '../views/EditProduct.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE || '/'),
  routes: [
    { path: '/', component: ProductCatalog },
    { path: '/product/:id', component: ProductDetail, props: true },
    { path: '/product/create', component: CreateProduct },
    { path: '/product/edit/:id', component: EditProduct, props: true }
  ]
})

export default router