import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Star, Briefcase, ChevronRight, Search, Award, Zap } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { contractorEarnings, formatMoney, statusLabels, statusVariants } from '../../mock/data';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import { useUser } from '../../store/UserContext';

const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } } };

export default function ContractorDashboard() {
  const navigate = useNavigate();
  const { contractorActiveJobs } = useData();
  const { userName } = useUser();
  const firstName = userName?.split(' ')[0] || 'Мастер';
  const currentJob = contractorActiveJobs[0];
  const currentMilestone = currentJob?.milestones.find(m => m.status === 'in_progress');
  const completedMs = currentJob?.milestones.filter(m => m.status === 'accepted').length || 0;
  const totalMs = currentJob?.milestones.length || 1;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 pb-6">

      {/* Greeting */}
      <motion.div variants={item} className="pt-1">
        <p className="text-text-muted text-sm font-medium">Кабинет исполнителя 🔨</p>
        <h1 className="text-2xl font-bold text-text-main mt-0.5 tracking-tight">{firstName}</h1>
      </motion.div>

      {/* Earnings hero */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-2xl p-5" style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #0d9488 100%)'
        }}>
          {/* Decorative */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-4 w-28 h-28 rounded-full bg-white/5" />
          <div className="absolute top-4 right-4 animate-float">
            <Award size={40} className="text-white/20" />
          </div>

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet size={12} /> Мой заработок
                </p>
                <p className="text-4xl font-black mt-1.5 text-white tracking-tight">
                  {formatMoney(contractorEarnings.totalEarned)}
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  ожидает: {formatMoney(contractorEarnings.pendingPayment)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
            </div>

            <div className="flex gap-4 pt-3 border-t border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                  <Star size={13} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Рейтинг</p>
                  <p className="text-sm font-bold text-white">⭐ {contractorEarnings.rating}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                  <Briefcase size={13} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">Выполнено</p>
                  <p className="text-sm font-bold text-white">{contractorEarnings.reviewCount} работ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {[
          { icon: <Zap size={18} className="text-indigo-500" />, value: contractorActiveJobs.length, label: 'Активных', bg: 'bg-indigo-50' },
          { icon: <Star size={18} className="text-amber-500" />, value: contractorEarnings.rating, label: 'Рейтинг', bg: 'bg-amber-50' },
          { icon: <Award size={18} className="text-emerald-500" />, value: contractorEarnings.reviewCount, label: 'Отзывов', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <Card key={i} padding="sm" className="text-center">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              {s.icon}
            </div>
            <p className="text-lg font-black text-text-main leading-none">{s.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5 font-medium">{s.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* Current milestone */}
      {currentMilestone && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-bold text-text-main uppercase tracking-wider">Текущий этап</h2>
            <Badge variant="warning">В работе</Badge>
          </div>
          <Card hoverable onClick={() => navigate('/contractor/jobs')} variant="gradient">
            <p className="text-xs text-text-muted font-medium">{currentJob.title}</p>
            <p className="text-base font-bold text-text-main mt-0.5">{currentMilestone.title}</p>
            <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">📍 {currentJob.address}</p>

            <div className="flex items-center justify-between mt-3">
              <div className="bg-emerald-50 rounded-xl px-3 py-1.5">
                <p className="text-xs font-bold text-emerald-600">{formatMoney(currentMilestone.amount)}</p>
              </div>
              <p className="text-xs text-text-muted">📅 до {new Date(currentMilestone.deadline).toLocaleDateString('ru-RU')}</p>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-[11px] mb-1.5 font-medium">
                <span className="text-text-muted">Прогресс</span>
                <span className="text-emerald-600">{completedMs}/{totalMs} этапов</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedMs / totalMs) * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <ChevronRight size={16} className="text-text-muted" />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Jobs list */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-text-main uppercase tracking-wider">Мои работы</h2>
          <button className="text-xs text-primary font-semibold" onClick={() => navigate('/contractor/jobs')}>Все →</button>
        </div>
        <div className="space-y-2.5">
          {contractorActiveJobs.slice(0, 3).map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card hoverable onClick={() => navigate('/contractor/jobs')}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    job.status === 'completed' ? 'bg-emerald-50' : 'bg-indigo-50'
                  }`}>
                    <span className="text-lg">{job.status === 'completed' ? '✅' : '🔨'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-text-main">{job.title}</p>
                    <p className="text-xs text-text-muted truncate">{job.address}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-600">{formatMoney(job.totalBudget)}</p>
                    <Badge variant={statusVariants[job.status]} size="sm">{statusLabels[job.status]}</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Find orders CTA */}
      <motion.div variants={item}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/contractor/feed')}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm font-bold"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
            border: '1.5px solid rgba(99,102,241,0.2)',
            color: '#6366f1'
          }}
        >
          <Search size={18} />
          Найти новые заказы
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
