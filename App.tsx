import React, { useState, useEffect, useCallback } from 'react';
import ChatWindow from './components/ChatWindow';
import CommandInput from './components/CommandInput';
import AdminDashboard from './components/AdminDashboard';
import AuthScreen from './components/AuthScreen';

export type MessageType = 'text' | 'system' | 'alert' | 'image' | 'video';

export interface SystemConfig {
  companyName: string;
  systemName: string;
}

export interface Sector {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  password: string;
  role: 'admin' | 'user';
  sectorId: string;
  avatar?: string;
  isBlocked?: boolean;
}

export interface Message {
  id: string;
  user: string;
  userId: string;
  role: 'admin' | 'user';
  sectorId: string;
  text: string;
  attachment?: string;
  timestamp: number;
  type: MessageType;
}

const STORAGE_KEY_MSGS = 'nexus_chat_messages_v3';
const STORAGE_KEY_USERS = 'nexus_chat_users_v3';
const STORAGE_KEY_SESSION = 'nexus_chat_session_v3';
const STORAGE_KEY_SECTORS = 'nexus_chat_sectors_v3';
const STORAGE_KEY_CONFIG = 'nexus_chat_config_v1';

const DEFAULT_SECTORS: Sector[] = [
  { id: 'general', name: 'Geral' }
];

