import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '../store/authentication'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login-page',
      component: () => import('../views/LoginPage.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/signup',
      name: 'signup-page',
      component: () => import('../views/SignUpPage.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/discovery',
      name: 'discovery-page',
      component: () => import('../views/DiscoveryPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user',
      name: 'user-page',
      component: () => import('../views/UserPage.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})


const authGuard = async (to, from, next) => {
  const authStore = useAuthStore();
  await authStore.initAuth();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next('/');
      
    } else {
      next();
    }
  } else {

    next();
  }
};

router.beforeEach(authGuard);




export default router
