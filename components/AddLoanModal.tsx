
import React, { useState, useRef } from 'react';
import { X, Save, TrendingUp, Calendar, User, DollarSign, ShieldCheck, FileText, Paperclip, Trash2 } from 'lucide-react';
import { Attachment } from '../types';

interface AddLoanModalProps {
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddLoanModal: React.FC<AddLoanModalProps> = ({ onClose, onAdd }) => {
  const [tab, setTab] = useState<'basic' | 'collateral'>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerDocument: '',
    customerPhone: '',
    amount: '',
    interestRate: '5',
    installmentsCount: '12',
    dueDay: '10',
    collateralType: 'none',
    collateralDescription: '',
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly type 'file' as 'File' to avoid 'unknown' type errors during iteration.
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result as string,
          uploadDate: new Date().toISOString()
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'basic' && !formData.customerName) return;
    
    onAdd({
      ...formData,
      amount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate),
      installmentsCount: parseInt(formData.installmentsCount),
      dueDay: parseInt(formData.dueDay),
      attachments
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30 shrink-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Novo Registro de Empréstimo
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 shrink-0">
          <button 
            onClick={() => setTab('basic')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${tab === 'basic' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            Dados Financeiros
          </button>
          <button 
            onClick={() => setTab('collateral')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${tab === 'collateral' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-500 hover:bg-slate-800'}`}
          >
            Garantias e Documentos
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {tab === 'basic' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                    <User size={12} /> Nome do Cliente
                  </label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all"
                    placeholder="Ex: João Silva"
                    value={formData.customerName}
                    onChange={e => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">CPF / CNPJ</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all"
                    placeholder="000.000.000-00"
                    value={formData.customerDocument}
                    onChange={e => setFormData({...formData, customerDocument: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Telefone</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all"
                    placeholder="(00) 00000-0000"
                    value={formData.customerPhone}
                    onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                    <DollarSign size={12} /> Valor do Empréstimo
                  </label>
                  <input 
                    type="number" required step="0.01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all"
                    placeholder="R$ 0,00"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                    <TrendingUp size={12} /> Juros Mensais (%)
                  </label>
                  <input 
                    type="number" required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all"
                    value={formData.interestRate}
                    onChange={e => setFormData({...formData, interestRate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                    <Calendar size={12} /> Parcelas
                  </label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all"
                    value={formData.installmentsCount}
                    onChange={e => setFormData({...formData, installmentsCount: e.target.value})}
                  >
                    {[1, 2, 3, 4, 6, 10, 12, 18, 24, 36, 48].map(n => (
                      <option key={n} value={n}>{n}x meses</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                    <Calendar size={12} /> Dia Vencimento
                  </label>
                  <input 
                    type="number" required min="1" max="28"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all"
                    value={formData.dueDay}
                    onChange={e => setFormData({...formData, dueDay: e.target.value})}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                  <ShieldCheck size={12} /> Tipo de Garantia
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    {id: 'none', label: 'Sem Garantia'},
                    {id: 'real_estate', label: 'Imóvel'},
                    {id: 'vehicle', label: 'Veículo'},
                    {id: 'product', label: 'Produto/Bem'},
                    {id: 'other', label: 'Outros'},
                  ].map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({...formData, collateralType: type.id})}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${formData.collateralType === type.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Descrição da Garantia / Detalhes</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none transition-all resize-none"
                  placeholder="Ex: Matrícula do imóvel, Placa do veículo, contrato assinado, etc..."
                  value={formData.collateralDescription}
                  onChange={e => setFormData({...formData, collateralDescription: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-2"><FileText size={12} /> Documentos Anexados</span>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1 text-[10px]"
                  >
                    <Paperclip size={10} /> ANEXAR ARQUIVO
                  </button>
                </label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                
                <div className="space-y-2 mt-2">
                  {attachments.length === 0 && (
                    <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-600 text-xs">
                      Nenhum documento anexado.
                    </div>
                  )}
                  {attachments.map(att => (
                    <div key={att.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText size={16} className="text-slate-500 shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-xs text-slate-200 font-medium truncate">{att.name}</p>
                          <p className="text-[10px] text-slate-500">{(att.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>

        <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0">
          {tab === 'basic' ? (
            <button 
              type="button"
              onClick={() => setTab('collateral')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition-all"
            >
              PRÓXIMO: GARANTIAS
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setTab('basic')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold transition-all"
              >
                VOLTAR
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition-all shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                CONFIRMAR E REGISTRAR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLoanModal;
