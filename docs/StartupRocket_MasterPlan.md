# 🚀 ГарантСтрой MVP — Мастер-план разработки

> Полный пошаговый план от архитектуры до публикации в интернете.

---

## 📐 1. Архитектура системы

```mermaid
graph TD
    subgraph "Клиент (Frontend)"
        A["React + Vite + TypeScript"]
        B["Tailwind CSS"]
        C["React Router"]
        D["WebAuthn API (биометрия)"]
    end

    subgraph "Сервер (Backend)"
        E["Node.js + Express / Fastify"]
        F["REST API / WebSocket"]
        G["JWT Auth + WebAuthn"]
    end

    subgraph "База данных"
        H["PostgreSQL (основная БД)"]
        I["Redis (кэш, сессии, очередь)"]
    end

    subgraph "Хранилище файлов"
        J["S3-совместимое хранилище (фото до/после)"]
    end

    subgraph "Сервисы"
        K["SMS-шлюз (верификация номера)"]
        L["Push-уведомления"]
    end

    A --> F
    F --> H
    F --> I
    F --> J
    F --> K
    F --> L
```

### Принцип: Mobile-first SPA
- Фронтенд — одностраничное приложение (SPA), адаптивное, mobile-first
- Бэкенд — REST API + WebSocket для чата
- В будущем — упаковка в нативное приложение через **Capacitor**

---

