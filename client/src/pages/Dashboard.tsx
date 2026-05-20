import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Task } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListTodo, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get('/tasks');
        setTasks(res.data);
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to load dashboard tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  // Stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
  
  // Overdue: status is not completed and due date is before today (midnight)
  const today = new Date();
  today.setHours(0,0,0,0);
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0,0,0,0);
    return dueDate < today;
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get urgent tasks (high priority, pending, sorted by due date)
  const urgentTasks = tasks
    .filter(t => t.status !== 'completed' && t.priority === 'high')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const stats = [
    { name: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { name: 'Completed Tasks', value: completedTasks, icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-100' },
    { name: 'Pending Tasks', value: pendingTasks, icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
    { name: 'Overdue Tasks', value: overdueTasks.length, icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 p-6 rounded-2xl bg-white border border-gray-150 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Workspace Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Here is a quick summary of your team's task progress.</p>
        </div>
        <div className="flex items-center space-x-2 text-brand-600 bg-brand-50 px-4 py-2 rounded-xl text-sm font-semibold border border-brand-100">
          <TrendingUp className="h-4 w-4" />
          <span>{completionRate}% Tasks Completed</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="flex items-center p-6 bg-white border border-gray-150 rounded-2xl shadow-sm">
              <div className={`p-3 rounded-xl border ${stat.color.split(' ')[1]} ${stat.color.split(' ')[2]}`}>
                <Icon className={`h-6 w-6 ${stat.color.split(' ')[0]}`} />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress Card */}
        <div className="lg:col-span-1 p-6 bg-white border border-gray-150 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Project Progress</h3>
            <p className="text-xs text-gray-400 mt-0.5">Overall task completion rates</p>
          </div>
          <div className="my-8 flex items-center justify-center">
            {/* Visual Circular/radial progress mimicry */}
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36">
                <circle className="text-gray-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="58" cx="72" cy="72"/>
                <circle 
                  className="text-brand-500" 
                  strokeWidth="10" 
                  strokeDasharray={364} 
                  strokeDashoffset={364 - (364 * completionRate) / 100} 
                  strokeLinecap="round" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="58" 
                  cx="72" 
                  cy="72"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-extrabold text-gray-850">{completionRate}%</span>
                <span className="block text-xxs font-semibold uppercase text-gray-400 tracking-wider mt-0.5">Done</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
            <span className="text-gray-500 font-medium">Active pending:</span>
            <span className="font-bold text-gray-800">{pendingTasks} tasks</span>
          </div>
        </div>

        {/* Urgent High Priority Tasks */}
        <div className="lg:col-span-2 p-6 bg-white border border-gray-150 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Urgent High-Priority Tasks</h3>
              <Link to="/tasks" className="text-xs font-semibold text-brand-600 hover:text-brand-500 flex items-center space-x-1">
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Active high priority tasks requiring immediate attention</p>
          </div>

          <div className="mt-4 divide-y divide-gray-100 flex-1">
            {urgentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <span className="text-sm">No pending high priority tasks. Great job!</span>
              </div>
            ) : (
              urgentTasks.map((task) => (
                <div key={task._id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-semibold text-gray-800 truncate">{task.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xxs font-medium bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded border border-brand-100 truncate max-w-[120px]">
                        {task.project?.title || 'Unknown Project'}
                      </span>
                      <span className="text-xxs text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xxs font-semibold px-2 py-1 rounded-full uppercase border
                    ${task.status === 'in-progress' 
                      ? 'bg-yellow-50 text-yellow-600 border-yellow-100' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
