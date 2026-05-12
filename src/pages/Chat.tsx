import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Paperclip, MoreVertical, CheckCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../store/UserContext';
import { useData } from '../store/DataContext';

export default function Chat() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { role, userName } = useUser();
  const { getMessages, sendMessage, orders } = useData();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const order = orders.find(o => o.id === orderId);
  const messages = getMessages(orderId || '', 'direct');

  let opponentName = 'Собеседник';
  if (order) {
    if (role === 'customer') {
      // Ideally get contractor name from order/bids, but we fallback:
      opponentName = `Исполнитель по этапу`;
    } else {
      opponentName = 'Заказчик';
    }
  }

  const handleSend = () => {
    if (!message.trim() || !orderId) return;
    
    sendMessage({
      orderId,
      type: 'direct',
      senderRole: role,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: userName
    });
    setMessage('');
    
    // Simulate other person typing and replying if it's the first message
    if (messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2500);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background safe-area-pt safe-area-pb">
      {/* Premium Glass Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/60 flex items-center justify-between px-3 h-16">
        <div className="flex items-center gap-1">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
            className="p-2 text-primary hover:bg-white/50 rounded-full transition-colors"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </motion.button>
          
          <div className="flex items-center gap-3 ml-1">
            <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center text-white font-bold text-sm shadow-md glow-primary">
              {opponentName[0]}
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-text-main leading-tight tracking-tight">
                {opponentName}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`status-dot ${isTyping ? 'bg-primary' : 'bg-success'}`} />
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  {isTyping ? 'печатает...' : 'в сети'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-white hover:bg-gray-50 transition-colors"
        >
          <MoreVertical size={20} className="text-text-muted" />
        </motion.button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth">
        <div className="flex justify-center my-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60 bg-white/50 px-4 py-1.5 rounded-full border border-white/80">
            Сегодня
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.senderRole === role;

          return (
            <motion.div 
              initial={{ opacity: 0, x: isUser ? 20 : -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              key={msg.id} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className={`relative max-w-[85%] p-3 px-4 shadow-sm ${
                isUser 
                  ? 'gradient-hero text-white rounded-2xl rounded-tr-none glow-primary' 
                  : 'bg-white border border-white/60 rounded-2xl rounded-tl-none card-premium'
              }`}>
                <p className={`text-[14px] leading-relaxed font-medium ${isUser ? 'text-white' : 'text-text-main'}`}>
                  {msg.text}
                </p>
                <div className={`flex items-center justify-end gap-1.5 mt-1 -mb-0.5 ${isUser ? 'text-white/70' : 'text-text-muted'}`}>
                  <span className="text-[9px] font-bold">{msg.time}</span>
                  {isUser && (
                    <CheckCheck size={12} className="text-white/80" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start"
          >
            <div className="bg-white border border-white/60 rounded-2xl rounded-tl-none px-4 py-3 card-premium flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Premium Input Area */}
      <div className="p-4 bg-background/80 backdrop-blur-md border-t border-white/60 flex items-end gap-3 safe-area-pb">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-white text-text-muted hover:text-primary transition-colors"
        >
          <Paperclip size={20} />
        </motion.button>
        
        <div className="flex-1 bg-white shadow-inner-sm border border-white rounded-2xl flex items-center overflow-hidden min-h-[44px] max-h-[120px] px-1">
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Напишите сообщение..."
            className="w-full bg-transparent border-none px-3 py-3 text-[14px] font-medium focus:ring-0 resize-none max-h-[100px] outline-none placeholder:text-text-muted/60"
            rows={1}
            style={{ minHeight: '44px' }}
          />
        </div>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!message.trim()}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            message.trim() 
              ? 'gradient-hero text-white shadow-lg glow-primary' 
              : 'bg-white text-text-muted/40 border border-white'
          }`}
        >
          <Send size={20} className={message.trim() ? 'translate-x-0.5' : ''} />
        </motion.button>
      </div>
    </div>
  );
}
