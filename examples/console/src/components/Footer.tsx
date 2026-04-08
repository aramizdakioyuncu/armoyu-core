import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-12 border-t glass px-8 flex items-center justify-between text-[10px] font-bold tracking-widest text-gray-500 uppercase">
      <div className="flex items-center gap-6">
        <span>© 2026 ARMOYU PLATFORM</span>
        <span className="text-gray-700">|</span>
        <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
        <a href="#" className="hover:text-cyan-400 transition-colors">API Status</a>
        <a href="#" className="hover:text-cyan-400 transition-colors">Discord</a>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
          <span>v1.0.0 Stable</span>
        </div>
      </div>
    </footer>
  );
};
