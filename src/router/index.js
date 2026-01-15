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
    props: route => ({ adminMode: true, category: '' }),
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true,
      title: 'Produkte verwalten - Admin'
    }
  },
  
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
  
  {
    path: '/leinen',
    redirect: '/produkte/leinen'
  },
  {
    path: '/halsbaender',
    redirect: '/produkte/halsband' 
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
  
  {
    path: '/order-confirmation/:id',
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
  
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/frontend-puppyracer/'),
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

// Debugging Middleware
router.beforeEach((to, from, next) => {
  console.log('========== ROUTER DEBUG ==========')
  console.log('Von:', from.path)
  console.log('Nach:', to.path)
  console.log('Name:', to.name)
  console.log('Params:', to.params)
  console.log('Query:', to.query)
  console.log('==================================')
  
  document.title = to.meta?.title || 'PuppyRacer - Hundezubehör'
  next()
})

export default router