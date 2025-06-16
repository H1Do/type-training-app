# KeySpark — Touch Typing Trainer / Тренажёр слепой печати

## 🌐 Language / Язык

- [English](#english)
- [Русский](#русский)

---

## English

**KeySpark** is a web application designed to improve touch typing skills through training scenarios, detailed stats, and keyboard layout support.

### 🚀 Key Features

- Practice using built-in and custom training scenarios
- Supports QWERTY and ЙЦУКЕН layouts, dark/light themes, and Russian/English interface
- Detailed statistics by finger and key
- Leaderboards
- Leveling system and experience points
- Lessons for gradual skill development
- Admin panel to manage users and lessons

### 🧱 Tech Stack

- **Frontend**: Vue 3, TypeScript, Pinia, SCSS, i18n
- **Backend**: Express, TypeScript, MongoDB (Mongoose)
- **Testing**: Vitest, @testing-library/vue

### ⚙️ Setup and Run

#### 1. Clone the project

```bash
git clone https://github.com/H1Do/type-training-app.git
```

#### 2. Install dependencies

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

#### 3. Create environment files

##### 📁 server/.env

```env
PORT=                # Server port, e.g.: 5000
NODE_ENV=            # Environment mode: development or production
MONGODB_URL=         # Full MongoDB URI (if used)
MONGODB_USERNAME=    # MongoDB username (if used separately)
MONGODB_PASSWORD=    # MongoDB password
JWT_SECRET=          # Secret for generating access tokens
EMAIL_JWT_SECRET=    # Secret for email confirmation
RESET_JWT_SECRET=    # Secret for password reset
CLIENT_URL=          # Client URL, e.g.: http://localhost:5173
MAIL_HOST=           # SMTP server, e.g.: smtp.yandex.ru
MAIL_PORT=           # SMTP port: 465 or 587
MAIL_USER=           # Sender email
MAIL_PASS=           # Email password or app password
```

##### 📁 client/.env

```env
VITE_API_URL=        # Server URL, e.g.: http://localhost:7000
```

#### 4. Run the app

```bash
# Server
cd server
npm run dev

# Client
cd ../client
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Русский

**KeySpark** — это веб-приложение для тренировки слепой десятипальцевой печати с разными режимами, подробной статистикой и уроками разной сложности.

### 🚀 Основные возможности

- Тренировки по готовым и пользовательским сценариям
- Поддержка QWERTY и ЙЦУКЕН, русского и английского интерфейса, темной и светлой темы
- Подробная статистика по пальцам и клавишам клавиатуры
- Таблицы лидеров
- Система уровней и опыта
- Список уроков для постепенного развития навыков
- Админка для управления уроками и пользователями

### 🧱 Стек технологий

- **Frontend**: Vue 3, TypeScript, Pinia, SCSS, i18n
- **Backend**: Express, TypeScript, MongoDB (Mongoose)
- **Тестирование**: Vitest, @testing-library/vue

### ⚙️ Установка и запуск

#### 1. Клонировать проект

```bash
git clone https://github.com/H1Do/type-training-app.git
```

#### 2. Установка зависимостей

```bash
# Клиент
cd client
npm install

# Сервер
cd ../server
npm install
```

#### 3. Создание переменных окружения

##### 📁 server/.env

```env
PORT=                # Порт сервера, например: 5000
NODE_ENV=            # Режим окружения: development или production
MONGODB_URL=         # Полный URI MongoDB (если используется)
MONGODB_USERNAME=    # Имя пользователя MongoDB (если используется отдельно)
MONGODB_PASSWORD=    # Пароль MongoDB
JWT_SECRET=          # Секрет для генерации access-токенов
EMAIL_JWT_SECRET=    # Секрет для email-подтверждения
RESET_JWT_SECRET=    # Секрет для восстановления пароля
CLIENT_URL=          # URL клиента, например: http://localhost:5173
MAIL_HOST=           # SMTP-сервер, например: smtp.yandex.ru
MAIL_PORT=           # SMTP-порт: 465 или 587
MAIL_USER=           # Email отправителя
MAIL_PASS=           # Пароль от почты или app password
```

##### 📁 client/.env

```env
VITE_API_URL=        # URL сервера, например: http://localhost:7000
```

#### 4. Запуск

```bash
# Сервер
cd server
npm run dev

# Клиент
cd ../client
npm run dev
```

Открой [http://localhost:5173](http://localhost:5173) в браузере.
