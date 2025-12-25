
import React from 'react';
import { Player } from '../types';

interface WinnerModalProps {
  winner: Player | 'Draw' | null;
  onRestart: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-slate-900 border-2 border-slate-700 p-10 rounded-3xl text-center shadow-2xl max-w-sm w-full">
        <div className="text-6xl mb-6">
          {winner === 'Draw' ? '🤝' : winner === 'X' ? '🏆' : '👑'}
        </div>
        
        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
          {winner === 'Draw' ? 'EMPATE!' : `VITÓRIA DO ${winner}!`}
        </h2>
        
        <p className="text-slate-400 mb-8">
          {winner === 'Draw' ? 'Ninguém conseguiu formar a linha.' : `O Jogador ${winner} dominou o tabuleiro!`}
        </p>

        <button 
          onClick={onRestart}
          className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-lg
            ${winner === 'X' ? 'bg-blue-600 hover:bg-blue-500' : 
              winner === 'O' ? 'bg-rose-600 hover:bg-rose-500' : 
              'bg-emerald-600 hover:bg-emerald-500'}`}
        >
          JOGAR NOVAMENTE
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
