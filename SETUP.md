# 🚀 Настройка GitHub Pages для AI Interview Trainer

## 📋 Пошаговая инструкция

### 1. Настройка GitHub Pages

1. **Перейдите в настройки репозитория:**
   - Откройте [https://github.com/aihrtest-create/ai-interview](https://github.com/aihrtest-create/ai-interview)
   - Нажмите на вкладку **"Settings"**

2. **Найдите раздел "Pages":**
   - В левом меню найдите **"Pages"**
   - Или перейдите по ссылке: `https://github.com/aihrtest-create/ai-interview/settings/pages`

3. **Настройте источник:**
   - В разделе **"Source"** выберите **"GitHub Actions"**
   - Сохраните настройки

### 2. Настройка API ключей

1. **Создайте файл `api-keys.js`:**
   ```bash
   cp api-keys.example.js api-keys.js
   ```

2. **Заполните API ключи в `api-keys.js`:**
   ```javascript
   window.API_KEYS = {
       elevenlabs: 'YOUR_ELEVENLABS_API_KEY_HERE',
       yandex: 'YOUR_YANDEX_API_KEY_HERE',
       openrouter: 'YOUR_OPENROUTER_API_KEY_HERE',
       openai: 'YOUR_OPENAI_API_KEY_HERE',
       gemini: 'YOUR_GEMINI_API_KEY_HERE'
   };
   ```

3. **Отправьте изменения:**
   ```bash
   git add api-keys.js
   git commit -m "Add API keys"
   git push origin main
   ```

### 3. Проверка деплоя

1. **Проверьте Actions:**
   - Перейдите в [Actions](https://github.com/aihrtest-create/ai-interview/actions)
   - Убедитесь, что workflow запустился

2. **Дождитесь завершения:**
   - Деплой займет 2-3 минуты
   - При успехе появится зеленая галочка

3. **Откройте сайт:**
   - Сайт будет доступен по адресу: `https://aihrtest-create.github.io/ai-interview/`

## 🔧 Локальная разработка

### Запуск локально:

1. **Откройте `index.html` в браузере**
2. **Или запустите локальный сервер:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (если установлен)
   npx serve .
   ```

### Запуск с прокси-сервером:

1. **Установите зависимости:**
   ```bash
   cd proxy-server
   npm install
   ```

2. **Запустите сервер:**
   ```bash
   npm start
   ```

3. **Откройте:** `http://localhost:3000`

## 📁 Структура проекта

```
ai-interview/
├── index.html              # Основное приложение
├── api-keys.js            # API ключи (не в Git)
├── api-keys.example.js    # Шаблон API ключей
├── .gitignore             # Исключения для Git
├── deploy.sh              # Скрипт деплоя (Mac/Linux)
├── deploy.bat             # Скрипт деплоя (Windows)
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions
└── proxy-server/          # Прокси для CORS
    ├── server.js
    └── package.json
```

## 🚨 Важные замечания

- **`api-keys.js` не попадает в Git** - это безопасно
- **API ключи загружаются из файла** при открытии страницы
- **Если файл не найден** - поля останутся пустыми
- **Пользователи могут вводить ключи** в настройках

## 🆘 Решение проблем

### Если деплой не работает:
1. Проверьте Actions в GitHub
2. Убедитесь, что Pages настроен на "GitHub Actions"
3. Проверьте, что файл `api-keys.js` существует

### Если API не работают:
1. Проверьте, что `api-keys.js` заполнен
2. Убедитесь, что файл загружается (F12 → Network)
3. Проверьте правильность API ключей

### Если CORS ошибки:
1. Используйте прокси-сервер локально
2. Или настройте CORS на сервере
