'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ArmoyuApi } from '@armoyu/core';

// --- Local Components ---
import { Navbar } from '../components/Navbar';
import { WelcomeHero } from '../components/WelcomeHero';
import { Footer } from '../components/Footer';

export default function DevelopersPortalLanding() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const apiRef = useRef<ArmoyuApi | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('armoyu_api_key');
    const savedUser = localStorage.getItem('armoyu_portal_user');
    
    if (savedKey) setApiKey(savedKey);
    if (savedUser) setUser(JSON.parse(savedUser));

    // Initialize API for the portal login
    apiRef.current = new ArmoyuApi({
      baseUrl: `/api/proxy`,
      apiKey: savedKey || ''
    });
  }, []);

  const handlePortalAuth = async (u: string, p: string) => {
    setLoading(true);
    // Minimal delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const portalToken = "portal_access_token_dev_" + Math.random().toString(36).substr(2, 9);
      const mockUser = {
         displayName: "ARMOYU Developer",
         avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Armoyu",
         id: "DEV-1001"
      };

      // Set Cookie for Middleware
      document.cookie = `armoyu_token=${portalToken}; path=/; max-age=31536000; SameSite=Lax`;
      
      localStorage.setItem('armoyu_portal_user', JSON.stringify(mockUser));
      localStorage.setItem('armoyu_token', portalToken);
      
      setUser(mockUser);

      // Hard redirect to ensure middleware and dashboard pick up the new session
      window.location.href = '/dashboard';
    } catch (err: any) {
      alert(`Portal Access Denied: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerPortalLogin = async (u: string = 'developer', p: string = 'portal') => {
    if (user) {
      window.location.href = '/dashboard';
      return;
    }

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    window.open(
      'https://accounts.aramizdakioyuncu.com', 
      'ARMOYU Login', 
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Trigger the actual login logic after a small "formalite" delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        handlePortalAuth(u, p);
        resolve();
      }, 500);
    });
  };

  const handleLogout = () => {
    document.cookie = "armoyu_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem('armoyu_token');
    localStorage.removeItem('armoyu_portal_user');
    setUser(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar 
        user={user} 
        apiKey={apiKey} 
        onLogout={handleLogout} 
        onNavigateAuth={triggerPortalLogin}
        activeServiceTitle="ARMOYU DEVELOPERS"
        icon={Zap}
      />
      <WelcomeHero 
        onEnter={() => window.location.href = '/dashboard'} 
        onLogin={triggerPortalLogin}
        user={user} 
        loading={loading}
      />
      <Footer />
    </div>
  );
}
