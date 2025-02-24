export enum TaskStatus {
    pending = 'pending',
    in_progress = 'in_progress',
    completed = 'completed'
}

export const taskStatusLabels: Record<TaskStatus, string> = {
    [TaskStatus.pending]: 'Pending',
    [TaskStatus.in_progress]: 'In Progress',
    [TaskStatus.completed]: 'Completed'
}; 