const DEFAULT_CONFIG: SystemConfig = {
  companyName: 'Sua Empresa',
  systemName: 'Chat Corporativo'
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sectors, setSectors] = useState<Sector[]>(DEFAULT_SECTORS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  
  // UI State
  const [activeSectorId, setActiveSectorId] = useState<string>('general');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Carregar dados iniciais
  useEffect(() => {
    const savedMsgs = localStorage.getItem(STORAGE_KEY_MSGS);
    const savedSession = localStorage.getItem(STORAGE_KEY_SESSION);
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    const savedSectors = localStorage.getItem(STORAGE_KEY_SECTORS);
    const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);

    if (savedMsgs) {
      try { setMessages(JSON.parse(savedMsgs)); } catch (e) { console.error(e); }
    }

    if (savedSectors) {
      try { setSectors(JSON.parse(savedSectors)); } catch (e) { console.error(e); }
    } else {
      localStorage.setItem(STORAGE_KEY_SECTORS, JSON.stringify(DEFAULT_SECTORS));
    }

    if (savedConfig) {
      try { setSystemConfig(JSON.parse(savedConfig)); } catch (e) { console.error(e); }
    }

    if (savedSession && savedUsers) {
      const sessionUser = JSON.parse(savedSession);
      const allUsers = JSON.parse(savedUsers);
      const userData = allUsers.find((u: User) => u.id === sessionUser.id);
      
      if (userData) {
        if (userData.isBlocked) {
            localStorage.removeItem(STORAGE_KEY_SESSION);
            setCurrentUser(null);
        } else {
            setCurrentUser(userData);
            if (userData.role !== 'admin' && activeSectorId !== 'general' && activeSectorId !== userData.sectorId) {
                setActiveSectorId('general');
            }
        }
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_MSGS && e.newValue) setMessages(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEY_SECTORS && e.newValue) setSectors(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEY_CONFIG && e.newValue) setSystemConfig(JSON.parse(e.newValue));
      
      if (e.key === STORAGE_KEY_USERS && currentUser) {
          const newUsers = JSON.parse(e.newValue || '[]');
          const me = newUsers.find((u: User) => u.id === currentUser.id);
          if (me && me.isBlocked) {
              handleLogout();
              alert('Sua conta foi suspensa pelo administrador.');
          }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [activeSectorId, currentUser]);

  const handleUpdateConfig = (newConfig: SystemConfig) => {
      setSystemConfig(newConfig);
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    setActiveSectorId('general'); 
    
    setTimeout(() => {
        addMessage(`Usuário ${user.username} conectou-se ao canal.`, 'system', 'Sistema', undefined, 'general');
    }, 100);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_SESSION);
    setShowAdminPanel(false);
    setShowMobileMenu(false);
  };

  const addMessage = useCallback((text: string, type: MessageType = 'text', senderName?: string, attachment?: string, targetSectorId?: string) => {
    const finalSectorId = targetSectorId || activeSectorId || 'general'; 
    const sender = currentUser || { username: senderName || 'Guest', role: 'user', id: '0', sectorId: 'general' };
    
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      user: senderName || sender.username,
      userId: sender.id,
      role: sender.role as 'admin' | 'user',
      sectorId: finalSectorId,
      text,
      attachment,
      timestamp: Date.now(),
      type
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      if (updated.length > 300) updated.shift(); 
      try {
        localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(updated));
      } catch (e) {
        const trimmed = updated.slice(-20);
        localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(trimmed));
        return trimmed;
      }
      return updated;
    });
  }, [currentUser, activeSectorId]);

  const handleDeleteMessage = (messageId: string) => {
      if (currentUser?.role !== 'admin') return;
      
      const confirmDelete = window.confirm("Administrador: Deseja apagar esta mensagem permanentemente?");
      if (!confirmDelete) return;

      setMessages(prev => {
          const updated = prev.filter(m => m.id !== messageId);
          localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(updated));
          return updated;
      });
  };

  const handleCommand = (input: string, attachment?: File) => {
    if (attachment) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const isVideo = attachment.type.startsWith('video/');
        addMessage(
          input || (isVideo ? 'Enviou um vídeo' : 'Enviou uma imagem'), 
          isVideo ? 'video' : 'image', 
          undefined, 
          result
        );
      };
      reader.readAsDataURL(attachment);
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('/')) {
      const parts = trimmed.split(' ');
      const command = parts[0].toLowerCase();

      switch (command) {
        case '/sair': handleLogout(); break;
        case '/limpar':
          if (currentUser?.role === 'admin') {
            const filtered = messages.filter(m => m.sectorId !== activeSectorId);
            setMessages(filtered);
            localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(filtered));
            addMessage('Chat deste setor limpo pelo administrador.', 'system');
          } else {
            addMessage('Permissão negada.', 'alert', 'Sistema');
          }
          break;
        default: addMessage(`Comando desconhecido: ${command}`, 'alert', 'Sistema');
      }
      return;
    }
    addMessage(trimmed, 'text');
  };

  const currentSectorMessages = messages.filter(m => {
      const msgSector = m.sectorId || 'general';
      return msgSector === activeSectorId;
  });

  const visibleSectors = sectors.filter(s => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true; 
    return s.id === 'general' || s.id === currentUser.sectorId; 
  });

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} companyName={systemConfig.companyName} />;
  }

  const activeSectorName = sectors.find(s => s.id === activeSectorId)?.name || 'Desconhecido';

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* Header */}
      <header className="h-14 shrink-0 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between px-4 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <div className="flex flex-col">
            <h1 className="font-bold tracking-wider text-slate-100 text-sm md:text-base flex items-center gap-2">
              {systemConfig.companyName.toUpperCase()} <span className="text-cyan-500">CORP</span>
              <span className="hidden md:inline text-[10px] bg-cyan-900/30 px-1.5 py-0.5 rounded text-cyan-400 font-mono border border-cyan-900/50">PRO v4.0</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
               #{activeSectorName.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           {currentUser.role === 'admin' && (
             <button 
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className={`hidden md:block px-3 py-1.5 rounded text-xs font-bold border transition-all ${showAdminPanel ? 'bg-amber-500 text-black border-amber-600' : 'bg-slate-800 text-amber-500 border-slate-700'}`}
             >
               {showAdminPanel ? 'FECHAR PAINEL' : 'ADMINISTRAR'}
             </button>
           )}
           <div className="h-8 w-8 rounded bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold border border-slate-500">
              {currentUser.username.substring(0,2).toUpperCase()}
           </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar de Setores */}
        <div className={`
            absolute md:static z-40 inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300
            ${showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            flex flex-col
        `}>
            <div className="p-4 border-b border-slate-800">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Canais Disponíveis</h2>
                <div className="space-y-1">
                    {visibleSectors.map(sector => (
                        <button
                            key={sector.id}
                            onClick={() => { setActiveSectorId(sector.id); setShowMobileMenu(false); }}
                            className={`w-full text-left px-3 py-2 rounded flex items-center justify-between group transition-colors ${activeSectorId === sector.id ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                        >
                            <span className="font-mono"># {sector.name}</span>
                            {activeSectorId === sector.id && <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-slate-800">
                <button 
                    onClick={handleLogout}
                    className="w-full py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/50 rounded transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    DESCONECTAR
                </button>
            </div>
        </div>

        {/* Area do Chat */}
        <div className="flex-1 flex flex-col relative bg-slate-950/50">
            <div className="flex-1 overflow-hidden relative">
                <ChatWindow 
                  messages={currentSectorMessages} 
                  currentUser={currentUser} 
                  onDeleteMessage={handleDeleteMessage}
                />
            </div>

            <div className="p-3 md:p-4 bg-slate-900 border-t border-slate-800 z-10">
                <CommandInput onSend={handleCommand} placeholder={`Enviar mensagem para #${activeSectorName}...`} />
            </div>

            {/* Admin Panel Overlay (Desktop/Mobile) */}
            {showAdminPanel && currentUser.role === 'admin' && (
                <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm md:static md:w-80 md:border-l md:border-slate-800 md:bg-slate-900 shadow-xl transition-all">
                    <AdminDashboard 
                        messages={messages} 
                        sectors={sectors} 
                        setSectors={setSectors} 
                        onCloseMobile={() => setShowAdminPanel(false)}
                        currentUser={currentUser}
                        systemConfig={systemConfig}
                        onUpdateConfig={handleUpdateConfig}
                    />
                </div>
            )}
        </div>

      </main>
    </div>
  );
};

export default App;