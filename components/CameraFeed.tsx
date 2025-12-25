
import React, { useState, useEffect } from 'react';
import { Camera } from '../types';
import { Trash2, Maximize, Settings, AlertTriangle, Cloud } from 'lucide-react';

interface CameraFeedProps {
  camera: Camera;
  onDelete: (id: string) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ camera, onDelete }) => {
  const [time, setTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  };

  const getProviderBadge = (provider: string | undefined) => {
    if (!provider || provider === 'Manual') return null;
    let colorClass = 'bg-slate-600';
    if (provider.includes('Intelbras')) colorClass = 'bg-green-600';
    if (provider.includes('Hikvision')) colorClass = 'bg-red-600';
    if (provider.includes('Yoosee')) colorClass = 'bg-blue-600';
    if (provider.includes('XMEye')) colorClass = 'bg-orange-600';

    return (
        <span className={`${colorClass} px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1`}>
            <Cloud size={8} /> {provider}
        </span>
    );
  };

  return (
    <div 
      className="relative bg-black group border border-slate-900 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Feed Image (Simulation) */}
      <div className="absolute inset-0 w-full h-full">
         {camera.status === 'online' ? (
             <>
               <img 
                 src={camera.thumbnail} 
                 alt={camera.name} 
                 className="w-full h-full object-cover opacity-80"
               />
               {/* Scanline Effect */}
               <div className="absolute inset-0 scanline pointer-events-none opacity-20"></div>
             </>
         ) : (
             <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                <AlertTriangle className="text-amber-500 w-12 h-12 mb-2 animate-pulse" />
                <span className="font-mono text-amber-500 font-bold">NO SIGNAL</span>
                <span className="font-mono text-xs text-slate-600 mt-1">CHECK CONNECTION</span>
             </div>
         )}
      </div>

      {/* Overlay Info */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-white font-bold bg-black/50 px-1 inline-block">CAM-{camera.id.toUpperCase()}</span>
            {getProviderBadge(camera.provider)}
          </div>
          <span className="text-xs text-slate-200 drop-shadow-md font-semibold">{camera.name}</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="font-mono text-xs text-white drop-shadow-md">{formatDate(time)}</span>
           <span className="text-[10px] text-slate-300 bg-blue-900/50 px-1 rounded border border-blue-500/30 mt-1">
             {camera.protocol}
           </span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-2 right-2 flex gap-2">
         {camera.isRecording && (
             <div className="flex items-center gap-1 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-red-500">REC</span>
             </div>
         )}
         {camera.hasMotion && (
             <div className="flex items-center gap-1 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 animate-bounce">
               <span className="text-[10px] font-bold text-amber-500">MOTION</span>
             </div>
         )}
      </div>

      {/* Controls (Visible on Hover) */}
      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
         <button className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-colors" title="Configurações">
            <Settings size={20} />
         </button>
         <button className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-colors" title="Tela Cheia">
            <Maximize size={20} />
         </button>
         <button 
           className="p-2 bg-red-900/80 rounded-full hover:bg-red-700 text-white transition-colors border border-red-500/50" 
           title="Remover Câmera"
           onClick={() => onDelete(camera.id)}
         >
            <Trash2 size={20} />
         </button>
      </div>
    </div>
  );
};

export default CameraFeed;
