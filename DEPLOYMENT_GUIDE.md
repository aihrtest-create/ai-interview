# 🚀 Руководство по деплою - AI Interview Trainer

## 🚨 КРИТИЧЕСКИ ВАЖНО

### ❌ НЕ РАБОТАЙТЕ ЛОКАЛЬНО
- **НЕ запускайте** `python -m http.server` или `npm start`
- **НЕ тестируйте** на localhost:3000 или localhost:8000
- **НЕ создавайте** локальные серверы

### ✅ РАБОТАЙТЕ ТОЛЬКО В ВЕБЕ
- **Все изменения** делаются в коде и деплоятся в веб
- **Тестирование** только на https://aihrtest-create.github.io/ai-interview/
- **Прокси** работает на https://ai-interview-mu-nine.vercel.app

## 🔄 Процесс деплоя

### 1. Внесение изменений
```bash
# Редактируйте файлы в IDE
# НЕ запускайте локальные серверы!

# Проверьте изменения
git status
git diff

# Коммит и деплой
git add .
git commit -m "Описание изменений"
git push origin main
```

### 2. Автоматический деплой
После `git push origin main` запускаются два деплоя:

#### GitHub Pages (Фронтенд)
- **Триггер**: Push в ветку `main`
- **Время**: ~2-3 минуты
- **URL**: https://aihrtest-create.github.io/ai-interview/
- **Логи**: https://github.com/aihrtest-create/ai-interview/actions

#### Vercel (Прокси-сервер)
- **Триггер**: Push в ветку `main`
- **Время**: ~1-2 минуты
- **URL**: https://ai-interview-mu-nine.vercel.app
- **Логи**: https://vercel.com/dashboard

### 3. Проверка деплоя
1. **Дождитесь завершения** деплоя (2-3 минуты)
2. **Откройте** https://aihrtest-create.github.io/ai-interview/
3. **Проверьте функциональность**
4. **НЕ используйте localhost!**

## 📁 Файлы для редактирования

### Основные файлы
- **`index.html`** - основное приложение
- **`css/styles.css`** - стили
- **`proxy-server/server.js`** - прокси-сервер
- **`vercel.json`** - конфигурация Vercel

### Конфигурационные файлы
- **`.github/workflows/deploy.yml`** - GitHub Actions
- **`package.json`** - зависимости проекта
- **`proxy-server/package.json`** - зависимости прокси

### Автогенерируемые файлы (НЕ редактировать)
- **`api-keys-public.js`** - автогенерируется из GitHub Secrets
- **`api/keys.js`** - автогенерируется при деплое

## 🔧 Настройка деплоя

### GitHub Actions (Фронтенд)
**Файл**: `.github/workflows/deploy.yml`

#### Основные этапы:
1. **Checkout** - получение кода
2. **Setup Node.js** - настройка Node.js
3. **Install dependencies** - установка зависимостей
4. **Replace API keys** - подстановка API ключей
5. **Deploy to GitHub Pages** - деплой на GitHub Pages

#### Добавление нового API ключа:
```yaml
- name: Replace API keys
  run: |
    sed -i 's/{{OPENROUTER_API_KEY}}/${{ secrets.OPENROUTER_API_KEY }}/g' api-keys-public.js
    sed -i 's/{{GEMINI_API_KEY}}/${{ secrets.GEMINI_API_KEY }}/g' api-keys-public.js
    sed -i 's/{{ELEVENLABS_API_KEY}}/${{ secrets.ELEVENLABS_API_KEY }}/g' api-keys-public.js
    sed -i 's/{{YANDEX_API_KEY}}/${{ secrets.YANDEX_API_KEY }}/g' api-keys-public.js
    sed -i 's/{{DEEPGRAM_API_KEY}}/${{ secrets.DEEPGRAM_API_KEY }}/g' api-keys-public.js
    sed -i 's/{{NEW_API_KEY}}/${{ secrets.NEW_API_KEY }}/g' api-keys-public.js
```

### Vercel (Прокси-сервер)
**Файл**: `vercel.json`

#### Основные настройки:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "proxy-server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "proxy-server/server.js"
    }
  ]
}
```

#### Environment Variables:
- **OPENROUTER_API_KEY** - OpenRouter API ключ
- **GEMINI_API_KEY** - Gemini API ключ
- **ELEVENLABS_API_KEY** - ElevenLabs API ключ
- **YANDEX_API_KEY** - Yandex API ключ
- **DEEPGRAM_API_KEY** - Deepgram API ключ

## 🔍 Отладка деплоя

### Если деплой не работает:

#### GitHub Actions
1. **Проверьте логи**: https://github.com/aihrtest-create/ai-interview/actions
2. **Проверьте статус**: Успешный/Неудачный
3. **Проверьте ошибки**: Красные сообщения в логах
4. **Проверьте API ключи**: Все ли секреты настроены

#### Vercel
1. **Проверьте логи**: https://vercel.com/dashboard
2. **Проверьте статус**: Успешный/Неудачный
3. **Проверьте ошибки**: Красные сообщения в логах
4. **Проверьте Environment Variables**: Все ли переменные настроены

### Частые проблемы:

#### GitHub Actions
- **API ключи не найдены** - проверьте GitHub Secrets
- **Ошибка подстановки ключей** - проверьте синтаксис sed
- **Ошибка деплоя** - проверьте права доступа

#### Vercel
- **Ошибка сборки** - проверьте `package.json` и зависимости
- **Ошибка запуска** - проверьте `server.js`
- **Ошибка API** - проверьте Environment Variables

## 🚀 Быстрый деплой

### Для небольших изменений:
```bash
# Редактируйте файлы
# Коммит и пуш
git add .
git commit -m "Описание изменений"
git push origin main

# Ждите 2-3 минуты
# Проверьте https://aihrtest-create.github.io/ai-interview/
```

### Для больших изменений:
```bash
# Создайте ветку для тестирования
git checkout -b feature/new-feature

# Внесите изменения
# Протестируйте локально (только для проверки синтаксиса)

# Слейте в main
git checkout main
git merge feature/new-feature
git push origin main

# Удалите ветку
git branch -d feature/new-feature
```

## 📊 Мониторинг деплоя

### GitHub Actions
- **Статус**: https://github.com/aihrtest-create/ai-interview/actions
- **Логи**: Доступны в каждом запуске
- **Уведомления**: На email при ошибках

### Vercel Dashboard
- **Статус**: https://vercel.com/dashboard
- **Логи**: Доступны в каждом деплое
- **Метрики**: Запросы, ошибки, производительность

### Веб-приложение
- **URL**: https://aihrtest-create.github.io/ai-interview/
- **Прокси**: https://ai-interview-mu-nine.vercel.app
- **Тестирование**: Проверяйте функциональность после каждого деплоя

## 🔄 Откат изменений

### Если что-то сломалось:
```bash
# Посмотрите историю коммитов
git log --oneline -5

# Откатитесь к предыдущему коммиту
git reset --hard ПРЕДЫДУЩИЙ_КОММИТ

# Принудительно отправьте изменения
git push --force origin main
```

### ⚠️ Внимание:
- **Force push** перезаписывает историю
- **Используйте осторожно** в команде
- **Лучше создать новый коммит** с исправлениями

---

**📅 Последнее обновление**: 8 сентября 2025  
**👤 Автор**: AI Assistant + Dima  
**🔄 Версия**: 2.0
