import React, { useEffect, useRef } from 'react';
import { Message, User } from '../App';

interface ChatWindowProps {
  messages: Message[];
  currentUser: User;
  onDeleteMessage: (id: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, currentUser, onDeleteMessage }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-5 bg-slate-950/50 custom-scrollbar">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-60">
          <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </div>
          <p className="text-xs font-mono tracking-widest text-center">CANAL SEGURO<br/>SEM MENSAGENS RECENTES</p>
        </div>
      )}

      {messages.map((msg, index) => {
        const isMe = msg.userId === currentUser.id;
        const isSystem = msg.type === 'system';
        const isAlert = msg.type === 'alert';
        const isAdminMsg = msg.role === 'admin';
        const isAdminUser = currentUser.role === 'admin';
        const showAvatar = index === 0 || messages[index - 1].userId !== msg.userId || messages[index - 1].type === 'system';

        if (isSystem) {
          return (
            <div key={msg.id} className="flex justify-center my-4 group relative">
              <span className="bg-slate-900/80 text-slate-500 text-[10px] md:text-xs py-1 px-4 rounded-full border border-slate-800 font-mono flex items-center gap-2 backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                {msg.text.toUpperCase()}
              </span>
              {isAdminUser && (
                  <button 
                    onClick={() => onDeleteMessage(msg.id)}
                    className="absolute right-0 top-0 translate-x-full ml-2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 transition-opacity"
                    title="Excluir (Admin)"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
              )}
            </div>
          );
        }

        if (isAlert) {
           return (
            <div key={msg.id} className="flex justify-center my-2 px-4 group relative">
              <div className="text-red-400 text-xs md:text-sm font-bold bg-red-950/40 px-4 py-2 rounded border border-red-900/50 flex items-center gap-2 text-center shadow-lg shadow-red-900/10">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {msg.text}
              </div>
              {isAdminUser && (
                  <button 
                    onClick={() => onDeleteMessage(msg.id)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-500 transition-opacity"
                    title="Excluir (Admin)"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
              )}
            </div>
          );
        }

        return (
          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
            <div className={`max-w-[85%] md:max-w-[70%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'} relative`}>
              
              {showAvatar && (
                <div className="flex items-center gap-2 mb-1 px-1 mt-2">
                    {isAdminMsg && !isMe && (
                    <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold shadow-sm shadow-amber-500/20">ADMIN</span>
                    )}
                    <span className={`text-xs font-bold tracking-wide ${isMe ? 'text-cyan-400' : isAdminMsg ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isMe ? 'Você' : msg.user}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">{formatTime(msg.timestamp)}</span>
                </div>
              )}
              
              <div className={`
                relative px-3 py-2 md:px-4 md:py-3 text-sm leading-relaxed shadow-md group
                ${isMe 
                  ? 'bg-gradient-to-br from-cyan-900/30 to-slate-900 text-cyan-50 border border-cyan-800/50 rounded-2xl rounded-tr-sm' 
                  : isAdminMsg 
                    ? 'bg-gradient-to-br from-amber-900/20 to-slate-900 text-amber-50 border border-amber-800/30 rounded-2xl rounded-tl-sm'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-2xl rounded-tl-sm'}
              `}>
                {/* Render Text */}
                {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}

                {/* Render Image */}
                {msg.type === 'image' && msg.attachment && (
                  <div className={`mt-2 rounded-lg overflow-hidden border border-black/20 ${msg.text ? '' : '-mt-1'}`}>
                    <img src={msg.attachment} alt="Anexo" className="max-w-full h-auto object-cover max-h-[300px] w-auto" loading="lazy" />
                  </div>
                )}

                {/* Render Video */}
                {msg.type === 'video' && msg.attachment && (
                   <div className={`mt-2 rounded-lg overflow-hidden border border-black/20 ${msg.text ? '' : '-mt-1'}`}>
                     <video controls className="max-w-full max-h-[300px]">
                       <source src={msg.attachment} />
                       Vídeo não suportado.
                     </video>
                   </div>
                )}

                {/* Admin Delete Button */}
                {isAdminUser && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); onDeleteMessage(msg.id); }}
                     className={`
                       absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border border-red-900/50 
                       flex items-center justify-center text-red-500 hover:text-red-400 hover:bg-red-950/50 shadow-sm
                       opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer
                     `}
                     title="Apagar Mensagem"
                   >
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                )}
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