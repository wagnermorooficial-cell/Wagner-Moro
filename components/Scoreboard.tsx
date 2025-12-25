
import React from 'react';
import { Player } from '../types';

interface ScoreboardProps {
  scores: { X: number; O: number };
  currentPlayer: Player;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ scores, currentPlayer }) => {
  return (
    <div className="flex gap-8 mb-6 relative z-10">
      <div className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${currentPlayer === 'X' ? 'bg-blue-600/10 border-blue-500 scale-110' : 'bg-slate-900 border-slate-800 opacity-50'}`}>
        <span className="text-xs font-black text-blue-400 uppercase mb-1">Jogador X</span>
        <span className="text-2xl font-black text-white">{scores.X}</span>
        {currentPlayer === 'X' && <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
      </div>

      <div className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${currentPlayer === 'O' ? 'bg-rose-600/10 border-rose-500 scale-110' : 'bg-slate-900 border-slate-800 opacity-50'}`}>
        <span className="text-xs font-black text-rose-400 uppercase mb-1">Jogador O</span>
        <span className="text-2xl font-black text-white">{scores.O}</span>
        {currentPlayer === 'O' && <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>}
      </div>
    </div>
  );
};

export default Scoreboard;
