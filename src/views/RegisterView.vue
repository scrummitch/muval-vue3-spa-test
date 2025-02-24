<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const router = useRouter();
const authStore = useAuthStore();

const testCSRF = async () => {
    try {
        const response = await api.post('/test', { test: 'data' });
        console.log('CSRF test successful:', response.data);
    } catch (err) {
        console.error('CSRF test failed:', err);
        error.value = 'CSRF test failed - check console for details';
    }
};

const handleSubmit = async () => {
    error.value = '';
    const success = await authStore.register(name.value, email.value, password.value);
    if (success) {
        await authStore.login(email.value, password.value);
        router.push('/tasks');
    } else {
        error.value = 'Registration failed';
    }
};
</script>

<template>
    <div class="mx-auto max-w-md">
        <h1 class="mb-6 text-3xl font-bold">Register</h1>
        
        <button 
            @click="testCSRF" 
            type="button"
            class="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
            Test CSRF
        </button>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    v-model="name"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

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

            <button type="submit" class="w-full">Register</button>

            <div class="text-center">
                <router-link to="/login" class="text-sm">Already have an account? Login</router-link>
            </div>
        </form>
    </div>
</template> 