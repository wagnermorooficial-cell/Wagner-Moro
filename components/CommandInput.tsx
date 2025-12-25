
import React, { useState, KeyboardEvent } from 'react';

interface CommandInputProps {
  onSend: (text: string) => void;
  currentUser: string | null;
  placeholder: string;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSend, currentUser, placeholder }) => {
  const [text, setText] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-slate-500 font-mono text-lg">{'>'}</span>
      </div>
      <input
        type="text"
        className="block w-full pl-8 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-lg 
                   text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 
                   font-mono transition-all shadow-inner"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <kbd className="hidden md:inline-block px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-800 border border-slate-700 rounded">
          ENTER
        </kbd>
      </div>
    </div>
  );
};

export default CommandInput;
