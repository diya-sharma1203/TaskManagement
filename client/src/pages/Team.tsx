import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { User } from '../types';
import { Mail, Calendar, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Team: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axiosInstance.get('/users/team');
        setMembers(res.data);
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to load team directory');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

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
        <h2 className="text-2xl font-bold text-gray-800">Team Directory</h2>
        <p className="text-gray-500 text-sm mt-0.5">Explore active workspace colleagues and role privileges.</p>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div 
            key={member._id} 
            className="p-6 bg-white border border-gray-150 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            {/* Initials & role badge */}
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700 font-bold text-sm uppercase">
                {member.name.substring(0, 2)}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border flex items-center space-x-1
                ${member.role === 'admin' 
                  ? 'bg-purple-50 text-purple-600 border-purple-100' 
                  : 'bg-blue-50 text-blue-600 border-blue-100'}`}
              >
                {member.role === 'admin' && <Shield className="h-2.5 w-2.5 mr-0.5" />}
                <span>{member.role}</span>
              </span>
            </div>

            {/* Profile info */}
            <div>
              <h3 className="text-md font-bold text-gray-800 leading-snug truncate">{member.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{member.role} Member</p>
            </div>

            {/* Metadatas */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{member.email}</span>
              </div>
              {member.createdAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Joined: {new Date(member.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Team;
