import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, MapPin, CheckCircle2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { formatMoney } from '../../mock/data';
import { useData } from '../../store/DataContext';

interface MilestoneInput {
  id: string;
  title: string;
  amount: string;
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const { createOrder } = useData();
  const [step, setStep] = useState(1);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { id: '1', title: 'Черновые работы', amount: '' },
    { id: '2', title: 'Чистовая отделка', amount: '' }
  ]);

  const totalAmount = milestones.reduce((sum, m) => sum + (parseInt(m.amount.replace(/\D/g, '') || '0')), 0);

  const addMilestone = () => {
    setMilestones([...milestones, { id: Math.random().toString(), title: '', amount: '' }]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const updateMilestone = (id: string, field: keyof MilestoneInput, value: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePublish = async () => {
    // Mock API call
    createOrder({
      title,
      description,
      address,
      totalBudget: totalAmount,
      milestones: milestones.map((m, i) => ({
        id: `ms-${Date.now()}-${i}`,
        orderId: '', // Will be set by backend
        title: m.title,
        description: '',
        sortOrder: i + 1,
        amount: parseInt(m.amount.replace(/\D/g, '') || '0'),
        status: 'pending',
        deadline: new Date(Date.now() + 86400000 * 7).toISOString() // +7 days mock
      }))
    });
    navigate('/customer/orders');
  };

  return (
    <div className="h-screen flex flex-col bg-background safe-area-pt safe-area-pb">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/customer')}
          className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={20} className="text-text-main" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-text-main">Новый заказ</h1>
        </div>
        <div className="text-sm font-medium text-text-muted">
          Шаг {step} из 4
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-6">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: `${((step - 1) / 4) * 100}%` }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic info */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-text-main mb-2">Что нужно сделать?</h2>
              <p className="text-sm text-text-muted mb-6">Опишите задачу максимально подробно, чтобы получить точные отклики.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-muted mb-1.5 block">Название заказа</label>
                  <Input 
                    placeholder="Например: Ремонт ванной под ключ" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted mb-1.5 block">Подробное описание</label>
                  <textarea 
                    className="w-full bg-secondary border-2 border-transparent focus:border-primary rounded-2xl px-4 py-3 outline-none text-base text-text-main placeholder:text-text-muted/50 transition-all min-h-[120px] resize-none"
                    placeholder="Опишите объем работ, материалы, особые требования..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-text-main mb-2">Где находится объект?</h2>
              <p className="text-sm text-text-muted mb-6">Укажите точный адрес для исполнителей.</p>
              
              <div className="space-y-4">
                <Input 
                  icon={<MapPin size={18} />}
                  placeholder="Город, улица, дом..." 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  autoFocus
                />
                
                {/* Mock Map */}
                <div className="w-full h-48 bg-blue-50 rounded-2xl border-2 border-blue-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                  <div className="z-10 flex flex-col items-center">
                    <MapPin size={32} className="text-primary mb-2 drop-shadow-md" />
                    <p className="text-sm font-medium text-primary">Карта появится позже</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Milestones */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-bold text-text-main mb-2">Разбейте работу на этапы</h2>
              <p className="text-sm text-text-muted mb-6">Оплата будет переводиться исполнителю только после принятия каждого этапа.</p>
              
              <div className="space-y-3 mb-6">
                <AnimatePresence>
                  {milestones.map((m, index) => (
                    <motion.div 
                      key={m.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2"
                    >
                      <div className="flex-1 space-y-2">
                        <Input 
                          placeholder={`Этап ${index + 1}`} 
                          value={m.title} 
                          onChange={e => updateMilestone(m.id, 'title', e.target.value)} 
                        />
                        <div className="relative">
                          <Input 
                            type="number"
                            placeholder="Сумма (₸)" 
                            value={m.amount} 
                            onChange={e => updateMilestone(m.id, 'amount', e.target.value)} 
                            className="pr-10"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">₸</span>
                        </div>
                      </div>
                      {milestones.length > 1 && (
                        <button 
                          onClick={() => removeMilestone(m.id)}
                          className="w-12 flex items-center justify-center rounded-2xl bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button 
                onClick={addMilestone}
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-semibold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Добавить этап
              </button>
            </motion.div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-success" />
              </div>
              <h2 className="text-2xl font-bold text-text-main mb-2">Всё готово</h2>
              <p className="text-sm text-text-muted mb-6">Проверьте данные перед публикацией заказа.</p>
              
              <Card padding="md" className="mb-6">
                <h3 className="font-bold text-lg mb-1">{title || 'Без названия'}</h3>
                <p className="text-sm text-text-muted mb-4">{address || 'Адрес не указан'}</p>
                
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Количество этапов:</span>
                    <span className="font-semibold">{milestones.length}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-text-muted">Общий бюджет:</span>
                    <span className="font-bold text-primary">{formatMoney(totalAmount)}</span>
                  </div>
                </div>
              </Card>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-3">
                <Shield className="text-primary flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">Эскроу-пополнение</p>
                  <p className="text-xs text-text-muted">После публикации вам будет предложено пополнить эскроу-счёт на сумму заказа. Деньги заморозятся до приёмки работ.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom fixed button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 pb-safe">
        <Button 
          fullWidth 
          size="lg" 
          onClick={step === 4 ? handlePublish : handleNext}
          disabled={
            (step === 1 && (!title || !description)) ||
            (step === 2 && !address) ||
            (step === 3 && milestones.some(m => !m.title || !m.amount))
          }
        >
          {step === 4 ? 'Опубликовать заказ' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}
