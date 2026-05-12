import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp, MapPin, Users, MessageSquare } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import FaceIdModal from '../../components/ui/FaceIdModal';
import BeforeAfterSlider from '../../components/ui/BeforeAfterSlider';
import { formatMoney, formatDate, statusLabels, statusVariants } from '../../mock/data';
import { useData } from '../../store/DataContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item: any = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

const milestoneIcons: Record<string, React.ReactNode> = {
  accepted: <CheckCircle2 size={18} className="text-success" />,
  in_progress: <Clock size={18} className="text-warning" />,
  pending: <Clock size={18} className="text-text-muted" />,
  disputed: <AlertTriangle size={18} className="text-danger" />,
  review: <Clock size={18} className="text-primary" />,
};

export default function CustomerOrders() {
  const { customerOrders, getBidsForOrder, acceptBid, updateMilestoneStatus } = useData();
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showFaceId, setShowFaceId] = useState(false);
  const [acceptingMsId, setAcceptingMsId] = useState<{orderId: string, msId: string} | null>(null);
  const [showDisputeFaceId, setShowDisputeFaceId] = useState(false);
  const [disputingMs, setDisputingMs] = useState<{orderId: string, msId: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = ['Все', 'В работе', 'Завершённые'];
  const filtered = activeTab === 0 ? customerOrders
    : activeTab === 1 ? customerOrders.filter(o => o.status === 'in_progress' || o.status === 'published')
    : customerOrders.filter(o => o.status === 'completed');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-main">Мои заказы</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Вы заказчик • {customerOrders.length} заказов
        </p>
      </motion.div>

      <motion.div variants={item} className="flex gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              i === activeTab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-secondary text-text-muted hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="space-y-4 mt-4">
          {[1, 2].map(i => (
            <Card key={i} className="p-4" padding="sm">
              <div className="flex justify-between mb-3">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full mt-4" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filtered.map((order) => {
        const isExpanded = expandedOrder === order.id;
        const orderBids = getBidsForOrder(order.id);
        const completedMs = order.milestones.filter(m => m.status === 'accepted').length;
        const progress = (completedMs / order.milestones.length) * 100;

        return (
          <motion.div key={order.id} variants={item}>
            <Card padding="sm" className="overflow-hidden">
              <button className="w-full p-3 flex items-start justify-between text-left" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-text-main">{order.title}</h3>
                    <Badge variant={statusVariants[order.status]} size="sm">{statusLabels[order.status]}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {order.address}</span>
                  </div>
                  <p className="text-base font-bold text-primary mt-2">{formatMoney(order.totalBudget)}</p>
                </div>
                <div className="ml-2 mt-1 text-text-muted">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
              </button>

              <div className="px-3 pb-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-3 pb-4 border-t border-gray-50 pt-3">
                      <p className="text-sm text-text-muted mb-4">{order.description}</p>

                      {order.contractorId && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50/60 border border-green-100/50 mb-4">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">С</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">Сергей Мастеров</p>
                            <p className="text-xs text-text-muted">Исполнитель • ⭐ 4.8</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/chat/${order.id}`);
                            }}
                            className="p-2 rounded-full bg-white text-primary shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <MessageSquare size={18} />
                          </button>
                        </div>
                      )}

                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Этапы работ</h4>
                      <div className="space-y-2.5">
                        {order.milestones.map((ms, idx) => (
                          <div key={ms.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80">
                            <div className="relative">
                              {milestoneIcons[ms.status]}
                              {idx < order.milestones.length - 1 && <div className="absolute left-[8px] top-[22px] w-0.5 h-4 bg-gray-200" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{ms.title}</p>
                              <p className="text-xs text-text-muted">{formatMoney(ms.amount)} • до {formatDate(ms.deadline)}</p>
                            </div>
                            <Badge variant={statusVariants[ms.status]} size="sm">{statusLabels[ms.status]}</Badge>
                          </div>
                        ))}
                      </div>

                      {/* Bids for orders without contractor */}
                      {orderBids.length > 0 && !order.contractorId && (
                        <div className="mt-5">
                          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Users size={13} /> Отклики ({orderBids.length})
                          </h4>
                          <div className="space-y-2">
                            {orderBids.map((bid) => (
                              <div key={bid.id} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">{bid.contractorName[0]}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold">{bid.contractorName}</p>
                                  <p className="text-xs text-text-muted truncate">{bid.message}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-primary">{formatMoney(bid.proposedPrice)}</p>
                                  <Button size="sm" className="mt-1 !px-3 !py-1 !text-xs" onClick={() => acceptBid(bid.id)}>Принять</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Accept milestone button for review milestones */}
                      {order.milestones.some(m => m.status === 'in_progress') && (
                        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
                          <p className="text-xs text-amber-700 mb-2">Этап «{order.milestones.find(m => m.status === 'in_progress')?.title}» выполняется исполнителем</p>
                          <p className="text-[11px] text-text-muted">Вы сможете принять или оспорить результат после завершения</p>
                        </div>
                      )}

                      {/* Review Milestones */}
                      {order.milestones.filter(m => m.status === 'review').map(ms => (
                        <div key={`review-${ms.id}`} className="mt-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm ios-shadow">
                          <h4 className="text-sm font-semibold mb-1">
                            Приёмка: {ms.title}
                          </h4>
                          <p className="text-xs text-text-muted mb-3">
                            Исполнитель завершил этап. Проверьте результат и примите работу.
                          </p>
                          
                          {ms.photos && (
                            <div className="mb-4">
                              <BeforeAfterSlider beforeImage={ms.photos.before} afterImage={ms.photos.after} />
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              className="flex-1 !border-danger !text-danger hover:!bg-danger/5"
                              onClick={() => {
                                setDisputingMs({ orderId: order.id, msId: ms.id });
                                setShowDisputeFaceId(true);
                              }}
                            >
                              Есть замечания
                            </Button>
                            <Button 
                              variant="primary" 
                              className="flex-1"
                              onClick={() => {
                                setAcceptingMsId({ orderId: order.id, msId: ms.id });
                                setShowFaceId(true);
                              }}
                            >
                              Принять этап
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        );
      })}
        </>
      )}
      
      <FaceIdModal 
        isOpen={showFaceId} 
        onSuccess={() => {
          if (acceptingMsId) {
            updateMilestoneStatus(acceptingMsId.orderId, acceptingMsId.msId, 'accepted');
            setAcceptingMsId(null);
          }
          setShowFaceId(false);
        }} 
      />

      {/* Face ID for dispute/rejection */}
      <FaceIdModal 
        isOpen={showDisputeFaceId} 
        onSuccess={() => {
          if (disputingMs) {
            updateMilestoneStatus(disputingMs.orderId, disputingMs.msId, 'disputed');
            setShowDisputeFaceId(false);
            navigate(`/dispute/${disputingMs.orderId}`);
            setDisputingMs(null);
          } else {
            setShowDisputeFaceId(false);
          }
        }} 
      />
    </motion.div>
  );
}
