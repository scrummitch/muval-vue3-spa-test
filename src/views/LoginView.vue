<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const error = ref('');

const router = useRouter();
const authStore = useAuthStore();

const handleSubmit = async () => {
    error.value = '';
    const success = await authStore.login(email.value, password.value);
    if (success) {
        router.push('/tasks');
    } else {
        error.value = 'Invalid credentials';
    }
};
</script>

<template>
    <div class="mx-auto max-w-md">
        <h1 class="mb-6 text-3xl font-bold">Login</h1>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div v-if="error" class="text-red-600">{{ error }}</div>

            <button type="submit" class="w-full">Login</button>

            <div class="text-center">
                <router-link to="/register" class="text-sm">Don't have an account? Register</router-link>
            </div>
        </form>
    </div>
</template> 