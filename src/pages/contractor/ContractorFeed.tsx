import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Layers, Send } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatMoney, timeAgo } from '../../mock/data';
import { useData } from '../../store/DataContext';

const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item: any = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

export default function ContractorFeed() {
  const { availableOrders, hasBidOnOrder, getBidsForOrder, submitBid } = useData();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [biddingOrderId, setBiddingOrderId] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitBid = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000)); // mock api
    submitBid(orderId, parseInt(bidPrice), bidMessage);
    setIsSubmitting(false);
    setBiddingOrderId(null);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-main">Доступные заказы</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {availableOrders.length} новых заказов в вашем городе
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {['Все', 'Сантехника', 'Электрика', 'Отделка', 'Монтаж'].map((f, i) => (
          <button
            key={f}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              i === 0 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-secondary text-text-muted hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Orders */}
      {availableOrders.map((order) => {
        const hasBid = hasBidOnOrder(order.id);
        const myBid = getBidsForOrder(order.id).find(b => b.contractorId === 'u-contractor');
        const isSelected = selectedOrder === order.id;

        return (
          <motion.div key={order.id} variants={item}>
            <Card padding="sm" hoverable={!biddingOrderId} onClick={() => {
              if (biddingOrderId === order.id) return;
              setSelectedOrder(isSelected ? null : order.id);
              setBiddingOrderId(null);
            }}>
              <div className="p-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-text-main">{order.title}</h3>
                      {hasBid && <Badge variant="primary" size="sm">Откликнулись</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <MapPin size={12} /> {order.address}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <Clock size={12} /> {timeAgo(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`text-text-muted transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>

                {/* Budget & milestones summary */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div>
                    <p className="text-xl font-bold text-success">{formatMoney(order.totalBudget)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Layers size={13} /> {order.milestones.length} этапов
                  </div>
                </div>

                {/* Expanded */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-gray-50"
                  >
                    <p className="text-sm text-text-muted mb-3">{order.description}</p>

                    {/* Milestones preview */}
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Этапы</h4>
                    <div className="space-y-1.5 mb-4">
                      {order.milestones.map((ms) => (
                        <div key={ms.id} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-gray-50/80 text-sm">
                          <span className="font-medium">{ms.title}</span>
                          <span className="text-text-muted text-xs">{formatMoney(ms.amount)}</span>
                        </div>
                      ))}
                    </div>

                    {hasBid && myBid ? (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
                        <p className="text-sm font-medium text-primary">✓ Вы уже откликнулись</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          Ваша цена: {formatMoney(myBid.proposedPrice)}
                        </p>
                      </div>
                    ) : biddingOrderId === order.id ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-3"
                        onClick={e => e.stopPropagation()}
                      >
                        <h5 className="text-sm font-semibold text-text-main">Ваше предложение</h5>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">За какую сумму готовы выполнить?</label>
                          <input 
                            type="number" 
                            placeholder={order.totalBudget.toString()}
                            value={bidPrice}
                            onChange={e => setBidPrice(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-primary text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-text-muted mb-1 block">Сообщение заказчику</label>
                          <textarea 
                            placeholder="Опишите ваш опыт и почему стоит выбрать вас..."
                            value={bidMessage}
                            onChange={e => setBidMessage(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-primary text-sm resize-none h-20"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button 
                            className="flex-1 py-2 rounded-xl bg-gray-200 text-gray-700 text-sm font-medium"
                            onClick={(e) => { e.stopPropagation(); setBiddingOrderId(null); }}
                          >
                            Отмена
                          </button>
                          <button 
                            className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            onClick={(e) => handleSubmitBid(order.id, e)}
                            disabled={isSubmitting || !bidPrice}
                          >
                            {isSubmitting ? 'Отправка...' : 'Отправить'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <Button fullWidth icon={<Send size={16} />} onClick={(e) => {
                        e.stopPropagation();
                        setBiddingOrderId(order.id);
                        setBidPrice(order.totalBudget.toString());
                      }}>
                        Откликнуться
                      </Button>
                    )}
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
