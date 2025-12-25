
import React, { useState } from 'react';
import { X, Cloud, RefreshCw, Trash2, CheckCircle2, ShieldCheck, AlertCircle, Code, Database, Key, Server } from 'lucide-react';
import { IntegrationSession } from '../types';

// --- CONSTANTES E HELPERS (Definidos no topo para evitar erros de script) ---

const SettingsIconFake = ({size}: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

const PROVIDERS = [
  { id: 'intelbras', name: 'Intelbras Cloud', icon: 'I', color: 'bg-green-600' },
  { id: 'hikvision', name: 'Hik-Connect', icon: 'H', color: 'bg-red-600' },
  { id: 'yoosee', name: 'Yoosee', icon: 'Y', color: 'bg-blue-600' },
  { id: 'xmeye', name: 'XMEye / ICSee', icon: 'X', color: 'bg-orange-600' },
  { id: 'v380', name: 'V380 Pro', icon: 'V', color: 'bg-cyan-600' },
];

const getProviderColor = (id: string) => {
    const p = PROVIDERS.find(x => x.id === id);
    return p ? p.color : 'bg-slate-600';
}

// --- COMPONENTE PRINCIPAL ---

interface SettingsModalProps {
  onClose: () => void;
  sessions: IntegrationSession[];
  onAddSession: (providerId: string, providerName: string, user: string, pass: string) => void;
  onRemoveSession: (id: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, sessions, onAddSession, onRemoveSession }) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'general' | 'implementation'>('accounts');
  
  // Form State (Integração)
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0].id);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Form State (Implementação)
  const [apiUrl, setApiUrl] = useState('https://api.omniview-gateway.com/v1/sync');
  const [apiKey, setApiKey] = useState('sk_live_55490238491203');
  const [webhookUrl, setWebhookUrl] = useState('https://seu-servidor.com/hooks/cameras');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    // Simula tempo de autenticação na API do fabricante
    setTimeout(() => {
        const providerName = PROVIDERS.find(p => p.id === selectedProvider)?.name || 'Unknown';
        onAddSession(selectedProvider, providerName, username, password);
        setIsConnecting(false);
        setUsername('');
        setPassword('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[650px] rounded-lg shadow-2xl flex overflow-hidden">
        
        {/* Sidebar do Modal */}
        <div className="w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="text-blue-500" />
                Configurações
            </h2>
            
            <nav className="space-y-1">
                <button 
                    onClick={() => setActiveTab('accounts')}
                    className={`w-full text-left px-4 py-3 rounded text-sm font-semibold flex items-center gap-3 transition-colors ${activeTab === 'accounts' ? 'bg-slate-800 text-white border-l-2 border-blue-500' : 'text-slate-400 hover:bg-slate-900'}`}
                >
                    <Cloud size={16} />
                    Integrações Cloud
                </button>
                <button 
                    onClick={() => setActiveTab('general')}
                    className={`w-full text-left px-4 py-3 rounded text-sm font-semibold flex items-center gap-3 transition-colors ${activeTab === 'general' ? 'bg-slate-800 text-white border-l-2 border-blue-500' : 'text-slate-400 hover:bg-slate-900'}`}
                >
                    <SettingsIconFake size={16} />
                    Geral
                </button>
                
                <div className="pt-4 mt-4 border-t border-slate-800">
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2">Área Técnica</p>
                    <button 
                        onClick={() => setActiveTab('implementation')}
                        className={`w-full text-left px-4 py-3 rounded text-sm font-semibold flex items-center gap-3 transition-colors ${activeTab === 'implementation' ? 'bg-slate-800 text-emerald-400 border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-900'}`}
                    >
                        <Code size={16} />
                        API & Desenvolvedor
                    </button>
                </div>
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-800">
                <p className="text-[10px] text-slate-600 font-mono">
                    OMNIVIEW CORE v3.4.2<br/>
                    ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                </p>
            </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col bg-slate-900 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10">
                <X size={24} />
            </button>

            {/* TAB: ACCOUNTS (Integrações) */}
            {activeTab === 'accounts' && (
                <div className="p-8 h-full overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-2">Contas de Câmeras Conectadas</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            Gerencie as conexões com fabricantes (Intelbras, Hikvision, etc). 
                            O sistema sincroniza automaticamente novas câmeras adicionadas nessas contas.
                        </p>
                        
                        {/* Lista de Sessões Ativas */}
                        <div className="space-y-3 mb-8">
                            {sessions.length === 0 && (
                                <div className="p-6 border border-dashed border-slate-700 rounded-lg text-center text-slate-500 bg-slate-900/50">
                                    Nenhuma conta vinculada. Adicione uma abaixo para importar câmeras.
                                </div>
                            )}
                            {sessions.map(session => (
                                <div key={session.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getProviderColor(session.providerId)}`}>
                                            {session.providerName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{session.providerName}</h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                                <span>{session.username}</span>
                                                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                                                <span className="text-emerald-400 flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> Conectado
                                                </span>
                                                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                                                <span>{session.cameraCount} Câmeras</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onRemoveSession(session.id)}
                                        className="text-slate-500 hover:text-red-400 p-2 hover:bg-slate-700 rounded transition-colors"
                                        title="Desconectar conta"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Formulário de Nova Conexão */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                            <RefreshCw size={18} className="text-blue-500" />
                            Adicionar Nova Integração
                        </h3>
                        
                        <form onSubmit={handleConnect}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sistema / Fabricante</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {PROVIDERS.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setSelectedProvider(p.id)}
                                                className={`p-2 rounded border text-xs font-bold transition-all flex flex-col items-center gap-1 ${selectedProvider === p.id ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${p.color}`}></div>
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail / Usuário</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="admin@exemplo.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-4 border-t border-slate-800">
                                <button 
                                    type="submit" 
                                    disabled={isConnecting}
                                    className={`px-6 py-2 rounded font-bold text-sm flex items-center gap-2 ${isConnecting ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                >
                                    {isConnecting ? (
                                        <>Conectando...</>
                                    ) : (
                                        <>Conectar e Sincronizar</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
                 <div className="p-8 h-full overflow-y-auto">
                    <h3 className="text-lg font-bold text-white mb-6">Preferências do Sistema</h3>
                    
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <Database className="text-blue-500" size={20} />
                                <h4 className="font-bold text-slate-200">Armazenamento Local</h4>
                            </div>
                            <div className="w-full bg-slate-700 h-2 rounded-full mb-2 overflow-hidden">
                                <div className="bg-blue-500 h-full w-[84%]"></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 font-mono">
                                <span>USADO: 840 GB</span>
                                <span>TOTAL: 1 TB</span>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                            <div className="flex items-center gap-3 mb-4">
                                <Server className="text-purple-500" size={20} />
                                <h4 className="font-bold text-slate-200">Qualidade de Stream</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <button className="p-2 border border-slate-600 rounded text-xs font-mono text-slate-400 hover:bg-slate-700">LOW (Sub-stream)</button>
                                <button className="p-2 border border-blue-500 bg-blue-900/20 rounded text-xs font-mono text-white">AUTO (Adaptive)</button>
                                <button className="p-2 border border-slate-600 rounded text-xs font-mono text-slate-400 hover:bg-slate-700">HIGH (Main-stream)</button>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {/* TAB: IMPLEMENTATION (Novo) */}
            {activeTab === 'implementation' && (
                <div className="p-8 h-full overflow-y-auto bg-slate-925">
                    <div className="mb-6 pb-4 border-b border-slate-800">
                        <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
                            <Code size={20} />
                            Implementação e Integração
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Esta área é destinada a desenvolvedores e integradores. Configure aqui os endpoints do seu servidor central para receber os dados das câmeras unificadas.
                        </p>
                    </div>

                    <div className="space-y-6">
                        
                        {/* Gateway Config */}
                        <div className="bg-black/40 border border-slate-700 rounded p-6">
                            <h4 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <Server size={16} className="text-slate-500" />
                                Gateway de Unificação
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-1">API Endpoint URL</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-emerald-400 font-mono text-sm focus:border-emerald-500 outline-none"
                                        value={apiUrl}
                                        onChange={(e) => setApiUrl(e.target.value)}
                                    />
                                    <p className="text-[10px] text-slate-600 mt-1">URL para onde os metadados das câmeras (Intelbras, Yoosee, etc) serão enviados.</p>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-1">Master API Key</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input 
                                                type="text" 
                                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 font-mono text-sm focus:border-emerald-500 outline-none pl-8"
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                            />
                                            <Key size={14} className="absolute left-2 top-2.5 text-slate-600" />
                                        </div>
                                        <button className="bg-slate-800 text-slate-300 px-3 py-1 rounded text-xs font-bold border border-slate-700 hover:bg-slate-700">Gerar Nova</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Webhooks */}
                        <div className="bg-black/40 border border-slate-700 rounded p-6">
                            <h4 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <RefreshCw size={16} className="text-slate-500" />
                                Webhooks & Eventos
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 mb-1">Webhook URL (Eventos de Movimento/Alarme)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-blue-400 font-mono text-sm focus:border-blue-500 outline-none"
                                        value={webhookUrl}
                                        onChange={(e) => setWebhookUrl(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-600 text-emerald-500 focus:ring-0" />
                                        Enviar eventos de Motion Detection
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-600 text-emerald-500 focus:ring-0" />
                                        Enviar Status (Online/Offline)
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                SALVAR CONFIGURAÇÃO
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
