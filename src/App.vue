<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(async () => {
    await authStore.checkAuth();
});
</script>

<template>
    <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
                <h1 class="text-3xl font-bold tracking-tight text-gray-900">Task Manager</h1>
                
                <nav class="flex items-center space-x-4">
                    <template v-if="authStore.isAuthenticated">
                        <RouterLink to="/tasks" class="text-gray-700 hover:text-gray-900">Tasks</RouterLink>
                        <button @click="authStore.logout" class="text-sm">Logout</button>
                    </template>
                    <template v-else>
                        <RouterLink to="/login" class="text-gray-700 hover:text-gray-900">Login</RouterLink>
                        <RouterLink to="/register" class="text-gray-700 hover:text-gray-900">Register</RouterLink>
                    </template>
                </nav>
            </div>
        </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <RouterView />
    </main>
</template>

<style scoped>
nav {
    @apply my-2;

    a {
        @apply mr-2;
    }
}
</style>
