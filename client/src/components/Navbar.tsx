import React from 'react';
import { Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen }: NavbarProps) => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* Left side: Hamburger menu & Title */}
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Team Workspace</h1>
      </div>

      {/* Right side: Greeting & Avatar */}
      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-gray-700">Welcome, {user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role} Access</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white font-medium shadow-sm hover:opacity-90 transition-opacity cursor-pointer">
          <UserIcon className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
};
export default Navbar;
