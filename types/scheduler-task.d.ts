export interface ISchedulerTask {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  userId: string; // ID of the user who created the task
  dueDate?: string; // Optional due date for the task
}
