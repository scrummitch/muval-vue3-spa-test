import { defineStore } from 'pinia';
import axios from 'axios';
import { initializeCsrf } from '@/services/api';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        isAuthenticated: false,
    }),

    actions: {
        async checkAuth() {
            try {
                await initializeCsrf();
                
                const response = await axios.get(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE}/user`, {
                    withCredentials: true,
                    withXSRFToken: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                
                if (response.data) {
                    this.user = response.data;
                    this.isAuthenticated = true;
                    return true;
                }
                throw new Error('No user data received');
            } catch (error) {
                this.isAuthenticated = false;
                this.user = null;
                console.error('Session verification failed:', error);
                return false;
            }
        },

        async login(email: string, password: string) {
            try {
                await initializeCsrf();

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/login`,
                    {
                        email,
                        password,
                    },
                    {
                        withCredentials: true,
                        withXSRFToken: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    }
                );

                await this.checkAuth();
                return true;
            } catch (error) {
                console.error('Login error:', error);
                return false;
            }
        },

        async register(name: string, email: string, password: string) {
            try {
                await initializeCsrf();

                await axios.post(
                    `${import.meta.env.VITE_API_URL}/register`,
                    {
                        name,
                        email,
                        password,
                        password_confirmation: password,
                    },
                    {
                        withCredentials: true,
                        withXSRFToken: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    }
                );
                return true;
            } catch (error) {
                console.error('Registration error:', error);
                return false;
            }
        },

        async logout() {
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/logout`,
                    {},
                    {
                        withCredentials: true,
                        withXSRFToken: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    }
                );
                this.user = null;
                this.isAuthenticated = false;
            } catch (error) {
                console.error('Logout error:', error);
            }
        },
    },
}); 