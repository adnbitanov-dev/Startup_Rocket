import type { Order, Bid, EscrowAccount, EscrowTransaction } from '../types';

// ============== ЗАКАЗЧИК (Customer) ==============

export const customerOrders: Order[] = [
  {
    id: 'ord-1',
    customerId: 'u1',
    contractorId: 'u2',
    title: 'Ремонт ванной комнаты',
    description: 'Полный ремонт ванной комнаты: замена плитки, сантехники, потолка.',
    status: 'in_progress',
    totalBudget: 850000,
    address: 'ул. Абая 15, кв. 42',
    createdAt: '2026-04-20T10:00:00Z',
    milestones: [
      { id: 'ms-1', orderId: 'ord-1', title: 'Демонтаж', description: 'Демонтаж старой плитки', sortOrder: 1, amount: 120000, status: 'accepted', deadline: '2026-04-28T00:00:00Z' },
      { id: 'ms-2', orderId: 'ord-1', title: 'Сантехника', description: 'Замена труб, смесители', sortOrder: 2, amount: 280000, status: 'in_progress', deadline: '2026-05-10T00:00:00Z' },
      { id: 'ms-3', orderId: 'ord-1', title: 'Облицовка плиткой', description: 'Укладка плитки на стены и пол', sortOrder: 3, amount: 300000, status: 'pending', deadline: '2026-05-20T00:00:00Z' },
      { id: 'ms-4', orderId: 'ord-1', title: 'Чистовая отделка', description: 'Зеркала, полки, уборка', sortOrder: 4, amount: 150000, status: 'pending', deadline: '2026-05-28T00:00:00Z' },
    ],
  },
  {
    id: 'ord-2',
    customerId: 'u1',
    contractorId: null,
    title: 'Покраска стен в гостиной',
    description: 'Покраска стен в два слоя, подготовка поверхности, грунтовка.',
    status: 'published',
    totalBudget: 180000,
    address: 'пр. Республики 7, кв. 15',
    createdAt: '2026-05-01T14:00:00Z',
    milestones: [
      { id: 'ms-5', orderId: 'ord-2', title: 'Подготовка стен', description: 'Шпатлёвка, грунтовка', sortOrder: 1, amount: 60000, status: 'pending', deadline: '2026-05-12T00:00:00Z' },
      { id: 'ms-6', orderId: 'ord-2', title: 'Покраска', description: 'Покраска в 2 слоя', sortOrder: 2, amount: 120000, status: 'pending', deadline: '2026-05-18T00:00:00Z' },
    ],
  },
  {
    id: 'ord-3',
    customerId: 'u1',
    contractorId: 'u3',
    title: 'Установка кондиционера',
    description: 'Установка сплит-системы в спальню.',
    status: 'completed',
    totalBudget: 95000,
    address: 'ул. Абая 15, кв. 42',
    createdAt: '2026-03-15T09:00:00Z',
    milestones: [
      { id: 'ms-7', orderId: 'ord-3', title: 'Монтаж', description: 'Установка блоков', sortOrder: 1, amount: 95000, status: 'accepted', deadline: '2026-03-20T00:00:00Z' },
    ],
  },
];

// Отклики на заказ заказчика
export const bidsOnCustomerOrders: Bid[] = [
  { id: 'bid-1', orderId: 'ord-2', contractorId: 'u2', contractorName: 'Сергей Мастеров', contractorAvatar: '', proposedPrice: 175000, message: 'Готов приступить на этой неделе. Опыт 8 лет.', status: 'pending', createdAt: '2026-05-02T09:00:00Z' },
  { id: 'bid-2', orderId: 'ord-2', contractorId: 'u4', contractorName: 'Дмитрий К.', contractorAvatar: '', proposedPrice: 195000, message: 'Используем премиальные краски Dulux. Гарантия 3 года.', status: 'pending', createdAt: '2026-05-02T12:30:00Z' },
];

export const customerEscrow: EscrowAccount = {
  id: 'esc-1',
  orderId: 'ord-1',
  totalAmount: 850000,
  heldAmount: 730000,
  releasedAmount: 120000,
};

export const customerTransactions: EscrowTransaction[] = [
  { id: 'tx-1', escrowId: 'esc-1', type: 'deposit', amount: 850000, description: 'Внесение средств на эскроу', createdAt: '2026-04-20T10:30:00Z' },
  { id: 'tx-2', escrowId: 'esc-1', type: 'release', amount: 120000, description: 'Оплата: Демонтаж (этап 1)', createdAt: '2026-04-29T16:00:00Z' },
];


// ============== ИСПОЛНИТЕЛЬ (Contractor) ==============

// Заказы, на которые исполнитель подал отклик / работает
export const contractorActiveJobs: Order[] = [
  {
    id: 'ord-1',
    customerId: 'u1',
    contractorId: 'u-me',
    title: 'Ремонт ванной комнаты',
    description: 'Полный ремонт ванной комнаты: замена плитки, сантехники, потолка.',
    status: 'in_progress',
    totalBudget: 850000,
    address: 'ул. Абая 15, кв. 42',
    createdAt: '2026-04-20T10:00:00Z',
    milestones: [
      { id: 'ms-1', orderId: 'ord-1', title: 'Демонтаж', description: 'Демонтаж старой плитки', sortOrder: 1, amount: 120000, status: 'accepted', deadline: '2026-04-28T00:00:00Z' },
      { id: 'ms-2', orderId: 'ord-1', title: 'Сантехника', description: 'Замена труб, смесители', sortOrder: 2, amount: 280000, status: 'in_progress', deadline: '2026-05-10T00:00:00Z' },
      { id: 'ms-3', orderId: 'ord-1', title: 'Облицовка плиткой', description: 'Укладка плитки', sortOrder: 3, amount: 300000, status: 'pending', deadline: '2026-05-20T00:00:00Z' },
      { id: 'ms-4', orderId: 'ord-1', title: 'Чистовая отделка', description: 'Зеркала, полки, уборка', sortOrder: 4, amount: 150000, status: 'pending', deadline: '2026-05-28T00:00:00Z' },
    ],
  },
];

