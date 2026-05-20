import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Project, User } from '../types';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import { 
  FolderPlus, 
  Folder, 
  Users, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [status, setStatus] = useState<'active' | 'completed' | 'on-hold'>('active');
  const [submitting, setSubmitting] = useState(false);

  const fetchProjectsAndTeam = async () => {
    try {
      const projectsRes = await axiosInstance.get('/projects');
      setProjects(projectsRes.data);

      if (user?.role === 'admin') {
        const teamRes = await axiosInstance.get('/users/team');
        // Filter out current user from team list selection (or include them automatically)
        setTeamMembers(teamRes.data.filter((u: User) => u._id !== user?._id));
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load projects list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndTeam();
  }, [user]);

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Title and Description are required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post('/projects', {
        title,
        description,
        members: selectedMembers,
        status
      });
      setProjects(prev => [res.data, ...prev]);
      toast.success('Project created successfully!');
      
      // Reset form & Close modal
      setTitle('');
      setDescription('');
      setSelectedMembers([]);
      setStatus('active');
      setIsModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create project';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Projects Directory</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage and track your active workspace projects.</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm"
          >
            <FolderPlus className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">New Project</span>
          </button>
        )}
      </div>

      {/* Projects List Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-2xl p-12 text-center bg-white shadow-xs">
          <Folder className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No Projects Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mt-1">
            {user?.role === 'admin' 
              ? 'Get started by creating a new project and adding team members.' 
              : 'You are not assigned to any projects yet. Contact your administrator.'}
          </p>
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 rounded-xl bg-brand-50 text-brand-600 px-4 py-2.5 text-sm font-semibold border border-brand-100 hover:bg-brand-100 transition-colors"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="flex flex-col justify-between p-6 bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xxs font-bold px-2 py-0.5 rounded-full uppercase border
                    ${project.status === 'completed' 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : project.status === 'on-hold'
                        ? 'bg-gray-100 text-gray-600 border-gray-200'
                        : 'bg-brand-50 text-brand-600 border-brand-100'}`}
                  >
                    {project.status}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                    <Folder className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mt-4 leading-tight truncate">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-3 min-h-[3.75rem]">
                  {project.description}
                </p>
              </div>

              <div className="border-t border-gray-100 mt-6 pt-4 space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <Users className="h-4 w-4" />
                    <span>{project.members?.length || 0} Members</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link
                  to={`/projects/${project._id}`}
                  className="flex items-center justify-center space-x-1.5 w-full rounded-xl bg-gray-50 hover:bg-brand-50 border border-gray-100 hover:border-brand-100 py-2.5 text-xs font-semibold text-gray-700 hover:text-brand-600 transition-all"
                >
                  <span>Open Project</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
              placeholder="E.g., Client Website Redesign"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
              placeholder="Describe the goals, deliverables, and scope of this project..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Assign Team Members
            </label>
            {teamMembers.length === 0 ? (
              <p className="text-xs text-gray-500">No other team members registered yet.</p>
            ) : (
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2.5 divide-y divide-gray-150">
                {teamMembers.map(member => (
                  <label 
                    key={member._id} 
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-1"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member._id)}
                        onChange={() => handleMemberToggle(member._id)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-800">{member.name}</p>
                        <p className="text-xxs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <span className="text-xxs font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">
                      {member.role}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Projects;
