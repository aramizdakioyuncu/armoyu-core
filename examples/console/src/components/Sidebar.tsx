import React from 'react';
import { Zap, ChevronRight, Key, Shield, Users, LogOut } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeService: string;
  setActiveService: (service: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  token: string;
  setToken: (token: string) => void;
  user: any;
  onLogout: () => void;
  config: any;
  serviceIcons: Record<string, any>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeService,
  setActiveService,
  apiKey,
  setApiKey,
  token,
  setToken,
  user,
  onLogout,
  config,
  serviceIcons
}) => {
  return (
    <aside className="w-72 glass border-r flex flex-col h-full">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
          <Zap className="w-6 h-6 text-cyan-400" />
        </div>
        <span className="font-bold text-xl tracking-tight neon-text">ARMOYU CORE</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase px-3 pb-2 tracking-wider">Services</p>
        {Object.entries(config).map(([key, service]: [string, any]) => {
          const Icon = serviceIcons[key] || Zap;
          return (
            <button
              key={key}
              onClick={() => setActiveService(key)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm",
                activeService === key
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              )}
            >
              <Icon className={cn("w-5 h-5", activeService === key ? "text-cyan-400" : "text-gray-500")} />
              <span className="font-medium">{service.title}</span>
              <ChevronRight className={cn("ml-auto w-4 h-4 transition-transform", activeService === key ? "translate-x-0" : "opacity-0 -translate-x-2")} />
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-4 bg-black/20">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 flex items-center gap-1.5">
            <Key className="w-3 h-3" /> API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-md px-3 py-2 text-xs focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-700"
            placeholder="bda0b6f2..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> Bearer Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-md px-3 py-2 text-xs focus:border-cyan-500/50 outline-none transition-all placeholder:text-gray-700"
            placeholder="Active Session Token"
          />
        </div>

        {user && (
          <div className="p-4 border-t flex items-center justify-between bg-emerald-500/5 mt-2 rounded-lg border border-emerald-500/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-emerald-500/30 overflow-hidden bg-black/40">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : <Users className="w-4 h-4 text-gray-600 m-2" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-200 truncate max-w-[120px]">{user.displayName || user.username}</span>
                <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Active Session</span>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
