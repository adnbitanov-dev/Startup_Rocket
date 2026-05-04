import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Star, Briefcase, ChevronRight, Camera } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { contractorEarnings, formatMoney, statusLabels, statusVariants } from '../../mock/data';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../store/DataContext';

const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item: any = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

export default function ContractorDashboard() {
  const navigate = useNavigate();
  const { contractorActiveJobs } = useData();
  const currentJob = contractorActiveJobs[0];
  const currentMilestone = currentJob?.milestones.find(m => m.status === 'in_progress');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      {/* Greeting */}
      <motion.div variants={item}>
        <p className="text-text-muted text-sm">Кабинет исполнителя 🔨</p>
        <h1 className="text-2xl font-bold text-text-main mt-0.5">Мои работы</h1>
      </motion.div>

      {/* Earnings card */}
      <motion.div variants={item}>
        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 !border-0 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium flex items-center gap-1.5">
                <Wallet size={14} /> Мой заработок
              </p>
              <p className="text-3xl font-bold mt-2 tracking-tight">
                {formatMoney(contractorEarnings.totalEarned)}
              </p>
              <p className="text-white/60 text-xs mt-1">
                ожидает выплаты: {formatMoney(contractorEarnings.pendingPayment)}
              </p>
            </div>
            <div className="bg-white/15 rounded-xl p-2.5 backdrop-blur-sm">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="flex gap-4 mt-5 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2">
              <div className="bg-white/15 rounded-lg p-1.5"><Star size={14} /></div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Рейтинг</p>
                <p className="text-sm font-semibold">{contractorEarnings.rating} ({contractorEarnings.reviewCount})</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/15 rounded-lg p-1.5"><Briefcase size={14} /></div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Работы</p>
                <p className="text-sm font-semibold">{contractorEarnings.activeJobs} активная</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Active milestone */}
      {currentMilestone && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-main">Текущий этап</h2>
            <Badge variant="warning">В работе</Badge>
          </div>
          <Card className="border-l-4 !border-l-warning">
            <p className="text-sm text-text-muted">{currentJob.title}</p>
            <p className="text-lg font-bold mt-0.5">{currentMilestone.title}</p>
            <p className="text-xs text-text-muted mt-1">{currentJob.address}</p>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm font-semibold text-success">{formatMoney(currentMilestone.amount)}</span>
              <span className="text-xs text-text-muted">📅 до {new Date(currentMilestone.deadline).toLocaleDateString('ru-RU')}</span>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-text-muted mb-1">
                <span>Прогресс заказа</span>
                <span>{currentJob.milestones.filter(m => m.status === 'accepted').length}/{currentJob.milestones.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentJob.milestones.filter(m => m.status === 'accepted').length / currentJob.milestones.length) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold transition-colors hover:bg-primary-hover">
                <Camera size={16} /> Загрузить фото
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-success/10 text-green-700 text-sm font-semibold transition-colors hover:bg-success/20">
                Этап готов ✓
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Active jobs list */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-text-main">Активные работы</h2>
          <button className="text-sm text-primary font-medium" onClick={() => navigate('/contractor/jobs')}>Все →</button>
        </div>
        <div className="space-y-3">
          {contractorActiveJobs.map(job => (
            <Card key={job.id} hoverable onClick={() => navigate('/contractor/jobs')}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">{job.title}</p>
                    <Badge variant={statusVariants[job.status]} size="sm">{statusLabels[job.status]}</Badge>
                  </div>
                  <p className="text-xs text-text-muted mt-1">{job.address}</p>
                  <p className="text-sm font-semibold text-success mt-1.5">{formatMoney(job.totalBudget)}</p>
                </div>
                <ChevronRight size={18} className="text-text-muted" />
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Quick action — find orders */}
      <motion.div variants={item}>
        <button
          onClick={() => navigate('/contractor/feed')}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
        >
          🔍 Найти новые заказы
        </button>
      </motion.div>
    </motion.div>
  );
}
