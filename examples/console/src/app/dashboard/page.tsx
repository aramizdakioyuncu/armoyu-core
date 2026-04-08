'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Users, MessageSquare, Newspaper,
  ShoppingBag, Scale, LifeBuoy, Zap,
  Terminal, Globe, Trash2, CheckCircle2, AlertCircle,
  Lock, Send, RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ArmoyuApi } from '@armoyu/core';

// --- Local Components ---
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { Footer } from '../../components/Footer';

// --- Utils ---
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Icons Mapping ---
const SERVICE_ICONS: Record<string, any> = {
  auth: Shield,
  users: Users,
  social: MessageSquare,
  blog: Newspaper,
  shop: ShoppingBag,
  rules: Scale,
  support: LifeBuoy,
};

// --- Helper Components ---
const ResultTree = ({ data, label, initialOpen = false }: { data: any, label?: string, initialOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const isObject = data && typeof data === 'object';
  const isEmpty = isObject && Object.keys(data).length === 0;

  if (!isObject) {
    return (
      <div className="flex items-center gap-2 py-0.5 text-[11px]">
        {label && <span className="text-gray-500 font-bold">{label}:</span>}
        <span className={cn(
          "font-mono",
          typeof data === 'string' ? 'text-emerald-400' : 'text-amber-400'
        )}>
          {JSON.stringify(data)}
        </span>
      </div>
    );
  }

  return (
    <div className="ml-2 border-l border-white/5 pl-3 py-0.5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-white/5 rounded px-1 -ml-1 transition-all group"
      >
        <div className={cn("w-3 h-3 flex items-center justify-center text-[8px] transition-transform", isOpen ? "rotate-90" : "rotate-0")}>
          ▶
        </div>
        {label && <span className="text-gray-400 font-bold text-[11px]">{label}:</span>}
        <span className="text-[10px] text-gray-600 font-mono">
          {Array.isArray(data) ? `Array[${data.length}]` : `Object{${Object.keys(data).length}}`}
        </span>
      </button>
      
      {isOpen && !isEmpty && (
        <div className="mt-1 space-y-1">
          {Object.entries(data).map(([key, value]) => (
            <ResultTree key={key} data={value} label={key} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Config ---
const CONFIG = {
  auth: {
    title: "AuthService",
    actions: [
      { id: "login", name: "Login", method: "POST", endpoint: "/0/0/0", inputs: ["username", "password"], desc: "Bot-based authentication flow", auth: false },
      { id: "me", name: "Get Me", method: "GET", endpoint: "/me", inputs: [], desc: "Fetch current user profile", auth: true }
    ]
  },
  rules: {
    title: "RuleService",
    actions: [
      { id: "getRules", name: "Get Rules", method: "POST", endpoint: "/kurallar/0", inputs: [], desc: "Fetch community rules", auth: false },
      { id: "createRule", name: "Create Rule", method: "POST", endpoint: "/kurallar/0/ekle", inputs: ["text", "penalty"], desc: "Add a new rule", auth: true }
    ]
  },
  users: {
    title: "UserService",
    actions: [
      { id: "getUser", name: "Get Profile", method: "POST", endpoint: "/0/0/0/", inputs: ["oyuncubakusername"], desc: "Lookup any user profile", auth: false }
    ]
  },
  social: {
    title: "SocialService",
    actions: [
      { id: "getFeed", name: "News Feed", method: "GET", endpoint: "/0/0/sosyal/liste/1/", inputs: ["page"], desc: "Community activity feed", auth: false }
    ]
  }
};

export default function Dashboard() {
  const router = useRouter();
  const [activeService, setActiveService] = useState('auth');
  const [apiKey, setApiKey] = useState('');
  const [testToken, setTestToken] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [actionResults, setActionResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);
  
  const [portalUser, setPortalUser] = useState<any>(null); // Who is using the portal
  const [testUser, setTestUser] = useState<any>(null);     // Who the API is currently testing
  
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Library instance
  const apiRef = useRef<ArmoyuApi | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('armoyu_api_key');
    const savedToken = localStorage.getItem('armoyu_test_token');
    const savedPortalUser = localStorage.getItem('armoyu_portal_user');
    const savedTestUser = localStorage.getItem('armoyu_test_user');
    
    if (savedPortalUser) setPortalUser(JSON.parse(savedPortalUser));

    if (savedKey) setApiKey(savedKey);
    if (savedToken) setTestToken(savedToken);
    if (savedTestUser) setTestUser(JSON.parse(savedTestUser));
  }, []);

  useEffect(() => {
    // Only persist API Key and Test Token here
    localStorage.setItem('armoyu_api_key', apiKey);
    localStorage.setItem('armoyu_test_token', testToken);

    if (apiKey) {
      apiRef.current = new ArmoyuApi({
        baseUrl: `/api/proxy`,
        apiKey: apiKey,
        token: testToken
      });
    }
  }, [apiKey, testToken]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (type: 'req' | 'res' | 'err', title: string, data: any, meta?: any) => {
    setLogs(prev => [...prev, { id: Date.now(), type, title, data, meta, time: new Date().toLocaleTimeString() }]);
  };

  const handleExecute = async (action: any) => {
    if (!apiRef.current) {
      addLog('err', "Initialization Error", { message: "System failed to initialize. Try re-entering the API Key." });
      return;
    }

    setLoading(action.id);
    addLog('req', `Executing ${action.name}`, { id: action.id, endpoint: action.endpoint, inputs });

    try {
      let result: any;
      const api = apiRef.current;

      if (activeService === 'auth') {
        if (action.id === 'login') {
          const authResult = await api.auth.login(inputs.username, inputs.password);
          result = authResult;
          setTestToken(api.auth.getSession()?.token || '');
          setTestUser(authResult.user);
          localStorage.setItem('armoyu_test_user', JSON.stringify(authResult.user));
        } else if (action.id === 'me') {
          const profile = await api.auth.me();
          result = profile;
          setTestUser(profile);
          if (profile) localStorage.setItem('armoyu_test_user', JSON.stringify(profile));
        }
      } else if (activeService === 'users') {
        if (action.id === 'getUser') {
          result = await api.users.getUserByUsername(inputs.oyuncubakusername);
        }
      } else if (activeService === 'rules') {
        if (action.id === 'getRules') {
          result = await api.rules.getRules();
        } else if (action.id === 'createRule') {
          result = await api.rules.createRule(inputs.text, inputs.penalty);
        }
      } else if (activeService === 'social') {
        if (action.id === 'getFeed') {
          result = await api.social.getFeed(Number(inputs.page) || 1);
        }
      }

      const rawResponse = (apiRef.current as any)?.lastResponse || result;
      
      // Store both raw and mapped result per action
      setActionResults(prev => ({ 
        ...prev, 
        [action.id + activeService]: { 
          raw: rawResponse, 
          mapped: result,
          view: 'mapped' // Default to class view to show the result of "giydirme"
        } 
      }));

      addLog('res', `Success: ${action.name}`, null, { 
        status: 1, 
        aciklama: rawResponse?.aciklama || "İşlem Başarılı",
        endpoint: action.endpoint
      });
    } catch (err: any) {
      const rawError = (apiRef.current as any)?.lastResponse || { message: err.message, data: err.data };
      addLog('err', `Error: ${action.name}`, rawError, {
        status: 0,
        aciklama: err.message,
        endpoint: action.endpoint
      });
    } finally {
      setLoading(null);
    }
  };

  const handleLogout = async () => {
    if (apiRef.current) {
      await apiRef.current.auth.logout();
    }
    // Clear Portal session
    document.cookie = "armoyu_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem('armoyu_token');
    localStorage.removeItem('armoyu_portal_user');
    
    // Clear Test session
    localStorage.removeItem('armoyu_test_token');
    localStorage.removeItem('armoyu_test_user');
    
    setPortalUser(null);
    setTestUser(null);
    setTestToken('');
    router.push('/');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        activeService={activeService}
        setActiveService={setActiveService}
        apiKey={apiKey}
        setApiKey={setApiKey}
        token={testToken}
        setToken={setTestToken}
        user={testUser}
        onLogout={handleLogout}
        config={CONFIG}
        serviceIcons={SERVICE_ICONS}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
        <Navbar 
          user={portalUser} 
          apiKey={apiKey} 
          onLogout={handleLogout} 
          onNavigateAuth={() => setActiveService('auth')}
          activeServiceTitle={(CONFIG as any)[activeService].title}
          icon={SERVICE_ICONS[activeService] || Zap}
        />

        <div className="flex-1 overflow-hidden flex">
          <section className="flex-1 overflow-y-auto p-8 space-y-6">
            {(CONFIG as any)[activeService].actions.map((action: any) => (
              <div key={action.id} className="glass rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded border",
                        action.method === 'POST' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5'
                      )}>
                        {action.method}
                      </span>
                      <h3 className="text-lg font-bold text-gray-200">{action.name}</h3>
                      {action.auth && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 tracking-widest ml-1">
                          <Lock className="w-2.5 h-2.5" />
                          AUTH REQUIRED
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 max-w-xl">{action.desc}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-[10px] font-mono text-gray-600 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                      {action.endpoint}
                    </div>
                    <div className="text-[9px] font-mono text-cyan-500/50 group-hover:text-cyan-500 transition-colors bg-white/5 px-2 py-1 rounded">
                      https://api.armoyu.com/botlar/{apiKey || 'YOUR_KEY'}{action.endpoint}
                    </div>
                  </div>
                </div>

                {action.inputs.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {action.inputs.map((input: string) => (
                      <div key={input} className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{input}</label>
                        <input
                          type={input === 'password' ? 'password' : 'text'}
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-cyan-500/30 outline-none transition-all text-white"
                          placeholder={`Enter ${input}...`}
                          value={inputs[input] || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, [input]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleExecute(action)}
                  disabled={!!loading || (action.auth && !testToken)}
                  className={cn(
                    "w-full py-4 rounded-xl text-sm font-bold tracking-widest transition-all flex items-center justify-center gap-3 border",
                    loading === action.id 
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : (action.auth && !testToken)
                        ? "bg-red-500/5 border-red-500/10 text-red-500/50 cursor-not-allowed"
                        : "bg-white/5 hover:bg-cyan-500/10 border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-400"
                  )}
                >
                  {loading === action.id ? <RefreshCw className="w-5 h-5 animate-spin" /> : (action.auth && !testToken) ? <Lock className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                  {loading === action.id 
                    ? 'EXECUTING...' 
                    : (action.auth && !testToken) 
                      ? 'LOCKED - LOGIN REQUIRED' 
                      : `EXECUTE ${action.name.toUpperCase()}`}
                </button>

                {actionResults[action.id + activeService] && (
                  <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Result Explorer</span>
                        <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                          <button 
                            onClick={() => setActionResults(prev => ({ 
                              ...prev, 
                              [action.id + activeService]: { ...prev[action.id + activeService], view: 'raw' } 
                            }))}
                            className={cn(
                              "px-2 py-1 text-[9px] font-bold rounded-md transition-all",
                              actionResults[action.id + activeService].view === 'raw' ? "bg-cyan-500 text-black" : "text-gray-500 hover:text-gray-300"
                            )}
                          >
                            RAW JSON
                          </button>
                          <button 
                            onClick={() => setActionResults(prev => ({ 
                              ...prev, 
                              [action.id + activeService]: { ...prev[action.id + activeService], view: 'mapped' } 
                            }))}
                            className={cn(
                              "px-2 py-1 text-[9px] font-bold rounded-md transition-all",
                              actionResults[action.id + activeService].view === 'mapped' ? "bg-cyan-500 text-black" : "text-gray-500 hover:text-gray-300"
                            )}
                          >
                            MAPPED CLASS
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActionResults(prev => { 
                          const next = { ...prev };
                          delete next[action.id + activeService];
                          return next;
                        })}
                        className="text-[9px] font-bold text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        CLEAR
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                      <ResultTree 
                        data={
                          actionResults[action.id + activeService].view === 'mapped' 
                            ? JSON.parse(JSON.stringify(actionResults[action.id + activeService].mapped))
                            : actionResults[action.id + activeService].raw
                        } 
                        initialOpen={true} 
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>

          <section className="w-[500px] border-l glass flex flex-col">
            <div className="h-14 border-b flex items-center justify-between px-6 bg-black/20">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Live Console Output</span>
              </div>
              <button
                onClick={() => setLogs([])}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] space-y-4">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 pointer-events-none">
                  <Terminal className="w-12 h-12 mb-4" />
                  <p className="text-center text-sm font-bold tracking-tight">System Ready.<br/>Await command execution...</p>
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className={cn(
                    "p-4 rounded-xl border leading-relaxed",
                    log.type === 'req' ? "bg-white/5 border-white/10" :
                      log.type === 'res' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
                  )}>
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        {log.type === 'req' ? <Globe className="w-3.5 h-3.5 text-gray-400" /> :
                          log.type === 'res' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                        <span className={cn(
                          "font-black uppercase tracking-tighter",
                          log.type === 'req' ? "text-gray-300" : log.type === 'res' ? "text-emerald-500" : "text-red-500"
                        )}>
                          {log.type}
                        </span>
                        <span className="text-gray-600 opacity-50">•</span>
                        <span className="text-gray-400 font-bold">{log.title}</span>
                      </div>
                      <span className="text-[9px] text-gray-600 font-bold">{log.time}</span>
                    </div>

                    {log.data && (
                      <pre className="overflow-x-auto text-gray-300 scrollbar-hide mb-3 max-h-[150px]">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}

                    {log.meta && (
                      <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
                        {log.meta.aciklama && (
                          <div className={cn(
                            "w-full text-[10px] font-bold py-1 mb-1",
                            log.type === 'res' ? 'text-emerald-400/80' : 'text-red-400/80'
                          )}>
                            {log.meta.aciklama}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {log.meta.status !== undefined && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-gray-500 uppercase tracking-widest border border-white/5">
                              Status: {log.meta.status}
                            </span>
                          )}
                          {log.meta.endpoint && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-gray-500 border border-white/5">
                              {log.meta.endpoint}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={consoleEndRef} />
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
