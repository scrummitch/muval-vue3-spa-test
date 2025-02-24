import { defineStore } from 'pinia';
import api from '@/services/api';
import { TaskStatus } from '@/types/task';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    user_id: number;
    created_at: string;
    updated_at: string;
    user: User;
}

interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        path: string;
        per_page: number;
        to: number;
    };
}

interface CreateTaskDTO {
    title: string;
    description: string;
    status?: TaskStatus;
}

interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: TaskStatus;
}

interface TasksState {
    tasks: Task[];
    loading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        perPage: number;
    };
}

export const useTasksStore = defineStore('tasks', {
    state: (): TasksState => ({
        tasks: [],
        loading: false,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            perPage: 15
        }
    }),

    actions: {
        async fetchTasks(page: number = 1) {
            this.loading = true;
            try {
                const response = await api.get<PaginatedResponse<Task>>('/tasks', {
                    params: { page }
                });
                this.tasks = response.data.data;
                this.pagination = {
                    currentPage: response.data.meta.current_page,
                    totalPages: Math.ceil(response.data.meta.to / response.data.meta.per_page),
                    perPage: response.data.meta.per_page
                };
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                this.loading = false;
            }
        },

        async createTask(task: CreateTaskDTO) {
            try {
                const response = await api.post('/tasks', task);
                this.tasks.push(response.data);
                return true;
            } catch (error) {
                throw error;
            }
        },

        async updateTask(id: number, task: UpdateTaskDTO) {
            try {
                const response = await api.put(`/tasks/${id}`, task);
                const index = this.tasks.findIndex((t) => t.id === id);
                if (index !== -1) {
                    this.tasks[index] = response.data;
                }
                return true;
            } catch (error) {
                throw error;
            }
        },

        async deleteTask(id: number) {
            try {
                await api.delete(`/tasks/${id}`);
                this.tasks = this.tasks.filter((t) => t.id !== id);
                return true;
            } catch (error) {
                console.error('Error deleting task:', error);
                return false;
            }
        },
    },
}); 