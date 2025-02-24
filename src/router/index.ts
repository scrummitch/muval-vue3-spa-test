import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
        },
        {
            path: '/tasks',
            name: 'tasks',
            component: () => import('@/views/TasksView.vue'),
            meta: { requiresAuth: true }
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    
    // Check auth status if not already checked
    if (!authStore.isAuthenticated) {
        await authStore.checkAuth();
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // If route requires auth and user is not authenticated
        next('/login');
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        // If route requires guest and user is authenticated
        next('/tasks');
    } else {
        next();
    }
});

export default router;
