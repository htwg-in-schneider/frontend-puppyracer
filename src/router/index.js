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

// Helper function für Props
const getCatalogProps = (route, adminMode = false) => ({
  category: route.params.category || '',
  searchQuery: route.query.q || '',
  adminMode
})

const routes = [
  {
    path: '/',
    name: 'home',
    component: HeroSection,
    meta: { title: 'Startseite - PuppyRacer' }
  },
  
  // Redirects für einfache Kategorie-Links
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
  
  // Legal Pages
  {
    path: '/impressum',
    name: 'impressum',
    component: Impressum,
    meta: { title: 'Impressum - PuppyRacer' }
  },
  {
    path: '/datenschutz',
    name: 'datenschutz',
    component: Datenschutz,
    meta: { title: 'Datenschutz - PuppyRacer' }
  },
  
  // Product Routes
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetail,
    props: true,
    meta: { title: 'Produktdetails - PuppyRacer' }
  },
  {
    path: '/produkte/:category?',
    name: 'product-catalog',
    component: ProductCatalog,
    props: route => getCatalogProps(route),
    meta: { title: 'Produkte - PuppyRacer' }
  },
  {
    path: '/search',
    name: 'search',
    component: ProductCatalog,
    props: route => getCatalogProps(route),
    meta: { title: 'Suchergebnisse - PuppyRacer' }
  },
  
  // User Account Routes
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: { 
      requiresAuth: true,
      title: 'Mein Konto - PuppyRacer'
    }
  },
  {
    path: '/warenkorb',
    name: 'warenkorb',
    component: WarenkorbView,
    meta: { title: 'Warenkorb - PuppyRacer' }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: { 
      requiresAuth: true,
      title: 'Kasse - PuppyRacer'
    }
  },
  
  // Order Routes
  {
    path: '/order-confirmation/:orderNumber?',
    name: 'OrderConfirmation',
    component: OrderConfirmation,
    props: true,
    meta: { 
      requiresAuth: true,
      title: 'Bestellbestätigung - PuppyRacer'
    }
  },
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: OrderHistory,
    meta: { 
      requiresAuth: true,
      title: 'Meine Bestellungen - PuppyRacer'
    }
  },
  
  // Admin Routes
  {
    path: '/admin/products/create',
    name: 'CreateProduct',
    component: CreateProduct,
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: 'Produkt erstellen - Admin'
    }
  },
  {
    path: '/admin/products/edit/:id',
    name: 'EditProduct',
    component: EditProduct,
    props: true,
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: 'Produkt bearbeiten - Admin'
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: UserManagement,
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: 'Benutzerverwaltung - Admin'
    }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: OrderHistory,
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: 'Bestellungen verwalten - Admin'
    }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: ProductCatalog,
    props: route => getCatalogProps(route, true),
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: 'Produkte verwalten - Admin'
    }
  },
  
  // 404 Fallback - Sollte immer die letzte Route sein
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Title Management Middleware
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta?.title || 'PuppyRacer - Hundezubehör'
  
  // Hier könnte später Auth/Admin-Check hin
  // const auth = useAuthStore()
  // if (to.meta.requiresAuth && !auth.isAuthenticated) {
  //   next('/')
  // } else if (to.meta.requiresAdmin && !auth.isAdmin) {
  //   next('/')
  // } else {
  //   next()
  // }
  
  next()
})

export default router