import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Project, Task, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import { 
  Calendar, 
  Users, 
  Trash2, 
  Edit, 
  Plus, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const SingleProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal control states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  // Form states for Task (Create/Edit)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskStatus, setTaskStatus] = useState<'todo' | 'in-progress' | 'completed'>('todo');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states for Project (Edit)
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStatus, setProjStatus] = useState<'active' | 'completed' | 'on-hold'>('active');
  const [projMembers, setProjMembers] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      const projRes = await axiosInstance.get(`/projects/${id}`);
      setProject(projRes.data);
      setProjTitle(projRes.data.title);
      setProjDesc(projRes.data.description);
      setProjStatus(projRes.data.status);
      setProjMembers(projRes.data.members.map((m: User) => m._id));

      const tasksRes = await axiosInstance.get(`/tasks/project/${id}`);
      setTasks(tasksRes.data);

      if (user?.role === 'admin') {
        const teamRes = await axiosInstance.get('/users/team');
        setTeamMembers(teamRes.data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load project details or tasks');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id, user]);

  // Project Actions
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc) {
      toast.error('Title and Description are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axiosInstance.put(`/projects/${id}`, {
        title: projTitle,
        description: projDesc,
        status: projStatus,
        members: projMembers,
      });
      setProject(res.data);
      toast.success('Project details updated!');
      setIsEditProjectModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return;
    }
    try {
      await axiosInstance.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (err: any) {
      toast.error('Failed to delete project');
    }
  };

  // Task Actions
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDesc || !taskDueDate || !taskAssignedTo) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/tasks', {
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        status: taskStatus,
        dueDate: taskDueDate,
        assignedTo: taskAssignedTo,
        project: id,
      });
      setTasks(prev => [...prev, res.data]);
      toast.success('Task created and assigned!');
      setIsTaskModalOpen(false);
      // Reset form
      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('medium');
      setTaskStatus('todo');
      setTaskDueDate('');
      setTaskAssignedTo('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    // Format date string for input type="date" (YYYY-MM-DD)
    setTaskDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
    setTaskAssignedTo(task.assignedTo._id);
    setIsEditTaskModalOpen(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setSubmitting(true);

    try {
      let bodyPayload: any = {};
      if (user?.role === 'admin') {
        bodyPayload = {
          title: taskTitle,
          description: taskDesc,
          priority: taskPriority,
          status: taskStatus,
          dueDate: taskDueDate,
          assignedTo: taskAssignedTo,
        };
      } else {
        bodyPayload = {
          status: taskStatus,
        };
      }

      const res = await axiosInstance.put(`/tasks/${editingTask._id}`, bodyPayload);
      setTasks(prev => prev.map(t => t._id === editingTask._id ? res.data : t));
      toast.success('Task updated!');
      setIsEditTaskModalOpen(false);
      setEditingTask(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err: any) {
      toast.error('Failed to delete task');
    }
  };

  const handleProjMemberToggle = (mId: string) => {
    setProjMembers(prev => 
      prev.includes(mId) ? prev.filter(id => id !== mId) : [...prev, mId]
    );
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!project) return null;

  // Project progress percent
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/projects" className="hover:text-brand-600 transition-colors">Projects</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-gray-700 truncate max-w-[200px]">{project.title}</span>
      </div>

      {/* Project Details Banner */}
      <div className="p-6 bg-white border border-gray-150 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
              <span className={`text-xxs font-bold px-2.5 py-0.5 rounded-full uppercase border
                ${project.status === 'completed' 
                  ? 'bg-green-50 text-green-600 border-green-100' 
                  : project.status === 'on-hold'
                    ? 'bg-gray-100 text-gray-600 border-gray-200'
                    : 'bg-brand-50 text-brand-600 border-brand-100'}`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-2 max-w-2xl">{project.description}</p>
          </div>

          {user?.role === 'admin' && (
            <div className="flex space-x-2 w-full md:w-auto">
              <button
                onClick={() => setIsEditProjectModalOpen(true)}
                className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteProject}
                className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Project Meta Info & Progress bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xxs text-gray-400 font-semibold uppercase tracking-wider">Project Members</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">{project.members?.length || 0} assigned</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xxs text-gray-400 font-semibold uppercase tracking-wider">Created On</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xxs font-semibold text-gray-400 uppercase tracking-wider">
              <span>Task Progress</span>
              <span className="text-brand-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-brand-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Tasks Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Tasks List</h3>
          <p className="text-xs text-gray-400 mt-0.5">{tasks.length} tasks recorded for this project</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center space-x-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {/* Tasks Table/List representation */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-2xl p-12 text-center bg-white shadow-xs">
          <Clock className="h-10 w-10 text-gray-400 mb-3" />
          <h4 className="text-md font-semibold text-gray-700">No Tasks Assigned</h4>
          <p className="text-gray-500 text-xs mt-0.5 max-w-xs">
            {user?.role === 'admin' 
              ? 'This project does not have any tasks yet. Create one above!'
              : 'There are no tasks assigned to you on this project.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Task Info</th>
                  <th className="px-6 py-4">Assignee</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {tasks.map((task) => {
                  const isAssignedToMe = task.assignedTo?._id === user?._id;
                  const canEditTask = user?.role === 'admin' || isAssignedToMe;

                  return (
                    <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800 leading-tight">{task.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-1 max-w-[240px]">{task.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700 font-bold text-xxs uppercase">
                            {task.assignedTo?.name?.substring(0, 2) || 'UN'}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-800">{task.assignedTo?.name || 'Unassigned'}</p>
                            {isAssignedToMe && (
                              <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1 py-0.2 rounded border border-brand-100">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase
                          ${task.priority === 'high' 
                            ? 'bg-red-50 text-red-600 border-red-100' 
                            : task.priority === 'medium'
                              ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                              : 'bg-green-50 text-green-600 border-green-100'}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase border
                          ${task.status === 'completed' 
                            ? 'bg-green-50 text-green-600 border-green-100' 
                            : task.status === 'in-progress'
                              ? 'bg-yellow-50 text-yellow-600 border-yellow-100'
                              : 'bg-blue-50 text-blue-600 border-blue-100'}`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {canEditTask && (
                            <button
                              onClick={() => handleOpenEditTask(task)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                              title={user?.role === 'admin' ? "Edit Task Details" : "Update Status"}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          {!canEditTask && (
                            <span className="text-xxs text-gray-400 font-medium">Read-Only</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Project Details Modal */}
      <Modal
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        title="Edit Project Details"
      >
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              value={projTitle}
              onChange={(e) => setProjTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={projStatus}
              onChange={(e) => setProjStatus(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Update Project Members
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2.5 divide-y divide-gray-150">
              {teamMembers
                .filter(u => u._id !== project.createdBy) // creator stays
                .map(member => (
                  <label 
                    key={member._id} 
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-1"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={projMembers.includes(member._id)}
                        onChange={() => handleProjMemberToggle(member._id)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-800">{member.name}</p>
                        <p className="text-xxs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsEditProjectModalOpen(false)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
              placeholder="E.g., Complete styling guidelines"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
              placeholder="Explain the technical specifications or requirements..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Initial Status
              </label>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Due Date
            </label>
            <input
              type="date"
              required
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Assign To Project Member
            </label>
            <select
              required
              value={taskAssignedTo}
              onChange={(e) => setTaskAssignedTo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
            >
              <option value="">Select a team member</option>
              {/* Only allow assignment to users listed as project members or creators */}
              {project.members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task / Status Update Modal */}
      <Modal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setEditingTask(null);
        }}
        title={user?.role === 'admin' ? 'Edit Task Details' : 'Update Task Status'}
      >
        <form onSubmit={handleUpdateTask} className="space-y-4">
          {user?.role === 'admin' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Assignee
                </label>
                <select
                  required
                  value={taskAssignedTo}
                  onChange={(e) => setTaskAssignedTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                >
                  {project.members.map(member => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Task Status
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
              <p className="text-xxs text-gray-400 mt-2">
                As a team member, you are authorized to update the status of your assigned tasks only.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsEditTaskModalOpen(false);
                setEditingTask(null);
              }}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default SingleProject;
