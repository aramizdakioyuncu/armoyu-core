import React from 'react';
import { Shield, Key, AlertCircle, LogOut, Users, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  user: any;
  apiKey: string;
  onLogout: () => void;
  onNavigateAuth: () => void;
  activeServiceTitle: string;
  icon: any;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  apiKey, 
  onLogout, 
  onNavigateAuth, 
  activeServiceTitle,
  icon: Icon
}) => {
  return (
    <header className="h-20 border-b glass px-8 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-white/5">
          <Icon className="w-6 h-6 text-gray-300" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-100 uppercase tracking-wide">
            {activeServiceTitle}
          </h1>
          <p className="text-xs text-gray-500">Service API Integration Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-white/5">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-200">{user.displayName}</span>
                <span className="text-[9px] text-gray-500 font-mono">ID: {user.id || 'N/A'}</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shadow-2xl ring-2 ring-cyan-500/20">
                <img src={user.avatar || 'https://via.placeholder.com/40'} className="w-full h-full object-cover" alt="Profile" />
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 text-[10px] font-bold transition-all uppercase tracking-tighter"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border",
              apiKey ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
            )}>
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", apiKey ? "bg-emerald-500" : "bg-red-500")} />
              {apiKey ? 'SOCKET CONNECTED' : 'SOCKET DISCONNECTED'}
            </div>
            <button 
              onClick={onNavigateAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 text-xs font-bold transition-all uppercase"
            >
              <LogOut className="w-4 h-4 rotate-180" />
              Giriş Yap
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
