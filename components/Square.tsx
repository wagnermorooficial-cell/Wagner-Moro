
import React from 'react';
import { Card } from '../types';

interface SquareProps {
  card: Card;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ card, onClick }) => {
  return (
    <div 
      className="w-16 h-16 sm:w-20 sm:h-20 perspective-1000 cursor-pointer"
      onClick={onClick}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
        
        {/* Face Frontal (Escondida) */}
        <div className="absolute inset-0 backface-hidden bg-slate-800 border-2 border-slate-700 rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors">
          <div className="w-6 h-6 rounded-full border-2 border-slate-600 opacity-20"></div>
        </div>

        {/* Face Traseira (Revelada) */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 flex flex-col items-center justify-center shadow-inner transition-all
          ${card.owner === 'X' ? 'bg-blue-600/20 border-blue-500 shadow-blue-500/20' : 
            card.owner === 'O' ? 'bg-rose-600/20 border-rose-500 shadow-rose-500/20' : 
            'bg-slate-700 border-slate-600'}`}>
          
          <span className="text-2xl sm:text-3xl filter drop-shadow-md">{card.symbol}</span>
          
          {card.owner && (
            <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black
              ${card.owner === 'X' ? 'bg-blue-500 border-slate-900 text-white' : 'bg-rose-500 border-slate-900 text-white'}`}>
              {card.owner}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Square;
