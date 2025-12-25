
import React from 'react';
import { LayoutDashboard, Wallet, PlusCircle, History, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'loans';
  onSetView: (view: 'dashboard' | 'loans') => void;
  onOpenAdd: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSetView, onOpenAdd }) => {
  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-900/20">
            <Wallet size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">CrediTrack</h2>
            <p className="text-[10px] text-emerald-500 font-mono font-bold tracking-widest uppercase">Finance Manager</p>
          </div>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => onSetView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'dashboard' 
                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button
            onClick={() => onSetView('loans')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'loans' 
                ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-600/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <History size={20} />
            Empréstimos
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <button
          onClick={onOpenAdd}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-xl shadow-emerald-900/30"
        >
          <PlusCircle size={20} />
          Novo Empréstimo
        </button>
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-slate-500">
          <button className="hover:text-slate-300 transition-colors"><Settings size={18} /></button>
          <span className="text-[10px] font-mono">v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
