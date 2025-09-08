# 🏗️ Архитектура проекта AI Interview Trainer

## 📋 Обзор системы

AI Interview Trainer - это веб-приложение для подготовки к собеседованиям с поддержкой голосового ввода, озвучки ответов ИИ и генерации отчетов.

## 🌐 Архитектура деплоя

### Фронтенд (GitHub Pages)
- **URL**: https://aihrtest-create.github.io/ai-interview/
- **Репозиторий**: https://github.com/aihrtest-create/ai-interview
- **Автодеплой**: GitHub Actions при каждом `git push` в ветку `main`
- **Файлы**: `index.html`, `css/styles.css`, `api-keys-public.js`

### Прокси-сервер (Vercel)
- **URL**: https://ai-interview-mu-nine.vercel.app
- **Назначение**: Обход CORS, прокси для API
- **Автодеплой**: Vercel при каждом `git push` в ветку `main`
- **Файлы**: `proxy-server/server.js`, `vercel.json`

## 🔧 Технический стек

### Фронтенд
- **HTML5** - структура приложения
- **CSS3** - стили и анимации
- **JavaScript (ES6+)** - логика приложения
- **Web APIs** - Speech Recognition, MediaRecorder, Web Audio

### Прокси-сервер
- **Node.js** - серверная платформа
- **Express.js** - веб-фреймворк
- **CORS** - обход ограничений браузера
- **Multer** - обработка файлов

### API интеграции
- **OpenRouter** - LLM провайдер (GPT-4, Claude, Gemini)
- **Google Gemini** - альтернативный LLM
- **Deepgram** - Speech-to-Text
- **ElevenLabs** - Text-to-Speech
- **Yandex SpeechKit** - альтернативный TTS

## 📁 Структура проекта

```
ai-interview-trainer/
├── 📄 index.html              # Основное приложение
├── 🎨 css/styles.css          # Стили
├── 🔑 api-keys-public.js      # Публичные API ключи (автозаполнение)
├── 🔧 vercel.json            # Конфигурация Vercel
├── 📦 package.json           # Зависимости проекта
├── 📖 README.md              # Документация
├── 📁 .github/workflows/     # GitHub Actions
│   └── deploy.yml            # Автодеплой на GitHub Pages
├── 📁 proxy-server/          # Node.js прокси-сервер
│   ├── server.js             # Основной сервер
│   ├── package.json          # Зависимости сервера
│   └── README.md             # Инструкция по запуску
└── 📁 api/                   # API ключи (GitHub Secrets)
    └── keys.js               # Автогенерируемые ключи
```

## 🔄 Поток данных

### 1. Пользователь открывает приложение
```
Пользователь → GitHub Pages → index.html
```

### 2. Настройка API ключей
```
GitHub Secrets → GitHub Actions → api-keys-public.js → Браузер
```

### 3. Голосовой ввод
```
Микрофон → MediaRecorder → Прокси-сервер → Deepgram API → Текст
```

### 4. Генерация ответа ИИ
```
Текст → Прокси-сервер → OpenRouter/Gemini API → Ответ ИИ
```

### 5. Озвучка ответа
```
Ответ ИИ → Прокси-сервер → ElevenLabs/Yandex API → Аудио
```

## 🚀 Процесс деплоя

### GitHub Pages (Фронтенд)
1. `git push` в ветку `main`
2. GitHub Actions запускается автоматически
3. API ключи подставляются из GitHub Secrets
4. Сайт обновляется на https://aihrtest-create.github.io/ai-interview/

### Vercel (Прокси)
1. `git push` в ветку `main`
2. Vercel автоматически деплоит прокси-сервер
3. Environment Variables подставляются из Vercel Dashboard
4. Прокси обновляется на https://ai-interview-mu-nine.vercel.app

## 🔐 Безопасность

### API ключи
- **НЕ хранятся в коде** - только в GitHub Secrets и Vercel Environment Variables
- **Автоматическая подстановка** при деплое
- **Разделение окружений** - разные ключи для разных сред

### CORS
- **Прокси-сервер** решает проблемы с CORS
- **Безопасные запросы** через HTTPS
- **Контролируемый доступ** к API

## 🌍 Ограничения по регионам

### Блокировки в РФ
- **Gemini API** - заблокирован, нужен VPN
- **OpenRouter API** - работает без VPN
- **STT/TTS** - работают через прокси

### Рекомендации
- **Основной провайдер**: OpenRouter (работает в РФ)
- **Резервный**: Gemini (только с VPN)
- **STT/TTS**: Всегда через прокси-сервер

## 📊 Мониторинг

### GitHub Actions
- **Статус деплоя**: https://github.com/aihrtest-create/ai-interview/actions
- **Логи**: Доступны в GitHub Actions

### Vercel Dashboard
- **Статус прокси**: https://vercel.com/dashboard
- **Логи**: Доступны в Vercel Dashboard

---

**📅 Последнее обновление**: 8 сентября 2025  
**👤 Автор**: AI Assistant + Dima  
**🔄 Версия**: 2.0
