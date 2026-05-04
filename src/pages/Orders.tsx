import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp, MapPin, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
  mockOrders,
  mockBids,
  formatMoney,
  formatDate,
  statusLabels,
  statusVariants,
} from '../mock/data';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const milestoneIcons: Record<string, React.ReactNode> = {
  accepted: <CheckCircle2 size={18} className="text-success" />,
  in_progress: <Clock size={18} className="text-warning" />,
  pending: <Clock size={18} className="text-text-muted" />,
  disputed: <AlertTriangle size={18} className="text-danger" />,
  review: <Clock size={18} className="text-primary" />,
};

export default function Orders() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(mockOrders[0].id);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-main">Заказы</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {mockOrders.length} заказов • {mockOrders.filter((o) => o.status === 'in_progress').length} в работе
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2">
        {['Все', 'В работе', 'Завершённые'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              i === 0
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-secondary text-text-muted hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Orders list */}
      {mockOrders.map((order) => {
        const isExpanded = expandedOrder === order.id;
        const orderBids = mockBids.filter((b) => b.orderId === order.id);
        const completedMilestones = order.milestones.filter((m) => m.status === 'accepted').length;
        const progress = (completedMilestones / order.milestones.length) * 100;

        return (
          <motion.div key={order.id} variants={item}>
            <Card padding="sm" className="overflow-hidden">
              {/* Order header */}
              <button
                className="w-full p-3 flex items-start justify-between text-left"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-text-main">{order.title}</h3>
                    <Badge variant={statusVariants[order.status]} size="sm">
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {order.address}
                    </span>
                  </div>
                  <p className="text-base font-bold text-primary mt-2">
                    {formatMoney(order.totalBudget)}
                  </p>
                </div>
                <div className="ml-2 mt-1 text-text-muted">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Progress bar */}
              <div className="px-3 pb-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-4 border-t border-gray-50 pt-3">
                      {/* Description */}
                      <p className="text-sm text-text-muted mb-4">{order.description}</p>

                      {/* Milestones */}
                      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                        Этапы работ
                      </h4>
                      <div className="space-y-2.5">
                        {order.milestones.map((ms, idx) => (
                          <div
                            key={ms.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80"
                          >
                            <div className="relative">
                              {milestoneIcons[ms.status]}
                              {idx < order.milestones.length - 1 && (
                                <div className="absolute left-[8px] top-[22px] w-0.5 h-4 bg-gray-200" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{ms.title}</p>
                              <p className="text-xs text-text-muted">
                                {formatMoney(ms.amount)} • до {formatDate(ms.deadline)}
                              </p>
                            </div>
                            <Badge variant={statusVariants[ms.status]} size="sm">
                              {statusLabels[ms.status]}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Bids section */}
                      {orderBids.length > 0 && (
                        <div className="mt-5">
                          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Users size={13} /> Отклики ({orderBids.length})
                          </h4>
                          <div className="space-y-2">
                            {orderBids.map((bid) => (
                              <div
                                key={bid.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50"
                              >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                  {bid.contractorName[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold">{bid.contractorName}</p>
                                  <p className="text-xs text-text-muted truncate">{bid.message}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-primary">
                                    {formatMoney(bid.proposedPrice)}
                                  </p>
                                  <Button size="sm" className="mt-1 !px-3 !py-1 !text-xs">
                                    Принять
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