// Лента доступных заказов (от других заказчиков)
export const availableOrders: Order[] = [
  {
    id: 'ord-10',
    customerId: 'u5',
    contractorId: null,
    title: 'Укладка ламината 45 м²',
    description: 'Укладка ламината в 3 комнатах. Подложка включена. Нужен свой инструмент.',
    status: 'published',
    totalBudget: 320000,
    address: 'ул. Сатпаева 22, кв. 8',
    createdAt: '2026-05-03T08:00:00Z',
    milestones: [
      { id: 'ms-10', orderId: 'ord-10', title: 'Подготовка пола', description: 'Выравнивание, подложка', sortOrder: 1, amount: 80000, status: 'pending', deadline: '2026-05-15T00:00:00Z' },
      { id: 'ms-11', orderId: 'ord-10', title: 'Укладка ламината', description: 'Укладка во всех комнатах', sortOrder: 2, amount: 200000, status: 'pending', deadline: '2026-05-22T00:00:00Z' },
      { id: 'ms-12', orderId: 'ord-10', title: 'Плинтуса и пороги', description: 'Установка плинтусов', sortOrder: 3, amount: 40000, status: 'pending', deadline: '2026-05-25T00:00:00Z' },
    ],
  },
  {
    id: 'ord-11',
    customerId: 'u6',
    contractorId: null,
    title: 'Электромонтаж в новостройке',
    description: 'Полная разводка электрики: 12 точек, щиток, автоматы. Квартира 65 м².',
    status: 'published',
    totalBudget: 450000,
    address: 'мкр. Самал-2, д. 7, кв. 101',
    createdAt: '2026-05-04T11:00:00Z',
    milestones: [
      { id: 'ms-13', orderId: 'ord-11', title: 'Штробление', description: 'Штробы под проводку', sortOrder: 1, amount: 150000, status: 'pending', deadline: '2026-05-18T00:00:00Z' },
      { id: 'ms-14', orderId: 'ord-11', title: 'Прокладка кабеля', description: 'Монтаж проводки', sortOrder: 2, amount: 200000, status: 'pending', deadline: '2026-05-25T00:00:00Z' },
      { id: 'ms-15', orderId: 'ord-11', title: 'Щиток и подключение', description: 'Сборка щитка, автоматы', sortOrder: 3, amount: 100000, status: 'pending', deadline: '2026-05-30T00:00:00Z' },
    ],
  },
  {
    id: 'ord-12',
    customerId: 'u7',
    contractorId: null,
    title: 'Поклейка обоев в спальне',
    description: 'Поклейка виниловых обоев, потолочный плинтус. Комната 18 м².',
    status: 'published',
    totalBudget: 85000,
    address: 'ул. Тимирязева 42, кв. 3',
    createdAt: '2026-05-04T15:30:00Z',
    milestones: [
      { id: 'ms-16', orderId: 'ord-12', title: 'Подготовка стен', description: 'Грунтовка, выравнивание', sortOrder: 1, amount: 25000, status: 'pending', deadline: '2026-05-14T00:00:00Z' },
      { id: 'ms-17', orderId: 'ord-12', title: 'Поклейка обоев', description: 'Поклейка + плинтус', sortOrder: 2, amount: 60000, status: 'pending', deadline: '2026-05-17T00:00:00Z' },
    ],
  },
];

// Мои отклики (как исполнитель)
export const myBids: Bid[] = [
  { id: 'bid-10', orderId: 'ord-10', contractorId: 'u-me', contractorName: 'Я', contractorAvatar: '', proposedPrice: 310000, message: 'Опыт укладки ламината 5 лет. Свой инструмент.', status: 'pending', createdAt: '2026-05-03T12:00:00Z' },
];

// Баланс исполнителя
export const contractorEarnings = {
  totalEarned: 120000,
  pendingPayment: 280000,
  completedJobs: 1,
  activeJobs: 1,
  rating: 4.8,
  reviewCount: 12,
};


// ============== ОБЩИЕ УТИЛИТЫ ==============

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'decimal', maximumFractionDigits: 0 }).format(amount) + ' ₸';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'только что';
  if (hours < 24) return `${hours}ч назад`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'вчера';
  return `${days}д назад`;
}

export const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  published: 'Опубликован',
  in_progress: 'В работе',
  review: 'На проверке',
  completed: 'Завершён',
  disputed: 'Спор',
  pending: 'Ожидает',
  accepted: 'Принят',
};

export const statusVariants: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  draft: 'neutral',
  published: 'primary',
  in_progress: 'warning',
  review: 'primary',
  completed: 'success',
  disputed: 'danger',
  pending: 'neutral',
  accepted: 'success',
};
