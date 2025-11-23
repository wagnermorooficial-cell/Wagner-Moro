import React, { useState, useEffect } from 'react';
import { Message, User, Sector, SystemConfig } from '../App';

interface AdminDashboardProps {
  messages: Message[];
  sectors: Sector[];
  setSectors: (sectors: Sector[]) => void;
  onCloseMobile: () => void;
  currentUser: User;
  systemConfig: SystemConfig;
  onUpdateConfig: (config: SystemConfig) => void;
}

const STORAGE_KEY_USERS = 'nexus_chat_users_v3';
const STORAGE_KEY_SECTORS = 'nexus_chat_sectors_v3';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    messages, sectors, setSectors, onCloseMobile, currentUser, systemConfig, onUpdateConfig 
}) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'users' | 'sectors' | 'config'>('monitor');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  // User Form State
  const [newUserUser, setNewUserUser] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user');
  const [newUserSector, setNewUserSector] = useState('general');
  const [feedback, setFeedback] = useState('');

  // Sector Form State
  const [newSectorName, setNewSectorName] = useState('');
  const [sectorFeedback, setSectorFeedback] = useState('');

  // Config Form State
  const [configCompany, setConfigCompany] = useState(systemConfig.companyName);
  const [configSystem, setConfigSystem] = useState(systemConfig.systemName);
  const [configFeedback, setConfigFeedback] = useState('');

  // Carregar todos usuários para gestão
  useEffect(() => {
     if (activeTab === 'users') {
         const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
         setAllUsers(users);
     }
  }, [activeTab]);

  // Update local state when prop changes
  useEffect(() => {
    setConfigCompany(systemConfig.companyName);
    setConfigSystem(systemConfig.systemName);
  }, [systemConfig]);

  // Dados calculados para Monitor
  const uniqueUsersMap = new Map<string, { name: string; role: 'admin' | 'user'; id: string; sectorId?: string }>();
  messages.forEach(m => {
    if (m.userId && !uniqueUsersMap.has(m.userId)) {
      uniqueUsersMap.set(m.userId, { name: m.user, role: m.role, id: m.userId, sectorId: m.sectorId });
    }
  });
  const activeSessionUsers = Array.from(uniqueUsersMap.values());

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserUser || !newUserPass) {
      setFeedback('Preencha todos os campos');
      return;
    }

    const existingUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    if (existingUsers.find(u => u.username === newUserUser)) {
      setFeedback('Usuário já existe');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: newUserUser,
      password: newUserPass,
      role: newUserRole,
      sectorId: newUserRole === 'admin' ? 'general' : newUserSector,
      isBlocked: false
    };

    const updatedList = [...existingUsers, newUser];
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedList));
    setAllUsers(updatedList);
    setFeedback(`Usuário ${newUserUser} criado!`);
    setNewUserUser('');
    setNewUserPass('');
  };

  const toggleBlockUser = (userId: string, currentStatus?: boolean) => {
      if (userId === currentUser.id) {
          alert("Você não pode bloquear a si mesmo.");
          return;
      }
      const updatedList = allUsers.map(u => {
          if (u.id === userId) {
              return { ...u, isBlocked: !currentStatus };
          }
          return u;
      });
      setAllUsers(updatedList);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedList));
  };

  const handleCreateSector = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newSectorName.trim()) return;

      const newId = newSectorName.toLowerCase().replace(/\s+/g, '-');
      if(sectors.find(s => s.id === newId)) {
          setSectorFeedback('Setor já existe.');
          return;
      }

      const updatedSectors = [...sectors, { id: newId, name: newSectorName }];
      setSectors(updatedSectors);
      localStorage.setItem(STORAGE_KEY_SECTORS, JSON.stringify(updatedSectors));
      setNewSectorName('');
      setSectorFeedback('Setor criado com sucesso.');
  };

  const handleDeleteSector = (id: string) => {
      if(id === 'general') {
          setSectorFeedback('Não é possível deletar o setor Geral.');
          return;
      }
      if(confirm('Tem certeza? Usuários deste setor perderão o acesso até serem reatribuídos.')) {
        const updatedSectors = sectors.filter(s => s.id !== id);
        setSectors(updatedSectors);
        localStorage.setItem(STORAGE_KEY_SECTORS, JSON.stringify(updatedSectors));
      }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateConfig({
          companyName: configCompany,
          systemName: configSystem
      });
      setConfigFeedback('Configurações salvas! O sistema foi atualizado.');
      setTimeout(() => setConfigFeedback(''), 3000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 md:bg-transparent">
      {/* Header Mobile Only */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <span className="font-bold text-amber-500 text-sm">ADMIN PANEL</span>
          <button onClick={onCloseMobile} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
      </div>

      <div className="flex border-b border-slate-800 text-[9px] md:text-[10px] font-bold text-slate-400">
        <button 
          onClick={() => setActiveTab('monitor')}
          className={`flex-1 py-3 hover:text-white transition-colors ${activeTab === 'monitor' ? 'text-amber-500 border-b-2 border-amber-500' : ''}`}
        >
          MONITOR
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 hover:text-white transition-colors ${activeTab === 'users' ? 'text-amber-500 border-b-2 border-amber-500' : ''}`}
        >
          USUÁRIOS
        </button>
        <button 
          onClick={() => setActiveTab('sectors')}
          className={`flex-1 py-3 hover:text-white transition-colors ${activeTab === 'sectors' ? 'text-amber-500 border-b-2 border-amber-500' : ''}`}
        >
          SETORES
        </button>
        <button 
          onClick={() => setActiveTab('config')}
          className={`flex-1 py-3 hover:text-white transition-colors ${activeTab === 'config' ? 'text-amber-500 border-b-2 border-amber-500' : ''}`}
        >
          CONFIG
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        
        {activeTab === 'monitor' && (
          <>
             <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                <p className="text-[10px] text-slate-500 font-mono uppercase">Msgs (Global)</p>
                <p className="text-xl font-bold text-white">{messages.length}</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded border border-slate-800">
                <p className="text-[10px] text-slate-500 font-mono uppercase">Setores</p>
                <p className="text-lg font-bold text-cyan-500">{sectors.length}</p>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 font-mono">Ativos Recentemente</h3>
                <ul className="space-y-2">
                {activeSessionUsers.length === 0 && <li className="text-slate-600 text-xs italic">Nenhuma atividade recente</li>}
                {activeSessionUsers.map(u => (
                    <li key={u.id} className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${u.role === 'admin' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                        <span className="text-slate-300 font-mono">{u.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-500">
                        {u.role === 'admin' ? 'ADM' : (sectors.find(s => s.id === u.sectorId)?.name || 'N/A')}
                    </span>
                    </li>
                ))}
                </ul>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-4 rounded border border-slate-800">
              <h3 className="text-sm font-bold text-amber-500 mb-4 uppercase">Novo Funcionário</h3>
              <form onSubmit={handleCreateUser} className="space-y-3">
                <input 
                    type="text" 
                    value={newUserUser}
                    onChange={e => setNewUserUser(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                    placeholder="Usuário (ex: joao.silva)"
                />
                <input 
                    type="text" 
                    value={newUserPass}
                    onChange={e => setNewUserPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                    placeholder="Senha"
                />
                <div className="grid grid-cols-2 gap-2">
                    <select 
                        value={newUserRole} 
                        onChange={e => setNewUserRole(e.target.value as 'admin' | 'user')}
                        className="bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white outline-none"
                    >
                        <option value="user">Usuário</option>
                        <option value="admin">Admin</option>
                    </select>
                    
                    <select 
                        value={newUserSector}
                        onChange={e => setNewUserSector(e.target.value)}
                        disabled={newUserRole === 'admin'}
                        className="bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white outline-none disabled:opacity-50"
                    >
                        {sectors.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                
                {feedback && <div className="text-xs text-amber-400">{feedback}</div>}

                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded text-xs transition-colors">
                  CADASTRAR
                </button>
              </form>
            </div>

            <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 font-mono">Gerenciar Acessos</h3>
                <div className="space-y-2">
                    {allUsers.map(u => (
                        <div key={u.id} className={`flex items-center justify-between p-2 rounded border ${u.isBlocked ? 'bg-red-900/20 border-red-900/50' : 'bg-slate-900/50 border-slate-800'}`}>
                            <div>
                                <p className={`text-xs font-medium ${u.isBlocked ? 'text-red-400 line-through' : 'text-slate-300'}`}>{u.username}</p>
                                <p className="text-[9px] text-slate-600 uppercase">{u.role} • {sectors.find(s => s.id === u.sectorId)?.name || 'Geral'}</p>
                            </div>
                            
                            {u.id !== currentUser.id && (
                                <button 
                                    onClick={() => toggleBlockUser(u.id, u.isBlocked)}
                                    className={`text-[10px] px-2 py-1 rounded font-bold border transition-colors ${u.isBlocked 
                                        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800 hover:bg-emerald-800' 
                                        : 'bg-red-900/30 text-red-400 border-red-800 hover:bg-red-800'}`}
                                >
                                    {u.isBlocked ? 'DESBLOQUEAR' : 'BLOQUEAR'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'sectors' && (
            <div className="space-y-6">
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                    <h3 className="text-sm font-bold text-amber-500 mb-4 uppercase">Criar Setor</h3>
                    <form onSubmit={handleCreateSector} className="flex gap-2">
                        <input 
                            type="text" 
                            value={newSectorName}
                            onChange={e => setNewSectorName(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                            placeholder="Nome (ex: Recursos Humanos)"
                        />
                        <button type="submit" className="bg-amber-600 hover:bg-amber-500 px-3 rounded text-white font-bold text-xs">
                            +
                        </button>
                    </form>
                    {sectorFeedback && <p className="text-[10px] text-amber-400 mt-2">{sectorFeedback}</p>}
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Setores Ativos</h3>
                    <div className="space-y-2">
                        {sectors.map(s => (
                            <div key={s.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-800">
                                <span className="text-xs text-slate-300 font-medium">#{s.name}</span>
                                {s.id !== 'general' && (
                                    <button 
                                        onClick={() => handleDeleteSector(s.id)}
                                        className="text-[10px] text-red-500 hover:text-red-400 px-2"
                                    >
                                        Excluir
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'config' && (
            <div className="space-y-6">
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                    <h3 className="text-sm font-bold text-amber-500 mb-4 uppercase">Personalização (White Label)</h3>
                    <p className="text-[10px] text-slate-500 mb-4">
                        Altere os dados abaixo para personalizar o sistema para o seu cliente final.
                    </p>
                    
                    <form onSubmit={handleSaveConfig} className="space-y-4">
                        <div>
                            <label className="block text-[10px] text-slate-400 uppercase mb-1">Nome da Empresa</label>
                            <input 
                                type="text" 
                                value={configCompany}
                                onChange={e => setConfigCompany(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                                placeholder="Ex: Acme Corp"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-slate-400 uppercase mb-1">Nome do Sistema</label>
                            <input 
                                type="text" 
                                value={configSystem}
                                onChange={e => setConfigSystem(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                                placeholder="Ex: Chat Interno"
                            />
                        </div>
                        
                        {configFeedback && (
                            <div className="text-xs text-emerald-400 font-bold bg-emerald-900/20 p-2 rounded border border-emerald-900/50">
                                {configFeedback}
                            </div>
                        )}

                        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded text-xs transition-colors">
                            SALVAR ALTERAÇÕES
                        </button>
                    </form>
                </div>
                
                <div className="p-4 rounded border border-slate-800 bg-slate-900/30">
                    <p className="text-[10px] text-slate-500 text-center">
                        Licença de Uso v3.1<br/>
                        Sistema pronto para revenda.
                    </p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;