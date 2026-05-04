import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Smartphone } from 'lucide-react';
import Button from '../../components/ui/Button';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    emoji: '🏗',
    title: 'Безопасный ремонт',
    subtitle: 'Эскроу-счета защищают ваши деньги до приёмки каждого этапа работ',
    gradient: 'from-primary to-blue-600',
  },
  {
    emoji: '🔒',
    title: 'Биометрическая подпись',
    subtitle: 'Подтверждайте приёмку работ через Face ID или Touch ID — никаких бумаг',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    emoji: '⚡',
    title: 'Поэтапная оплата',
    subtitle: 'Исполнитель получает деньги только после приёмки каждого этапа',
    gradient: 'from-emerald-500 to-green-600',
  },
];

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="h-screen flex flex-col bg-background safe-area-pt safe-area-pb">
      {/* Skip */}
      <div className="flex justify-end px-6 pt-4">
        <button
          className="text-sm text-text-muted font-medium hover:text-text-main transition-colors"
          onClick={onComplete}
        >
          Пропустить
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center"
          >
            {/* Illustration */}
            <motion.div
              className={`w-32 h-32 rounded-[2rem] bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-8 shadow-2xl`}
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <span className="text-6xl">{slide.emoji}</span>
            </motion.div>

            {/* Text */}
            <h1 className="text-2xl font-bold text-text-main mb-3">{slide.title}</h1>
            <p className="text-base text-text-muted leading-relaxed max-w-sm">{slide.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom */}
      <div className="px-8 pb-8">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-colors duration-300 ${
                i === currentSlide ? 'bg-primary' : 'bg-gray-200'
              }`}
              animate={{ width: i === currentSlide ? 24 : 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          ))}
        </div>

        <Button fullWidth size="lg" icon={<ArrowRight size={20} />} onClick={handleNext}>
          {currentSlide < slides.length - 1 ? 'Далее' : 'Начать'}
        </Button>

        {currentSlide === slides.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted"
          >
            <Shield size={12} />
            <span>Ваши данные защищены шифрованием</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
