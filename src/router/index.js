import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetail from '../views/ProductDetail.vue'
import ProductCatalog from '../views/ProductCatalog.vue'
import AccountView from '@/views/AccountView.vue'
import WarenkorbView from '@/views/WarenkorbView.vue'

const routes = [
  { 
    path: '/', 
    name: 'home',
    component: HomeView
  },
  { 
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetail,
    props: true
  },
  { 
    path: '/:category',  // leinen, halsbaender, etc.
    name: 'product-catalog',
    component: ProductCatalog,
    props: (route) => ({ 
      category: route.params.category,
      initialSearch: route.query.q || ''  // Suchbegriff übergeben
    })
  },
  // NEUE SUCH-ROUTE
  { 
    path: '/search',
    name: 'search',
    component: ProductCatalog,
    props: (route) => ({ 
      category: '',  // Keine Kategorie bei Suche
      searchQuery: route.query.q || ''  // Suchbegriff als Prop
    })
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView
  },
  {
    path: '/warenkorb',
    name: 'warenkorb',
    component: WarenkorbView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router