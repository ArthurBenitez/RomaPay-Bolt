import React from 'react';
import { User } from '../types';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onAdminClick: () => void;
  onNotificationsClick: () => void;
  unreadNotifications: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onLogout, 
  onAdminClick, 
  onNotificationsClick,
  unreadNotifications 
}) => {
  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wider">
              ROMA PAY
            </h1>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserIcon size={20} className="text-cyan-400" />
                <span className="text-cyan-300 font-medium">{user.name}</span>
              </div>

              {/* Botão de Notificações */}
              <button
                onClick={onNotificationsClick}
                className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded hover:from-purple-400 hover:to-pink-400 transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg shadow-purple-500/25"
              >
                <Bell size={16} />
                <span>Notificações</span>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
              {user.isAdmin && (
                <button
                  onClick={onAdminClick}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded text-sm hover:from-red-400 hover:to-pink-400 transition-all duration-300 font-bold neon-glow"
                >
                  sss
                </button>
              )}

              <button
                onClick={onLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded hover:from-red-400 hover:to-red-500 transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg shadow-red-500/25"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};