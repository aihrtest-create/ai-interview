# 📋 Правила работы с проектом AI Interview Trainer

## 🚨 КРИТИЧЕСКИ ВАЖНО

### ❌ НЕ ДЕЛАЙТЕ ЛОКАЛЬНО
- **НЕ запускайте** `python -m http.server` или `npm start`
- **НЕ тестируйте** на localhost:3000 или localhost:8000
- **НЕ создавайте** локальные серверы для разработки

### ✅ РАБОТАЙТЕ ТОЛЬКО В ВЕБЕ
- **Все изменения** делаются в коде и деплоятся в веб
- **Тестирование** только на https://aihrtest-create.github.io/ai-interview/
- **Прокси** работает на https://ai-interview-mu-nine.vercel.app

## 🔄 Процесс разработки

### 1. Внесение изменений
```bash
# Редактируйте файлы в IDE
# НЕ запускайте локальные серверы!

# Коммит и деплой
git add .
git commit -m "Описание изменений"
git push origin main
```

### 2. Автоматический деплой
- **GitHub Actions** автоматически деплоит фронтенд
- **Vercel** автоматически деплоит прокси-сервер
- **Время деплоя**: 2-3 минуты

### 3. Тестирование
- Откройте https://aihrtest-create.github.io/ai-interview/
- Проверьте функциональность
- НЕ используйте localhost!

## 🔑 Управление API ключами

### ❌ НЕ ДОБАВЛЯЙТЕ КЛЮЧИ В КОД
- **НЕ коммитьте** реальные API ключи
- **НЕ добавляйте** ключи в `api-keys.js` или `api-keys-public.js`
- **НЕ храните** ключи в файлах проекта

### ✅ ПРАВИЛЬНОЕ УПРАВЛЕНИЕ КЛЮЧАМИ

#### GitHub Secrets (для фронтенда)
1. Идите в https://github.com/aihrtest-create/ai-interview/settings/secrets/actions
2. Добавьте новый секрет:
   - **Name**: `НОВЫЙ_API_KEY` (например, `ANTHROPIC_API_KEY`)
   - **Value**: ваш API ключ
3. Обновите `.github/workflows/deploy.yml` для использования нового ключа

#### Vercel Environment Variables (для прокси)
1. Идите в https://vercel.com/dashboard
2. Выберите проект `ai-interview-mu-nine`
3. Settings → Environment Variables
4. Добавьте новую переменную:
   - **Name**: `НОВЫЙ_API_KEY`
   - **Value**: ваш API ключ
   - **Environments**: Production, Preview, Development

#### Обновление кода для нового API
1. Добавьте новый API в `api-keys-public.js`:
```javascript
// Новый API Key (заполняется автоматически при деплое)
window.API_KEYS = window.API_KEYS || {};
window.API_KEYS.newApi = '{{NEW_API_KEY}}';
```

2. Обновите `.github/workflows/deploy.yml`:
```yaml
- name: Replace API keys
  run: |
    sed -i 's/{{NEW_API_KEY}}/${{ secrets.NEW_API_KEY }}/g' api-keys-public.js
```

3. Обновите `proxy-server/server.js` для поддержки нового API

## 🛠️ Технические правила

### Файлы для редактирования
- **Основное приложение**: `index.html`
- **Стили**: `css/styles.css`
- **Прокси-сервер**: `proxy-server/server.js`
- **Конфигурация Vercel**: `vercel.json`
- **GitHub Actions**: `.github/workflows/deploy.yml`

### Файлы НЕ для редактирования
- **API ключи**: `api-keys-public.js` (автогенерируется)
- **GitHub Secrets**: управляются через веб-интерфейс
- **Vercel Environment Variables**: управляются через Vercel Dashboard

### Структура коммитов
```bash
# Хорошие примеры:
git commit -m "✨ Добавлена поддержка нового API"
git commit -m "🐛 Исправлена ошибка генерации отчетов"
git commit -m "🎨 Улучшен дизайн интерфейса"

# Плохие примеры:
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

## 🔍 Отладка проблем

### Если что-то не работает
1. **Проверьте веб-версию**: https://aihrtest-create.github.io/ai-interview/
2. **Проверьте консоль браузера**: F12 → Console
3. **Проверьте статус деплоя**: https://github.com/aihrtest-create/ai-interview/actions
4. **Проверьте логи Vercel**: https://vercel.com/dashboard

### НЕ делайте
- ❌ Не запускайте локальные серверы
- ❌ Не тестируйте на localhost
- ❌ Не добавляйте API ключи в код
- ❌ Не делайте force push без необходимости

### Делайте
- ✅ Тестируйте только на веб-версии
- ✅ Используйте GitHub Secrets для API ключей
- ✅ Проверяйте статус деплоя
- ✅ Делайте понятные коммиты

## 📞 Контакты и ресурсы

### Полезные ссылки
- **GitHub репозиторий**: https://github.com/aihrtest-create/ai-interview
- **GitHub Pages**: https://aihrtest-create.github.io/ai-interview/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: https://github.com/aihrtest-create/ai-interview/actions

### Документация
- **ARCHITECTURE.md** - архитектура проекта
- **API_MANAGEMENT.md** - управление API ключами
- **DEPLOYMENT_GUIDE.md** - руководство по деплою
- **QUICK_START.md** - быстрый старт для новых чатов

---

**📅 Последнее обновление**: 8 сентября 2025  
**👤 Автор**: AI Assistant + Dima  
**🔄 Версия**: 2.0
