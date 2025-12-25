
import React, { useMemo } from 'react';
import { Loan } from '../types';
import { TrendingUp, AlertCircle, CheckCircle, Calendar, FileText } from 'lucide-react';

interface DashboardProps {
  loans: Loan[];
  onToggleInstallment: (loanId: string, installmentId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ loans, onToggleInstallment }) => {
  const stats = useMemo(() => {
    let totalLent = 0;
    let totalToReceive = 0;
    let paidAmount = 0;

    loans.forEach(loan => {
      totalLent += loan.amount;
      loan.installments.forEach(inst => {
        totalToReceive += inst.value;
        if (inst.status === 'paid') paidAmount += inst.value;
      });
    });

    return {
      totalLent,
      totalToReceive,
      paidAmount,
      pendingAmount: totalToReceive - paidAmount,
      profit: totalToReceive - totalLent
    };
  }, [loans]);

  const dueToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const items: { loan: Loan; installment: any }[] = [];

    loans.forEach(loan => {
      loan.installments.forEach(inst => {
        if (inst.status === 'unpaid' && inst.dueDate.split('T')[0] === today) {
          items.push({ loan, installment: inst });
        }
      });
    });
    return items;
  }, [loans]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Capital em Giro</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalLent)}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Receita Prevista</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.profit)}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fluxo Recebido</p>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(stats.paidAmount)}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Inadimplência/Pendente</p>
          <p className="text-2xl font-bold text-amber-500">{formatCurrency(stats.pendingAmount)}</p>
        </div>
      </div>

      {/* Alert Section: Vence Hoje */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={18} />
            Vencimentos Críticos ({dueToday.length})
          </h3>
          <span className="text-[10px] font-mono text-slate-500 bg-black/30 px-2 py-1 rounded">Hoje: {new Date().toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="p-0 overflow-x-auto">
          {dueToday.length === 0 ? (
            <div className="p-12 text-center text-slate-600 italic flex flex-col items-center">
              <CheckCircle size={32} className="mb-2 opacity-20" />
              Nenhum pagamento pendente para hoje.
            </div>
          ) : (
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Parcela</th>
                  <th className="px-6 py-3">Garantia</th>
                  <th className="px-6 py-3">Valor</th>
                  <th className="px-6 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {dueToday.map(({ loan, installment }) => (
                  <tr key={installment.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-200">{loan.customer.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{loan.customer.document || 'Sem CPF'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {installment.number} de {loan.installmentsCount}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`text-[10px] font-bold px-2 py-1 rounded ${loan.collateralType !== 'none' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-600'}`}>
                         {loan.collateralType === 'none' ? 'SEM GARANTIA' : loan.collateralType.toUpperCase()}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-mono font-bold">{formatCurrency(installment.value)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onToggleInstallment(loan.id, installment.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                      >
                        BAIXAR PAGAMENTO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
