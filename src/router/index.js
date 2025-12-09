import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'  // NEU!
import ProductDetail from '../views/ProductDetail.vue'
import LeinenView from '../views/LeinenView.vue'
import HalsbaenderView from '../views/HalsbaenderView.vue'
import BekleidungView from '../views/BekleidungView.vue'
import SnacksView from '../views/SnacksView.vue'

const routes = [
  { 
    path: '/', 
    name: 'home',
    component: HomeView  // Jetzt HomeView statt ProductCatalog
  },
  { 
    path: '/product/view/:id', 
    name: 'product-detail',
    component: ProductDetail 
  },
  { 
    path: '/leinen', 
    name: 'leinen',
    component: LeinenView 
  },
  { 
    path: '/halsbaender', 
    name: 'halsbaender',
    component: HalsbaenderView 
  },
  { 
    path: '/bekleidung', 
    name: 'bekleidung',
    component: BekleidungView 
  },
  { 
    path: '/snacks', 
    name: 'snacks',
    component: SnacksView 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router