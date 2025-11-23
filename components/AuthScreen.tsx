import React, { useState, useEffect } from 'react';
import { User, Sector } from '../App';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  companyName: string;
}

const STORAGE_KEY_USERS = 'nexus_chat_users_v3';
const STORAGE_KEY_SECTORS = 'nexus_chat_sectors_v3';

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, companyName }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [selectedSector, setSelectedSector] = useState('general');
  const [availableSectors, setAvailableSectors] = useState<Sector[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedSectors = localStorage.getItem(STORAGE_KEY_SECTORS);
    if (savedSectors) {
        setAvailableSectors(JSON.parse(savedSectors));
    } else {
        setAvailableSectors([{id: 'general', name: 'Geral'}]);
    }
  }, []);

  const isValidEmail = (email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Preencha Usuário e Senha.');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');

    if (isRegistering) {
      if (!email) {
          setError('O campo E-mail é obrigatório para cadastro.');
          return;
      }

      if (!isValidEmail(email)) {
          setError('Por favor, insira um e-mail válido.');
          return;
      }

      if (users.find(u => u.username === username)) {
        setError('Este nome de usuário já está em uso.');
        return;
      }

      if (users.find(u => u.email === email)) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      let role: 'user' | 'admin' = 'user';
      if (adminKey) {
         if (adminKey === 'NEXUS-ADMIN') { 
            role = 'admin';
         } else {
            setError('Chave de Administrador inválida.');
            return;
         }
      }

      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        password,
        role,
        sectorId: role === 'admin' ? 'general' : selectedSector,
        isBlocked: false
      };

      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([...users, newUser]));
      onLogin(newUser);
    } else {
      // Login: Tenta achar por user E senha (email opcional no login, mas poderia ser usado)
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        if (user.isBlocked) {
            setError('ACESSO REVOGADO: Contate o administrador.');
        } else {
            onLogin(user);
        }
      } else {
        setError('Credenciais inválidas.');
      }
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 mb-4 text-cyan-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{companyName}</h1>
          <p className="text-slate-400 text-sm">Portal de Comunicação</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1 uppercase">Identificação</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Nome de usuário"
            />
          </div>

          {isRegistering && (
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1 uppercase">E-mail Corporativo</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="seu.nome@empresa.com"
                />
              </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1 uppercase">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="******"
            />
          </div>

          {isRegistering && !adminKey && (
             <div>
                <label className="block text-xs font-mono text-slate-500 mb-1 uppercase">Seu Setor</label>
                <select 
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                    {availableSectors.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
             </div>
          )}

          {isRegistering && (
             <div className="pt-2 border-t border-slate-800 mt-2">
                <button 
                    type="button" 
                    onClick={() => setAdminKey(adminKey ? '' : ' ')} 
                    className={`text-[10px] mb-2 underline transition-colors ${adminKey ? 'text-amber-400 font-bold' : 'text-slate-600 hover:text-amber-500'}`}
                >
                    {adminKey ? 'Cancelar Cadastro Admin' : 'Sou Administrador'}
                </button>
                {adminKey && (
                    <div className="animate-fade-in">
                        <label className="block text-[10px] text-amber-500 mb-1">CHAVE DE SEGURANÇA</label>
                        <input 
                        type="text" 
                        value={adminKey === ' ' ? '' : adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                        className="w-full bg-slate-950 border border-amber-900/50 rounded px-3 py-2 text-amber-200 placeholder-slate-700 focus:border-amber-500 focus:outline-none transition-colors text-xs"
                        placeholder="Digite: NEXUS-ADMIN"
                        />
                    </div>
                )}
             </div>
          )}

          {error && <p className="text-red-400 text-xs font-bold text-center bg-red-950/20 py-2 rounded border border-red-900/30">{error}</p>}

          <button 
            type="submit" 
            className={`w-full font-bold py-3 rounded-lg shadow-lg transition-all mt-4 ${adminKey ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20'}`}
          >
            {isRegistering ? (adminKey ? 'CADASTRAR ADMIN' : 'CRIAR ACESSO') : 'ENTRAR'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); setAdminKey(''); setEmail(''); }}
            className="text-slate-500 hover:text-cyan-400 text-xs transition-colors underline decoration-dotted"
          >
            {isRegistering ? 'Já possui conta? Entrar' : 'Novo acesso? Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;