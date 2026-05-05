import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, ShieldAlert, Paperclip, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DisputeChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: 'Арбитраж открыт. К чату подключен специалист Технадзора.',
      time: '12:00',
    },
    {
      id: 2,
      sender: 'agent',
      name: 'Азамат (Технадзор)',
      text: 'Здравствуйте! Я изучил фото от исполнителя. Пожалуйста, опишите, какие у вас есть замечания по данному этапу?',
      time: '12:01',
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setMessage('');
    
    // Auto reply mock
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'agent',
          name: 'Азамат (Технадзор)',
          text: 'Принято. Мы запросим у исполнителя разъяснения и свяжемся с вами в течение часа. Средства на эскроу заморожены до решения вопроса.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-background safe-area-pt safe-area-pb">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-text-main hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-text-main flex items-center justify-center gap-1.5">
            <ShieldAlert size={16} className="text-danger" />
            Спор по этапу
          </h1>
          <p className="text-xs text-text-muted">Технадзор ГарантСтрой</p>
        </div>
        <div className="w-10" />
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-[11px] bg-gray-100 text-text-muted px-3 py-1 rounded-full font-medium">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isUser = msg.sender === 'user';
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {!isUser && <span className="text-xs text-text-muted ml-1 mb-1">{msg.name}</span>}
              <div className={`max-w-[85%] p-3 rounded-2xl ${
                isUser 
                  ? 'bg-primary text-white rounded-tr-sm' 
                  : 'bg-white border border-gray-100 shadow-sm rounded-tl-sm'
              }`}>
                <p className={`text-sm ${isUser ? 'text-white' : 'text-text-main'}`}>{msg.text}</p>
                <p className={`text-[10px] text-right mt-1 ${isUser ? 'text-white/70' : 'text-text-muted'}`}>{msg.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <button className="p-2 text-text-muted hover:text-primary transition-colors">
          <Paperclip size={20} />
        </button>
        <button className="p-2 text-text-muted hover:text-primary transition-colors">
          <Camera size={20} />
        </button>
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Опишите проблему..."
          className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-0"
        />
        <button 
          onClick={handleSend}
          disabled={!message.trim()}
          className={`p-2.5 rounded-full transition-colors ${
            message.trim() ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
          }`}
        >
          <Send size={18} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}
