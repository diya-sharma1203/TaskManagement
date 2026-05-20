import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Task } from '../types';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  AlertTriangle, 
  Calendar,
  Clock,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters and sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate-asc');

  // Edit Task status modal (for quick status updates)
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskStatus, setTaskStatus] = useState<'todo' | 'in-progress' | 'completed'>('todo');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get('/tasks');
      setTasks(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setSubmitting(true);

    try {
      const res = await axiosInstance.put(`/tasks/${editingTask._id}`, {
        status: taskStatus
      });
      setTasks(prev => prev.map(t => t._id === editingTask._id ? res.data : t));
      toast.success('Task status updated!');
      setEditingTask(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err: any) {
      toast.error('Failed to delete task');
    }
  };

  const openStatusUpdate = (task: Task) => {
    setEditingTask(task);
    setTaskStatus(task.status);
  };

  // Helper: check if task is overdue
  const isOverdue = (task: Task) => {
    if (task.status === 'completed') return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0,0,0,0);
    return dueDate < today;
  };

  // Filtering & Sorting calculations
  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate-asc') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'dueDate-desc') {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else if (sortBy === 'priority-high') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Workspace Tasks</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {user?.role === 'admin' 
            ? 'Track and organize all tasks across the company workspace.' 
            : 'View and update your personal assigned task list.'}
        </p>
      </div>

      {/* Filter panel */}
      <div className="p-4 bg-white border border-gray-150 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-250 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="dueDate-asc">Due Date (Soonest)</option>
                <option value="dueDate-desc">Due Date (Furthest)</option>
                <option value="priority-high">Priority (Highest)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task directory grid */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-2xl p-12 text-center bg-white shadow-xs">
          <Clock className="h-10 w-10 text-gray-400 mb-3" />
          <h4 className="text-md font-semibold text-gray-700">No Tasks Match</h4>
          <p className="text-gray-500 text-xs mt-0.5 max-w-xs">
            Try adjusting your search criteria or filter properties to locate the task.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => {
            const taskOverdue = isOverdue(task);
            return (
              <div 
                key={task._id} 
                className={`flex flex-col justify-between p-5 bg-white border rounded-2xl shadow-sm transition-all
                  ${taskOverdue ? 'border-red-300 bg-red-50/20' : 'border-gray-150 hover:shadow-md'}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold bg-brand-50 text-brand-600 px-2 py-0.5 rounded border border-brand-100 max-w-[120px] truncate">
                      {task.project?.title || 'Personal Workspace'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase
                      ${task.priority === 'high' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : task.priority === 'medium'
                          ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                          : 'bg-green-50 text-green-600 border-green-100'}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <h3 className="text-md font-bold text-gray-800 mt-4 leading-snug line-clamp-1">
                    {task.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[2rem]">
                    {task.description}
                  </p>
                </div>

                <div className="border-t border-gray-100 mt-4 pt-3.5 space-y-3.5">
                  <div className="flex justify-between items-center text-xxs font-medium text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className={taskOverdue ? 'text-red-600 font-semibold' : ''}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {taskOverdue && (
                      <span className="flex items-center space-x-0.5 text-red-600 font-semibold uppercase tracking-wider">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Overdue</span>
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 pt-0.5">
                    <div className="flex items-center space-x-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-[9px] uppercase">
                        {task.assignedTo?.name?.substring(0, 2) || 'UN'}
                      </div>
                      <span className="text-xxs font-semibold truncate max-w-[100px]">{task.assignedTo?.name}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openStatusUpdate(task)}
                        className="rounded bg-gray-50 hover:bg-brand-50 border border-gray-100 hover:border-brand-100 px-2 py-1 text-[10px] font-bold text-gray-700 hover:text-brand-600 transition-colors uppercase"
                      >
                        {task.status}
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Status Update Modal */}
      <Modal
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        title="Update Task Status"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Status for: <span className="font-bold text-gray-800">{editingTask?.title}</span>
            </label>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setEditingTask(null)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Tasks;
