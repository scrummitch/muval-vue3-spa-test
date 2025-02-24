import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE}`,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true, 
    withXSRFToken: true,
});

// Add interceptor to add auth token and CSRF token to requests
api.interceptors.request.use((config) => {
    // Add auth token if it exists
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token from cookie if it exists
    // const csrfToken = getCookie('XSRF-TOKEN');
    // if (csrfToken) {
    //     config.headers['X-CSRF-TOKEN'] = decodeURIComponent(csrfToken);
    // }

    return config;
});

// Helper function to get cookie by name
function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? match[3] : null;
}

export const initializeCsrf = async () => {
    try {
        await axios.get(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_SANCTUM_BASE}/csrf-cookie`, {
            withCredentials: true,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
    } catch (error) {
        console.error('Failed to fetch CSRF cookie:', error);
    }
};

export default api; 