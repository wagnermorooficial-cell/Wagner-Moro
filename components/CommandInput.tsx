import React, { useState, KeyboardEvent, useRef } from 'react';

interface CommandInputProps {
  onSend: (text: string, file?: File) => void;
  placeholder: string;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSend, placeholder }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleSendClick = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Limite simples de segurança para evitar travar o localStorage (apenas para demo)
      if (file.size > 3 * 1024 * 1024) {
        alert("Arquivo muito grande para o sistema interno (Máx 3MB)");
        e.target.value = '';
        return;
      }
      onSend("", file);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="relative flex items-center gap-2 max-w-4xl mx-auto w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*,video/*"
        className="hidden" 
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="p-3 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
        title="Anexar Mídia"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
      </button>

      <div className="relative flex-1 group">
        <input
          type="text"
          className="block w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg 
                     text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 
                     text-sm md:text-base font-sans transition-all shadow-inner"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>

      <button 
        onClick={handleSendClick}
        disabled={!text.trim()}
        className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors flex-shrink-0 shadow-lg"
      >
         <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
      </button>
    </div>
  );
};

export default CommandInput;