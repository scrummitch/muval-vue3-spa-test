<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import type { Task, CreateTaskDTO } from '@/stores/tasks';
import { TaskStatus, taskStatusLabels } from '@/types/task';
import type { ValidationError } from '@/types/api';

const tasksStore = useTasksStore();
const newTask = ref<CreateTaskDTO>({
    title: '',
    description: '',
    status: TaskStatus.pending
});
const editingTask = ref<Task | null>(null);
const formErrors = ref<{ [key: string]: string[] }>({});
const editFormErrors = ref<{ [key: string]: string[] }>({});

// Task status options for the dropdown
const statusOptions = Object.entries(taskStatusLabels).map(([value, label]) => ({
    value,
    label
}));

onMounted(() => {
    tasksStore.fetchTasks();
});

const createTask = async () => {
    formErrors.value = {};
    
    if (newTask.value.title.trim()) {
        try {
            const success = await tasksStore.createTask(newTask.value);
            if (success) {
                resetForm();
                await tasksStore.fetchTasks();
            }
        } catch (error) {
            if (error.response?.data) {
                const validationError = error.response.data as ValidationError;
                formErrors.value = validationError.errors;
            }
        }
    }
};

const startEdit = (task: Task) => {
    // Create a copy of the task to edit
    editingTask.value = { ...task };
};

const saveEdit = async () => {
    editFormErrors.value = {};
    
    if (editingTask.value) {
        try {
            const success = await tasksStore.updateTask(editingTask.value.id, {
                title: editingTask.value.title,
                description: editingTask.value.description,
                status: editingTask.value.status
            });
            if (success) {
                editingTask.value = null;
                await tasksStore.fetchTasks();
            }
        } catch (error) {
            if (error.response?.data) {
                const validationError = error.response.data as ValidationError;
                editFormErrors.value = validationError.errors;
            }
        }
    }
};

const cancelEdit = () => {
    editingTask.value = null;
    editFormErrors.value = {};
};

const deleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
        const success = await tasksStore.deleteTask(id);
        if (success) {
            // Refresh task list
            await tasksStore.fetchTasks();
        }
    }
};

const resetForm = () => {
    newTask.value = {
        title: '',
        description: '',
        status: TaskStatus.pending
    };
    formErrors.value = {};
};

const getStatusColor = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.completed:
            return 'bg-green-100 text-green-800';
        case TaskStatus.in_progress:
            return 'bg-blue-100 text-blue-800';
        case TaskStatus.pending:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusLabel = (status: TaskStatus): string => {
    return taskStatusLabels[status];
};
</script>

<template>
    <div class="mx-auto max-w-4xl">
        <h1 class="mb-6 text-3xl font-bold">Tasks</h1>

        <!-- Create Task Form -->
        <div class="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 class="mb-4 text-xl font-semibold">Create New Task</h2>
            <form @submit.prevent="createTask" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        v-model="newTask.title"
                        type="text"
                        required
                        :class="[
                            'mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                            formErrors.title ? 'border-red-300' : 'border-gray-300'
                        ]"
                    />
                    <div v-if="formErrors.title" class="mt-1">
                        <p v-for="error in formErrors.title" 
                           :key="error" 
                           class="text-sm text-red-600">
                            {{ error }}
                        </p>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        v-model="newTask.description"
                        :class="[
                            'mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                            formErrors.description ? 'border-red-300' : 'border-gray-300'
                        ]"
                    ></textarea>
                    <div v-if="formErrors.description" class="mt-1">
                        <p v-for="error in formErrors.description" 
                           :key="error" 
                           class="text-sm text-red-600">
                            {{ error }}
                        </p>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        v-model="newTask.status"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
                <button
                    type="submit"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Create Task
                </button>
            </form>
        </div>

        <!-- Tasks List -->
        <div class="space-y-4">
            <div v-for="task in tasksStore.tasks" :key="task.id" class="rounded-lg bg-white p-6 shadow">
                <div v-if="editingTask?.id === task.id">
                    <!-- Edit Form -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                v-model="editingTask.title"
                                :class="[
                                    'mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                                    editFormErrors.title ? 'border-red-300' : 'border-gray-300'
                                ]"
                            />
                            <div v-if="editFormErrors.title" class="mt-1">
                                <p v-for="error in editFormErrors.title" 
                                   :key="error" 
                                   class="text-sm text-red-600">
                                    {{ error }}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                v-model="editingTask.description"
                                :class="[
                                    'mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                                    editFormErrors.description ? 'border-red-300' : 'border-gray-300'
                                ]"
                            ></textarea>
                            <div v-if="editFormErrors.description" class="mt-1">
                                <p v-for="error in editFormErrors.description" 
                                   :key="error" 
                                   class="text-sm text-red-600">
                                    {{ error }}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                v-model="editingTask.status"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button
                                @click="saveEdit"
                                class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                Save
                            </button>
                            <button
                                @click="cancelEdit"
                                class="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <!-- Task Display -->
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-semibold">{{ task.title }}</h3>
                        <span
                            :class="[
                                'px-2 py-1 text-xs font-medium rounded-full',
                                getStatusColor(task.status)
                            ]"
                        >
                            {{ getStatusLabel(task.status) }}
                        </span>
                    </div>
                    <p class="mt-2 text-gray-600">{{ task.description }}</p>
                    <div class="mt-4 flex justify-end space-x-2">
                        <button
                            @click="startEdit(task)"
                            class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            @click="deleteTask(task.id)"
                            class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template> 