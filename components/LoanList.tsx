
import React, { useState } from 'react';
import { Loan, Attachment } from '../types';
import { ChevronDown, ChevronUp, Trash2, CheckCircle, Clock, ShieldCheck, FileText, Download, User, Smartphone, Fingerprint } from 'lucide-react';

interface LoanListProps {
  loans: Loan[];
  onToggleInstallment: (loanId: string, installmentId: string) => void;
  onDelete: (id: string) => void;
}

const LoanList: React.FC<LoanListProps> = ({ loans, onToggleInstallment, onDelete }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('pt-BR');
  };

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCollateralLabel = (type: string) => {
    const labels: Record<string, string> = {
      'real_estate': 'Imóvel',
      'vehicle': 'Veículo',
      'product': 'Produto',
      'other': 'Outro',
      'none': 'Sem Garantia'
    };
    return labels[type] || type;
  };

  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-600">
        <Clock size={48} className="mb-4 opacity-20" />
        <p className="text-xl font-medium">Nenhum empréstimo registrado</p>
        <p className="text-sm">Clique em "Novo Empréstimo" para começar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loans.map(loan => {
        const isExpanded = expanded === loan.id;
        const paidCount = loan.installments.filter(i => i.status === 'paid').length;
        const progress = (paidCount / loan.installmentsCount) * 100;

        return (
          <div key={loan.id} className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all ${isExpanded ? 'ring-1 ring-emerald-500/30 shadow-2xl' : ''}`}>
            <div 
              className="p-6 cursor-pointer hover:bg-slate-800/20 flex items-center justify-between"
              onClick={() => setExpanded(isExpanded ? null : loan.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">{loan.customer.name}</h3>
                  {loan.status === 'completed' ? (
                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">QUITADO</span>
                  ) : (
                    <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/20">ATIVO</span>
                  )}
                  {loan.collateralType !== 'none' && (
                    <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                      <ShieldCheck size={10} /> COM GARANTIA
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1"><Fingerprint size={12} /> {loan.customer.document || 'N/D'}</span>
                  <span className="flex items-center gap-1"><Smartphone size={12} /> {loan.customer.phone || 'N/D'}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                  <span>Início: {formatDate(loan.startDate)}</span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Total Líquido</p>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(loan.totalToPay)}</p>
                </div>
                <div className="w-24 hidden md:block">
                   <div className="flex justify-between text-[10px] font-bold mb-1 text-slate-400">
                      <span>{paidCount}/{loan.installmentsCount}</span>
                      <span>{Math.round(progress)}%</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={(e) => { e.stopPropagation(); onDelete(loan.id); }}
                     className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                   >
                     <Trash2 size={18} />
                   </button>
                   <div className="text-slate-500">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                   </div>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="px-6 pb-6 pt-2 bg-slate-950/50 border-t border-slate-800 space-y-6">
                 {/* Seção de Garantias */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} className="text-amber-500" /> Detalhes da Garantia
                      </h4>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Tipo de Bem: <span className="text-slate-200 font-bold">{getCollateralLabel(loan.collateralType)}</span></p>
                        <p className="text-sm text-slate-300 italic leading-relaxed">
                          {loan.collateralDescription || 'Nenhuma descrição detalhada fornecida.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} className="text-blue-500" /> Documentos e Contratos ({loan.attachments.length})
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {loan.attachments.length === 0 ? (
                          <div className="text-center p-4 border border-dashed border-slate-800 rounded-xl text-slate-600 text-xs">
                            Nenhum arquivo anexado a este registro.
                          </div>
                        ) : (
                          loan.attachments.map(att => (
                            <div key={att.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between group">
                              <div className="flex items-center gap-3">
                                <FileText size={16} className="text-slate-500" />
                                <span className="text-xs text-slate-300 font-medium truncate max-w-[150px]">{att.name}</span>
                              </div>
                              <button 
                                onClick={() => handleDownload(att)}
                                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-blue-400 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                              >
                                <Download size={12} /> BAIXAR
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                 </div>

                 {/* Seção de Parcelas */}
                 <div className="space-y-3 pt-4 border-t border-slate-800">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cronograma de Pagamentos</h4>
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {loan.installments.map(inst => (
                        <div 
                          key={inst.id}
                          onClick={() => onToggleInstallment(loan.id, inst.id)}
                          className={`
                            p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group
                            ${inst.status === 'paid' 
                              ? 'bg-emerald-500/10 border-emerald-500/20' 
                              : 'bg-slate-900 border-slate-700 hover:border-emerald-500/50'}
                          `}
                        >
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Parc. {inst.number}</span>
                             {inst.status === 'paid' && <CheckCircle size={12} className="text-emerald-500" />}
                          </div>
                          <p className={`text-sm font-bold ${inst.status === 'paid' ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>
                            {formatCurrency(inst.value)}
                          </p>
                          <p className="text-[9px] font-mono text-slate-500 mt-1">Venc: {formatDate(inst.dueDate)}</p>
                        </div>
                      ))}
                   </div>
                 </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LoanList;
