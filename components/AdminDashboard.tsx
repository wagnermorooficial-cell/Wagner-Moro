import React from 'react';

interface Message {
  id: string;
  user: string;
  text: string;
  type: 'text' | 'system' | 'alert';
  timestamp: number;
}

interface AdminDashboardProps {
  messages: Message[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ messages }) => {
  const activeUsers = Array.from(new Set(
    messages
      .filter(m => m.type === 'text' || m.type === 'system')
      .map(m => m.user)
      .filter(u => u !== 'Sistema')
  ));

  const msgCount = messages.length;
  const lastActivity = messages.length > 0 ? new Date(messages[messages.length - 1].timestamp).toLocaleTimeString() : 'N/A';

  return (
    <div className="h-full p-6 bg-slate-900 border-l border-slate-800 overflow-y-auto">
      <h2 className="text-amber-500 font-bold font-mono text-sm mb-6 uppercase tracking-widest border-b border-amber-500/30 pb-2">
        Painel de Monitoramento
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-950 p-4 rounded border border-slate-800">
          <p className="text-xs text-slate-500 font-mono">MSG TOTAIS</p>
          <p className="text-2xl font-bold text-white">{msgCount}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded border border-slate-800">
          <p className="text-xs text-slate-500 font-mono">ÚLTIMA ATIVIDADE</p>
          <p className="text-xl font-bold text-cyan-400">{lastActivity}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 font-mono">Usuários Detectados (Sessão)</h3>
        <ul className="space-y-2">
          {activeUsers.length === 0 && <li className="text-slate-600 text-sm italic">Nenhum usuário ativo</li>}
          {activeUsers.map(user => (
            <li key={user} className="flex items-center justify-between text-sm bg-slate-800/50 p-2 rounded border border-slate-700">
              <span className="text-emerald-400 font-mono">{user}</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 font-mono">Log do Sistema</h3>
        <div className="text-[10px] font-mono text-slate-500 bg-black p-2 rounded h-48 overflow-y-auto border border-slate-800">
          {messages.slice(-20).map(m => (
            <div key={m.id} className="mb-1 border-b border-slate-900 pb-1">
              <span className="text-slate-600">[{new Date(m.timestamp).toLocaleTimeString()}]</span>{' '}
              <span className={m.type === 'system' ? 'text-cyan-600' : 'text-slate-400'}>{m.type.toUpperCase()}:</span>{' '}
              {m.user} &raquo; {m.text.substring(0, 30)}{m.text.length > 30 ? '...' : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;