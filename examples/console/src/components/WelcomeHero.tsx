import React from 'react';
import { Zap, Terminal, Shield, Globe, ChevronRight, MessageSquare, Newspaper, ShoppingBag, LogOut } from 'lucide-react';

interface WelcomeHeroProps {
  onEnter: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
  user: any;
  loading: boolean;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onEnter, onLogin, user, loading }) => {
  const [username, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(username, password);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-background to-background overflow-y-auto">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold tracking-widest uppercase animate-fade-in">
            <Zap className="w-4 h-4" />
            Empowering Game Developers
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            Welcome to <span className="neon-text">ARMOYU</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Developer Portal</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            The most powerful, type-safe SDK for building next-generation gaming communities. 
          </p>
        </div>

        {user ? (
          <div className="flex flex-col items-center gap-6 animate-slide-up">
            <div className="flex items-center gap-4 p-4 glass rounded-2xl border-cyan-500/20 max-w-sm">
               <img src={user.avatar || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-full ring-2 ring-cyan-500/50" alt="" />
               <div className="text-left">
                  <p className="text-xs text-gray-400 font-bold uppercase transition-widest">Geliştirici Olarak Giriş Yapıldı</p>
                  <p className="text-white font-black">{user.displayName}</p>
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={onEnter}
                className="px-12 py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] uppercase tracking-widest flex items-center gap-3"
              >
                KONSOLA GİRİŞ YAP
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto w-full glass p-10 rounded-3xl border-white/5 space-y-8 animate-slide-up">
            <div className="space-y-3">
               <h2 className="text-2xl font-black text-white flex items-center justify-center gap-3">
                 <Shield className="w-8 h-8 text-cyan-400" />
                 ARMOYU AUTH
               </h2>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                 GELIŞTIRICI PORTALINA ERIŞMEK IÇIN <br /> ARMOYU HESABINIZLA OTURUM AÇIN
               </p>
            </div>

            <button
              onClick={() => {
                const width = 600;
                const height = 700;
                const left = (window.innerWidth / 2) - (width / 2);
                const top = (window.innerHeight / 2) - (height / 2);
                window.open(
                  'https://accounts.aramizdakioyuncu.com', 
                  'ARMOYU Login', 
                  `width=${width},height=${height},top=${top},left=${left}`
                );
                // Faster simulation
                setTimeout(() => onLogin('developer', 'portal'), 500);
              }}
              disabled={loading}
              className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-2xl text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-4 shadow-xl shadow-cyan-500/20"
            >
              {loading ? <Zap className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5 -rotate-90" />}
              {loading ? 'YETKILENDIRILIYOR...' : 'ARMOYU İLE GİRİŞ YAP'}
            </button>
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">
              Giriş yaparak geliştirici şartlarını kabul etmiş sayılırsınız.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            { icon: Terminal, title: "SDK Simplicity", desc: "Native TypeScript support with auto-completion for all ARMOYU services." },
            { icon: Shield, title: "Secure Auth", desc: "Robust bot and user-level authentication patterns built-in." },
            { icon: Globe, title: "Global Scale", desc: "Handle millions of requests with our distributed proxy infrastructure." }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-2xl border-white/5 text-left hover:border-cyan-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 pb-12">
        <MessageSquare className="w-8 h-8 text-white" />
        <Newspaper className="w-8 h-8 text-white" />
        <ShoppingBag className="w-8 h-8 text-white" />
        <Shield className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};
