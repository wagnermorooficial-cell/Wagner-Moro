
import React from 'react';
import CameraFeed from './CameraFeed';
import { Camera } from '../types';

interface CameraGridProps {
  cameras: Camera[];
  layoutMode: number;
  onDelete: (id: string) => void;
}

const CameraGrid: React.FC<CameraGridProps> = ({ cameras, layoutMode, onDelete }) => {
  // Determinar classes de grid baseado no modo
  const getGridClasses = () => {
    if (layoutMode === 1) return 'grid-cols-1';
    if (layoutMode === 2) return 'grid-cols-2 grid-rows-2';
    if (layoutMode === 3) return 'grid-cols-3 grid-rows-3';
    
    // Modo Auto (0)
    const count = cameras.length;
    if (count <= 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  if (cameras.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-600">
        <div className="w-24 h-24 border-4 border-slate-800 border-dashed rounded-xl flex items-center justify-center mb-4">
          <span className="text-4xl">+</span>
        </div>
        <p className="font-mono text-lg">SEM SINAL DE VÍDEO</p>
        <p className="text-sm mt-2">Adicione uma câmera para começar o monitoramento.</p>
      </div>
    );
  }

  return (
    <div className={`h-full grid gap-1 ${getGridClasses()} bg-black p-1 overflow-y-auto`}>
      {cameras.map((camera) => (
        <CameraFeed key={camera.id} camera={camera} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default CameraGrid;
