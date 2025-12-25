import React, { useEffect, useRef } from 'react';

export interface Message {
  id: string;
  user: string;
  text: string;
  type: 'text' | 'system' | 'alert';
  timestamp: number;
}

interface ChatWindowProps {
  messages: Message[];
  currentUser: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, currentUser }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          <p>Nenhuma mensagem no histórico recente.</p>
        </div>
      )}

      {messages.map((msg) => {
        const isMe = msg.user === currentUser;
        const isSystem = msg.type === 'system';
        const isAlert = msg.type === 'alert';

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center my-4">
              <span className="bg-slate-800/50 text-slate-400 text-xs py-1 px-3 rounded-full border border-slate-700/50 font-mono">
                SYSTEM: {msg.text} <span className="opacity-50 ml-2">{formatTime(msg.timestamp)}</span>
              </span>
            </div>
          );
        }

        if (isAlert) {
           return (
            <div key={msg.id} className="flex justify-center my-2 animate-pulse">
              <span className="text-red-400 text-sm font-bold bg-red-950/30 px-4 py-2 rounded border border-red-900/50">
                ⚠ {msg.text}
              </span>
            </div>
          );
        }

        return (
          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
            <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-xs font-bold ${isMe ? 'text-cyan-400' : 'text-emerald-400'}`}>
                  {isMe ? 'Você' : msg.user}
                </span>
                <span className="text-[10px] text-slate-600 font-mono">{formatTime(msg.timestamp)}</span>
              </div>
              
              <div className={`
                relative px-4 py-3 rounded-lg text-sm leading-relaxed shadow-sm
                ${isMe 
                  ? 'bg-cyan-900/20 text-cyan-100 border border-cyan-800/50 rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}
              `}>
                {msg.text}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;