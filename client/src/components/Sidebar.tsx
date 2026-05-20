import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', to: '/projects', icon: FolderKanban },
    { name: 'Tasks', to: '/tasks', icon: CheckSquare },
    { name: 'Team', to: '/team', icon: Users },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed bottom-0 top-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:h-screen
      `}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-lg">
              T
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Ethara Task</span>
          </div>
          <button 
            type="button"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-brand-50 text-brand-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="flex items-center space-x-3 px-2 py-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold uppercase">
              {user?.name.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