## 🗄 2. Структура базы данных (PostgreSQL)

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar phone UK
        varchar full_name
        varchar avatar_url
        enum role "customer | contractor"
        jsonb webauthn_credentials
        timestamp created_at
    }

    ORDERS {
        uuid id PK
        uuid customer_id FK
        uuid contractor_id FK "nullable"
        varchar title
        text description
        enum status "draft | published | in_progress | review | completed | disputed"
        decimal total_budget
        varchar address
        point geo_location
        timestamp created_at
        timestamp updated_at
    }

    MILESTONES {
        uuid id PK
        uuid order_id FK
        varchar title
        text description
        int sort_order
        decimal amount
        enum status "pending | in_progress | review | accepted | disputed"
        timestamp deadline
    }

    MILESTONE_PHOTOS {
        uuid id PK
        uuid milestone_id FK
        varchar photo_url
        enum type "before | after"
        point geo_location
        timestamp uploaded_at
    }

    ESCROW_ACCOUNTS {
        uuid id PK
        uuid order_id FK
        decimal total_amount
        decimal held_amount
        decimal released_amount
        enum status "active | completed | refunded"
    }

    ESCROW_TRANSACTIONS {
        uuid id PK
        uuid escrow_id FK
        uuid milestone_id FK "nullable"
        enum type "deposit | release | refund"
        decimal amount
        timestamp created_at
    }

    BIDS {
        uuid id PK
        uuid order_id FK
        uuid contractor_id FK
        decimal proposed_price
        text message
        enum status "pending | accepted | rejected"
        timestamp created_at
    }

    CHATS {
        uuid id PK
        uuid order_id FK
        uuid customer_id FK
        uuid contractor_id FK
    }

    MESSAGES {
        uuid id PK
        uuid chat_id FK
        uuid sender_id FK
        text content
        varchar attachment_url "nullable"
        boolean is_read
        timestamp created_at
    }

    DISPUTES {
        uuid id PK
        uuid order_id FK
        uuid milestone_id FK
        uuid initiated_by FK
        text reason
        enum status "open | inspector_assigned | resolved"
        text resolution "nullable"
        timestamp created_at
    }

    USERS ||--o{ ORDERS : "creates (customer)"
    USERS ||--o{ ORDERS : "executes (contractor)"
    ORDERS ||--o{ MILESTONES : "has"
    MILESTONES ||--o{ MILESTONE_PHOTOS : "has"
    ORDERS ||--|| ESCROW_ACCOUNTS : "has"
    ESCROW_ACCOUNTS ||--o{ ESCROW_TRANSACTIONS : "has"
    ORDERS ||--o{ BIDS : "receives"
    USERS ||--o{ BIDS : "submits"
    ORDERS ||--|| CHATS : "has"
    CHATS ||--o{ MESSAGES : "contains"
    ORDERS ||--o{ DISPUTES : "may have"
```

---

## 📁 3. Структура проекта (Frontend)

```
Startup-Rocket/
├── public/
├── src/
│   ├── assets/              # Иконки, изображения
│   ├── components/          # Переиспользуемые UI-компоненты
│   │   ├── ui/              # Кнопки, инпуты, карточки, модалки
│   │   ├── BottomNav.tsx
│   │   └── Header.tsx
│   ├── layouts/
│   │   └── MobileLayout.tsx
│   ├── pages/
│   │   ├── auth/            # Онбординг, вход, выбор роли
│   │   ├── customer/        # Экраны заказчика
│   │   ├── contractor/      # Экраны исполнителя
│   │   ├── Dashboard.tsx
│   │   ├── Orders.tsx
│   │   └── Profile.tsx
│   ├── hooks/               # Кастомные React-хуки
│   ├── services/            # API-клиент, WebAuthn-сервис
│   ├── store/               # Глобальное состояние (zustand)
│   ├── types/               # TypeScript типы/интерфейсы
│   ├── utils/               # Вспомогательные функции
│   ├── mock/                # Моковые данные для MVP
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📋 4. Чек-лист разработки (подробный)

### Фаза 1: Фундамент (Этап сейчас ✅ частично)
- [x] Инициализация React + Vite + TypeScript
- [x] Установка зависимостей (Tailwind, Router, Lucide, Framer Motion)
- [x] Настройка дизайн-системы (цвета, шрифты, переменные)
- [x] Базовый роутинг (React Router)
- [x] MobileLayout (Header + BottomNav + Outlet)
- [ ] UI-компоненты: Button, Input, Card, Modal, Badge, Avatar
- [ ] Подключение Google Fonts (Inter)
- [ ] Dockerfile и docker-compose для dev-окружения

### Фаза 2: Авторизация и Онбординг
- [ ] Экран приветствия (Welcome / Splash Screen)
- [ ] Вход по номеру телефона (UI + моковая верификация)
- [ ] Экран выбора роли (Заказчик / Исполнитель)
- [ ] Настройка Face ID / Touch ID (WebAuthn API)
- [ ] Заполнение профиля (имя, фото, данные)
- [ ] Хранение состояния авторизации (zustand + localStorage)

### Фаза 3: Кабинет Заказчика
- [ ] Дашборд: баланс эскроу, активные заказы, уведомления
- [ ] Создание заказа: пошаговая форма
  - [ ] Описание работ
  - [ ] Адрес (с картой)
  - [ ] Разбивка на этапы (milestones) с бюджетом
  - [ ] Предпросмотр и публикация
- [ ] Просмотр откликов исполнителей
- [ ] Выбор исполнителя
- [ ] Эскроу-эмулятор: внесение средств, просмотр транзакций

### Фаза 4: Кабинет Исполнителя
- [ ] Лента доступных заказов (с фильтрами)
- [ ] Карточка заказа (детали, этапы, бюджет)
- [ ] Подача отклика (предложение цены + сообщение)
- [ ] Экран активного заказа
  - [ ] Текущий этап
  - [ ] Загрузка фото "до/после"
  - [ ] Гео-метка (браузерная геолокация)
  - [ ] Кнопка "Этап завершён"

### Фаза 5: Приёмка, Споры и Чат
- [ ] Уведомление заказчику о завершении этапа
- [ ] Сравнение фото "до/после"
- [ ] Приёмка этапа (подтверждение через WebAuthn / Face ID)
- [ ] Автоматическое разблокирование средств из эскроу
- [ ] Чат между заказчиком и исполнителем (WebSocket / мок)
- [ ] Открытие спора
- [ ] Экран Технадзора (просмотр материалов, вынесение решения)

### Фаза 6: Полировка и Тестирование
- [ ] Анимации переходов между страницами (Framer Motion)
- [ ] Pull-to-refresh, скелетоны загрузки
- [ ] Haptic feedback (Vibration API)
- [ ] Адаптивность: Mobile (375px), Tablet (768px), Desktop (1280px)
- [ ] E2E тестирование основного флоу
- [ ] Проверка PWA: Service Worker, manifest.json, оффлайн-режим

### Фаза 7: Бэкенд (когда фронт готов)
- [ ] Настройка Node.js + Express/Fastify
- [ ] Подключение PostgreSQL (Prisma ORM)
- [ ] Миграции базы данных
- [ ] API: авторизация (SMS + JWT)
- [ ] API: CRUD заказов, этапов, откликов
- [ ] API: эскроу-логика
- [ ] API: чат (WebSocket)
- [ ] API: загрузка файлов (S3)
- [ ] API: WebAuthn (серверная часть)

### Фаза 8: Деплой и Публикация
- [ ] Выбор хостинга (см. рекомендации ниже)
- [ ] CI/CD: GitHub Actions (автодеплой)
- [ ] SSL-сертификат (обязателен для WebAuthn)
- [ ] Домен и DNS
- [ ] Мониторинг и логирование

### Фаза 9: Мобильное приложение
- [ ] Интеграция Capacitor
- [ ] Настройка нативных плагинов (камера, геолокация, push)
- [ ] Сборка iOS (Xcode) и Android (Android Studio)
- [ ] Публикация в App Store и Google Play

---

## 🌐 5. Рекомендации по хостингу и инфраструктуре

### Вариант A: Бюджетный старт (MVP) — ~$10-25/мес

| Компонент | Сервис | Стоимость |
|-----------|--------|-----------|
| **Frontend** | Vercel или Cloudflare Pages | Бесплатно |
| **Backend API** | Railway.app или Render.com | ~$5-7/мес |
| **PostgreSQL** | Supabase (бесплатный tier) или Neon.tech | Бесплатно → $5/мес |
| **Redis** | Upstash (бесплатный tier) | Бесплатно |
| **Файлы (S3)** | Cloudflare R2 | ~$0-5/мес |
| **SMS-шлюз** | SMS.ru / SMSC.ru | ~$5-10/мес |
| **Домен** | .ru / .com | ~$10-15/год |

### Вариант B: Продакшн (масштабирование) — ~$50-100/мес

| Компонент | Сервис | Стоимость |
|-----------|--------|-----------|
| **Всё в одном** | VPS (Timeweb Cloud / Selectel) | ~$15-30/мес |
| **PostgreSQL** | Managed DB (Selectel / Yandex Cloud) | ~$15-25/мес |
| **S3 хранилище** | Yandex Object Storage / Selectel S3 | ~$5-10/мес |
| **CDN** | Cloudflare (бесплатно) | Бесплатно |
| **SMS** | SMS.ru | ~$10-20/мес |
| **Мониторинг** | Sentry (бесплатный tier) | Бесплатно |

### Вариант C: Ваш VPS (у вас уже есть — `77.243.80.166`)

> [!TIP]
> У вас уже есть Debian-сервер. Можно использовать его для MVP, развернув всё через Docker Compose — это **самый экономичный** вариант.

| Компонент | Как разворачивать |
|-----------|-------------------|
| Frontend | Nginx (статика) в Docker |
| Backend | Node.js в Docker |
| PostgreSQL | Docker-контейнер |
| Redis | Docker-контейнер |
| Файлы | Локальная папка на VPS |
| SSL | Certbot (Let's Encrypt) — бесплатно |

**Итого: $0/мес** (сверх стоимости VPS, которую вы уже оплачиваете)

---

## ⏱ 6. Ориентировочные сроки

| Фаза | Описание | Срок |
|------|----------|------|
| 1 | Фундамент и UI-компоненты | 2-3 дня |
| 2 | Авторизация и онбординг | 2-3 дня |
| 3 | Кабинет заказчика | 3-4 дня |
| 4 | Кабинет исполнителя | 3-4 дня |
| 5 | Приёмка, споры, чат | 3-4 дня |
| 6 | Полировка | 2-3 дня |
| 7 | Бэкенд | 5-7 дней |
| 8 | Деплой | 1-2 дня |
| **Итого MVP** | | **~3-4 недели** |

> [!IMPORTANT]
> Сроки указаны при совместной работе со мной. Фронтенд с моковыми данными можно получить за ~2 недели, бэкенд подключаем после.

---

## 🧭 7. Стратегия разработки

### Подход: "Frontend-first с моковыми данными"

```mermaid
graph LR
    A["Фаза 1-6: Frontend<br/>Моковые данные"] --> B["Фаза 7: Backend API<br/>Замена моков на реальные вызовы"]
    B --> C["Фаза 8: Деплой<br/>VPS / Cloud"]
    C --> D["Фаза 9: Mobile<br/>Capacitor"]
```

1. **Сначала** делаем весь фронтенд с моковыми данными — можно показать инвестору/заказчику
2. **Потом** пишем бэкенд и подключаем реальные API
3. **Потом** деплоим на ваш VPS
4. **Потом** оборачиваем в мобильное приложение

> [!NOTE]
> Такой подход позволяет **быстро увидеть результат** — работающий интерфейс за 2 недели, который можно тестировать и показывать.

---

## 🔐 8. Безопасность (ключевые решения)

| Аспект | Решение |
|--------|---------|
| Аутентификация | Телефон + SMS OTP → JWT токены |
| Биометрия | WebAuthn API (FIDO2) — работает в Safari/Chrome |
| Подпись приёмки | WebAuthn challenge при подтверждении этапа |
| Защита API | JWT + Rate Limiting + CORS |
| Эскроу | Серверная логика, клиент не может напрямую управлять средствами |
| Файлы | Подписанные URL для загрузки/скачивания |

---

## ✅ Текущий статус

Уже сделано (Фаза 1, частично):
- [x] React + Vite + TypeScript — инициализирован
- [x] Tailwind CSS + дизайн-система — настроена
- [x] React Router — настроен
- [x] MobileLayout + BottomNav + Header — созданы (в процессе)

**Следующий шаг:** Завершить Фазу 1 — UI-компоненты и Dockerfile.

---

*Создан: 2026-05-05 | Проект: ГарантСтрой MVP v1.0*
