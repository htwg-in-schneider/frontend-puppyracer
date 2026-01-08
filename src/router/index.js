import { createRouter, createWebHistory } from 'vue-router'
import ProductDetail from '../views/ProductDetail.vue'
import ProductCatalog from '../views/ProductCatalog.vue'
import AccountView from '@/views/AccountView.vue'
import WarenkorbView from '@/views/WarenkorbView.vue'
import Impressum from '@/views/Impressum.vue'
import Datenschutz from '@/views/Datenschutz.vue'
import HeroSection from '@/components/HeroSection.vue'
import Checkout from '@/views/Checkout.vue'
import UserManagement from '@/views/UserManagement.vue'
import OrderConfirmation from '@/views/OrderConfirmation.vue'
import OrderHistory from '@/views/OrderHistory.vue'
import EditProduct from '@/views/EditProduct.vue'
import CreateProduct from '@/views/CreateProduct.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HeroSection
  },
  
  // WICHTIG: Redirects für einfache Kategorie-Links
  {
    path: '/leinen',
    redirect: '/produkte/leinen'
  },
  {
    path: '/halsbaender',
    redirect: '/produkte/halsbaender'
  },
  {
    path: '/bekleidung',
    redirect: '/produkte/bekleidung'
  },
  {
    path: '/snacks',
    redirect: '/produkte/snacks'
  },
  
  {
    path: '/impressum',
    name: 'impressum',
    component: Impressum
  },
  {
    path: '/datenschutz',
    name: 'datenschutz',
    component: Datenschutz
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/produkte/:category?',
    name: 'product-catalog',
    component: ProductCatalog,
    props: (route) => ({
      category: route.params.category || '',
      initialSearch: route.query.q || ''
    })
  },
  {
    path: '/search',
    name: 'search',
    component: ProductCatalog,
    props: (route) => ({
      category: '',
      searchQuery: route.query.q || ''
    })
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: { requiresAuth: true }
  },
  {
    path: '/warenkorb',
    name: 'warenkorb',
    component: WarenkorbView
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  
  // BESTELL-ROUTEN
  {
    path: '/order-confirmation/:orderNumber?',
    name: 'OrderConfirmation',
    component: OrderConfirmation
  },
  
  // USER: Eigene Bestellungen
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: OrderHistory,
    meta: { requiresAuth: true }
  },
  
  // ADMIN ROUTEN
  {
    path: '/admin/products/create',
    name: 'CreateProduct',
    component: CreateProduct,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products/edit/:id',
    name: 'EditProduct',
    component: EditProduct,
    props: true,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: OrderHistory,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: ProductCatalog,
    props: (route) => ({
      category: route.params.category || '',
      initialSearch: route.query.q || '',
      adminMode: true
    }),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  
  // 404 Fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router