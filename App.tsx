
import React, { useState, useEffect } from 'react';
import { Player, Card, GameState } from './types';
import Square from './components/Square';
import WinnerModal from './components/WinnerModal';
import Scoreboard from './components/Scoreboard';

const SYMBOLS = ['🔥', '⚡', '💎', '🍀', '🍎', '🌈', '🌙', '⭐'];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState());
  const [isProcessing, setIsProcessing] = useState(false);

  function createInitialState(): GameState {
    const deck = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
        owner: null,
      }));

    return {
      board: deck,
      currentPlayer: 'X',
      flippedCards: [],
      winner: null,
      scores: { X: 0, O: 0 }
    };
  }

  const checkWinner = (board: Card[]) => {
    const size = 4;
    const winCondition = 3;

    // Helper para checar linhas, colunas e diagonais
    const checkLine = (cells: (Player | null)[]) => {
      let count = 0;
      let lastPlayer: Player | null = null;
      for (let player of cells) {
        if (player && player === lastPlayer) {
          count++;
          if (count >= winCondition) return player;
        } else {
          count = 1;
          lastPlayer = player;
        }
      }
      return null;
    };

    // Linhas
    for (let r = 0; r < size; r++) {
      const row = board.slice(r * size, (r + 1) * size).map(c => c.owner);
      const winner = checkLine(row);
      if (winner) return winner;
    }

    // Colunas
    for (let c = 0; c < size; c++) {
      const col = [board[c].owner, board[c+size].owner, board[c+size*2].owner, board[c+size*3].owner];
      const winner = checkLine(col);
      if (winner) return winner;
    }

    // Diagonais (simplificado para o grid 4x4 buscando 3)
    const diags = [
      [board[0].owner, board[5].owner, board[10].owner, board[15].owner],
      [board[1].owner, board[6].owner, board[11].owner],
      [board[4].owner, board[9].owner, board[14].owner],
      [board[3].owner, board[6].owner, board[9].owner, board[12].owner],
      [board[2].owner, board[5].owner, board[8].owner],
      [board[7].owner, board[10].owner, board[13].owner]
    ];

    for (let diag of diags) {
      const winner = checkLine(diag);
      if (winner) return winner;
    }

    if (board.every(c => c.isMatched)) return 'Draw';
    return null;
  };

  const handleCardClick = (id: number) => {
    if (isProcessing || gameState.winner || gameState.board[id].isMatched || gameState.flippedCards.includes(id)) return;

    const newFlipped = [...gameState.flippedCards, id];
    const newBoard = gameState.board.map(c => c.id === id ? { ...c, isFlipped: true } : c);

    setGameState(prev => ({ ...prev, board: newBoard, flippedCards: newFlipped }));

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstId, secondId] = newFlipped;
      
      if (newBoard[firstId].symbol === newBoard[secondId].symbol) {
        // MATCH!
        setTimeout(() => {
          const matchedBoard = newBoard.map(c => 
            (c.id === firstId || c.id === secondId) 
              ? { ...c, isMatched: true, owner: gameState.currentPlayer } 
              : c
          );
          
          const winner = checkWinner(matchedBoard);
          setGameState(prev => ({
            ...prev,
            board: matchedBoard,
            flippedCards: [],
            winner,
            scores: winner && winner !== 'Draw' 
              ? { ...prev.scores, [winner]: prev.scores[winner as Player] + 1 }
              : prev.scores
          }));
          setIsProcessing(false);
        }, 600);
      } else {
        // NO MATCH
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            board: prev.board.map(c => 
              (c.id === firstId || c.id === secondId) ? { ...c, isFlipped: false } : c
            ),
            flippedCards: [],
            currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X'
          }));
          setIsProcessing(false);
        }, 1200);
      }
    }
  };

  const resetGame = () => {
    setGameState(createInitialState());
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      <header className="mb-8 text-center relative z-10">
        <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
          MEMORY TOE
        </h1>
        <p className="text-slate-500 text-sm font-mono">ENCONTRE O PAR PARA MARCAR SEU TERRITÓRIO</p>
      </header>

      <Scoreboard scores={gameState.scores} currentPlayer={gameState.currentPlayer} />

      <div className="grid grid-cols-4 gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-md shadow-2xl relative z-10">
        {gameState.board.map(card => (
          <Square 
            key={card.id} 
            card={card} 
            onClick={() => handleCardClick(card.id)} 
          />
        ))}
      </div>

      <div className="mt-8 flex gap-4 relative z-10">
        <button 
          onClick={resetGame}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full font-bold transition-all border border-slate-700 text-sm"
        >
          REINICIAR TABULEIRO
        </button>
      </div>

      {gameState.winner && (
        <WinnerModal winner={gameState.winner} onRestart={resetGame} />
      )}
    </div>
  );
};

export default App;
