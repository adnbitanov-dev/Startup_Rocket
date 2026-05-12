import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Paperclip, Camera, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../store/UserContext';

export default function Chat() {
  const navigate = useNavigate();
  const { role } = useUser();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: role === 'customer' ? 'other' : 'me', // Mock logic for UI
      text: 'Здравствуйте! Я готов начать работу. Подскажите, когда удобнее подъехать на объект?',
      time: '10:00',
      isRead: true,
    },
    {
      id: 2,
      senderId: role === 'customer' ? 'me' : 'other',
      text: 'Добрый день! Сегодня после 14:00 будет отлично. Адрес тот же.',
      time: '10:15',
      isRead: true,
    }
  ]);

  const opponentName = role === 'customer' ? 'Сергей (Исполнитель)' : 'Айдан (Заказчик)';

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: Date.now(),
        senderId: 'me',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      }
    ]);
    setMessage('');
    
    // Simulate other person typing and replying
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          senderId: 'other',
          text: 'Принято! Буду на связи.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        }
      ]);
    }, 2500);
  };

  return (
    <div className="h-screen flex flex-col bg-[#EFEFF4] safe-area-pt safe-area-pb">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-primary hover:bg-gray-100 rounded-full transition-colors flex items-center"
          >
            <ChevronLeft size={28} className="-ml-1" />
            <span className="text-base font-medium -ml-1">Назад</span>
          </button>
          
          <div className="flex items-center gap-2.5 ml-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {opponentName[0]}
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-text-main leading-tight">
                {opponentName}
              </h1>
              <p className="text-[11px] text-text-muted">
                {isTyping ? <span className="text-primary font-medium">печатает...</span> : 'в сети'}
              </p>
            </div>
          </div>
        </div>
        
        <button className="p-2 text-primary hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical size={24} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center mb-6">
          <span className="text-[11px] bg-black/5 text-gray-500 px-3 py-1 rounded-full font-medium">
            Сегодня
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.senderId === 'me';
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className={`relative max-w-[80%] p-2.5 px-3.5 shadow-sm ${
                isUser 
                  ? 'bg-[#007AFF] text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-white border border-gray-100 rounded-2xl rounded-tl-sm'
              }`}>
                <p className={`text-[15px] leading-relaxed ${isUser ? 'text-white' : 'text-text-main'}`}>
                  {msg.text}
                </p>
                <div className={`flex items-center justify-end gap-1 mt-0.5 -mb-0.5 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                  <span className="text-[10px]">{msg.time}</span>
                  {isUser && (
                    msg.isRead ? <CheckCheck size={12} className="text-blue-200" /> : <Check size={12} />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start"
          >
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-2 pb-4 bg-[#F6F6F8] border-t border-gray-200 flex items-end gap-2">
        <button className="p-2 text-primary hover:bg-gray-200 rounded-full transition-colors mb-0.5">
          <Paperclip size={24} />
        </button>
        <button className="p-2 text-primary hover:bg-gray-200 rounded-full transition-colors mb-0.5">
          <Camera size={24} />
        </button>
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl flex items-center overflow-hidden min-h-[40px] max-h-[120px]">
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Сообщение"
            className="w-full bg-transparent border-none px-3 py-2 text-[15px] focus:ring-0 resize-none max-h-[100px] outline-none"
            rows={1}
            style={{ minHeight: '40px' }}
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={!message.trim()}
          className={`p-2.5 rounded-full transition-colors mb-0.5 ${
            message.trim() ? 'bg-primary text-white' : 'bg-transparent text-primary/50'
          }`}
        >
          <Send size={20} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}
