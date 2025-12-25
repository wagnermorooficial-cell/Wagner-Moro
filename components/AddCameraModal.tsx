
import React, { useState } from 'react';
import { X, Save, Cloud, Server, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AddCameraModalProps {
  onClose: () => void;
  onAdd: (data: any) => void;
  existingLocations: string[];
}

type TabMode = 'manual' | 'cloud';

const PROVIDERS = [
  { id: 'intelbras', name: 'Intelbras Cloud', icon: 'I', color: 'bg-green-600' },
  { id: 'hikvision', name: 'Hik-Connect', icon: 'H', color: 'bg-red-600' },
  { id: 'yoosee', name: 'Yoosee', icon: 'Y', color: 'bg-blue-600' },
  { id: 'xmeye', name: 'XMEye / ICSee', icon: 'X', color: 'bg-orange-600' },
  { id: 'v380', name: 'V380 Pro', icon: 'V', color: 'bg-cyan-600' },
];

const AddCameraModal: React.FC<AddCameraModalProps> = ({ onClose, onAdd, existingLocations }) => {
  const [mode, setMode] = useState<TabMode>('cloud');
  
  // Manual Form State
  const [manualData, setManualData] = useState({
    name: '',
    location: '',
    ip: '',
    protocol: 'RTSP'
  });

  // Cloud Form State
  const [cloudData, setCloudData] = useState({
    provider: 'intelbras',
    username: '',
    password: '',
    location: ''
  });

  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
        ...manualData,
        provider: 'Manual'
    });
  };

  const handleCloudSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectionStatus('connecting');

    // Simulação de conexão com API de terceiros
    setTimeout(() => {
        setConnectionStatus('success');
        
        // Simular que encontramos 2-3 câmeras na conta da pessoa
        setTimeout(() => {
            const selectedProviderName = PROVIDERS.find(p => p.id === cloudData.provider)?.name || 'Cloud';
            
            const newCameras = [
                {
                    name: `${selectedProviderName} - Cam 01`,
                    location: cloudData.location || 'Nuvem',
                    ip: `${cloudData.provider.toUpperCase()}-LINK-01`,
                    protocol: 'Cloud P2P',
                    provider: selectedProviderName.split(' ')[0] // Pega o primeiro nome
                },
                {
                    name: `${selectedProviderName} - Cam 02`,
                    location: cloudData.location || 'Nuvem',
                    ip: `${cloudData.provider.toUpperCase()}-LINK-02`,
                    protocol: 'Cloud P2P',
                    provider: selectedProviderName.split(' ')[0]
                }
            ];

            onAdd(newCameras);
        }, 800);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Nova Conexão
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
            <button 
                onClick={() => setMode('cloud')}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'cloud' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-slate-800/50'}`}
            >
                <Cloud size={18} />
                INTEGRAÇÃO CLOUD (P2P)
            </button>
            <button 
                onClick={() => setMode('manual')}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'manual' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-slate-800/50'}`}
            >
                <Server size={18} />
                CONEXÃO MANUAL (IP)
            </button>
        </div>

        <div className="p-6 bg-slate-950">
            {mode === 'cloud' ? (
                // --- CLOUD FORM ---
                <form onSubmit={handleCloudSubmit} className="space-y-6">
                    <div className="bg-blue-900/10 border border-blue-900/50 rounded p-4 mb-4">
                        <p className="text-sm text-blue-200 flex items-start gap-2">
                            <Wifi size={16} className="mt-0.5" />
                            Faça login com sua conta do fabricante. O sistema irá unificar e importar automaticamente todas as câmeras vinculadas.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-3">Selecione o Sistema / Fabricante</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {PROVIDERS.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setCloudData({...cloudData, provider: p.id})}
                                    className={`flex flex-col items-center gap-2 p-3 rounded border transition-all ${cloudData.provider === p.id ? 'bg-slate-800 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${p.color}`}>
                                        {p.icon}
                                    </div>
                                    <span className="text-[10px] text-slate-300 font-bold">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-mono text-slate-400 mb-1">E-mail / Usuário</label>
                            <input 
                                type="text" 
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
                                placeholder="seu@email.com"
                                value={cloudData.username}
                                onChange={e => setCloudData({...cloudData, username: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-mono text-slate-400 mb-1">Senha</label>
                            <input 
                                type="password" 
                                required
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
                                placeholder="••••••••"
                                value={cloudData.password}
                                onChange={e => setCloudData({...cloudData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-1">Vincular ao Local (Opcional)</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
                            placeholder="Ex: Minha Casa"
                            value={cloudData.location}
                            onChange={e => setCloudData({...cloudData, location: e.target.value})}
                            list="cloud-locations"
                        />
                         <datalist id="cloud-locations">
                            {existingLocations.map(loc => (
                            <option key={loc} value={loc} />
                            ))}
                        </datalist>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={connectionStatus !== 'idle'}
                            className={`
                                px-6 py-3 rounded text-white font-bold flex items-center gap-2 shadow-lg transition-all
                                ${connectionStatus === 'idle' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : ''}
                                ${connectionStatus === 'connecting' ? 'bg-slate-700 cursor-wait' : ''}
                                ${connectionStatus === 'success' ? 'bg-emerald-600' : ''}
                            `}
                        >
                            {connectionStatus === 'idle' && (
                                <>
                                    <RefreshCw size={18} />
                                    ACESSAR E SINCRONIZAR
                                </>
                            )}
                            {connectionStatus === 'connecting' && (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    CONECTANDO API...
                                </>
                            )}
                             {connectionStatus === 'success' && (
                                <>
                                    <CheckCircle2 size={18} />
                                    SUCESSO! IMPORTANDO...
                                </>
                            )}
                        </button>
                    </div>

                </form>
            ) : (
                // --- MANUAL FORM ---
                <form onSubmit={handleManualSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-mono text-slate-400 mb-1">Nome da Câmera</label>
                        <input 
                        type="text" 
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Ex: Portaria 1"
                        value={manualData.name}
                        onChange={e => setManualData({...manualData, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-mono text-slate-400 mb-1">Localização</label>
                        <div className="flex gap-2">
                        <input 
                            type="text" 
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
                            placeholder="Ex: Escritório"
                            value={manualData.location}
                            onChange={e => setManualData({...manualData, location: e.target.value})}
                            list="locations-list"
                        />
                        <datalist id="locations-list">
                            {existingLocations.map(loc => (
                            <option key={loc} value={loc} />
                            ))}
                        </datalist>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-mono text-slate-400 mb-1">Protocolo</label>
                        <select 
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none appearance-none"
                            value={manualData.protocol}
                            onChange={e => setManualData({...manualData, protocol: e.target.value})}
                        >
                            <option value="RTSP">RTSP (IP Cam)</option>
                            <option value="ONVIF">ONVIF</option>
                            <option value="HTTP">HTTP/MJPEG</option>
                            <option value="DVR">DVR (Coaxial)</option>
                            <option value="WebRTC">WebRTC</option>
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-mono text-slate-400 mb-1">Endereço IP / Host</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-none"
                            placeholder="192.168.x.x"
                            value={manualData.ip}
                            onChange={e => setManualData({...manualData, ip: e.target.value})}
                        />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                        type="button" 
                        onClick={onClose}
                        className="px-4 py-2 rounded text-slate-400 hover:bg-slate-800 transition-colors text-sm font-bold"
                        >
                        CANCELAR
                        </button>
                        <button 
                        type="submit" 
                        className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white shadow-lg text-sm font-bold flex items-center gap-2"
                        >
                        <Save size={16} />
                        SALVAR
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddCameraModal;
