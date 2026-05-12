import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase,
  Layers,
  DollarSign,
  PieChart
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useData } from '../../store/DataContext';
import { formatMoney } from '../../mock/data';

const container: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
};

export default function AdminDashboard() {
  const { orders } = useData();

  // Metrics calculation
  const totalGMV = orders.reduce((acc, o) => acc + o.totalBudget, 0);
  const netRevenue = totalGMV * 0.05; // 5% commission
  const activeOrders = orders.filter(o => o.status !== 'completed').length;
  const totalUsers = 142; // Mocked

  const stats = [
    { label: 'GMV Оборот', value: formatMoney(totalGMV), icon: <TrendingUp className="text-primary" />, trend: '+14%', up: true },
    { label: 'Чистая выручка', value: formatMoney(netRevenue), icon: <DollarSign className="text-success" />, trend: '+8%', up: true },
    { label: 'Активные заказы', value: activeOrders, icon: <Briefcase className="text-warning" />, trend: '-2', up: false },
    { label: 'Пользователи', value: totalUsers, icon: <Users className="text-indigo-500" />, trend: '+18', up: true },
  ];

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 pb-20 pt-4"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight">Admin Console</h1>
          <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Global Metrics • Real-time</p>
        </div>
        <div className="w-10 h-10 rounded-2xl gradient-hero flex items-center justify-center text-white shadow-lg glow-primary">
          <ShieldCheck size={20} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="h-full relative overflow-hidden" padding="sm">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center mb-3">
                {stat.icon}
              </div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-lg font-black text-text-main">{stat.value}</p>
              
              <div className={`mt-2 flex items-center gap-1 text-[10px] font-bold ${stat.up ? 'text-success' : 'text-danger'}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Chart Placeholder (Visual only) */}
      <motion.div variants={item}>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-text-main">Динамика выручки</h3>
            <div className="flex gap-2">
              <Badge variant="primary" size="sm">7D</Badge>
              <Badge variant="neutral" size="sm">30D</Badge>
            </div>
          </div>
          
          <div className="h-40 w-full flex items-end gap-2 px-1">
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                className={`flex-1 rounded-t-lg ${i === 6 ? 'gradient-hero shadow-lg' : 'bg-primary/20'}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[10px] font-bold text-text-muted px-1">
            <span>ПН</span><span>ВТ</span><span>СР</span><span>ЧТ</span><span>ПТ</span><span>СБ</span><span>ВС</span>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-main">Последние транзакции</h3>
          <button className="text-xs font-bold text-primary">Все</button>
        </div>
        
        <div className="space-y-3">
          {orders.slice(0, 3).map((order, i) => (
            <Card key={i} padding="sm" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Layers size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-main truncate">{order.title}</p>
                <p className="text-[10px] text-text-muted font-medium">Комиссия 5% получена</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-600">+{formatMoney(order.totalBudget * 0.05)}</p>
                <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Escrow Released</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Investment Readiness Alert */}
      <motion.div variants={item}>
        <Card className="bg-indigo-900 border-none text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <PieChart size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-300" />
              Investment Ready
            </h4>
            <p className="text-xs text-indigo-100/80 mb-4 leading-relaxed">
              Текущие показатели LTV/CAC составляют 5.2x. Юнит-экономика сошлась. Проект готов к масштабированию.
            </p>
            <button className="px-4 py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold shadow-lg shadow-white/10 active:scale-95 transition-transform">
              Выгрузить Pitch Deck
            </button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
