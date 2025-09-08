# 🔑 Управление API ключами - AI Interview Trainer

## 🚨 КРИТИЧЕСКИ ВАЖНО

### ❌ НЕ ДОБАВЛЯЙТЕ API КЛЮЧИ В КОД
- **НЕ коммитьте** реальные API ключи в Git
- **НЕ добавляйте** ключи в `api-keys.js` или `api-keys-public.js`
- **НЕ храните** ключи в файлах проекта
- **НЕ передавайте** ключи через параметры командной строки

### ✅ ПРАВИЛЬНОЕ УПРАВЛЕНИЕ КЛЮЧАМИ
- **GitHub Secrets** - для фронтенда
- **Vercel Environment Variables** - для прокси-сервера
- **Автоматическая подстановка** при деплое

## 🔧 Текущие API

### LLM Провайдеры
- **OpenRouter** - основной LLM (работает в РФ)
- **Google Gemini** - резервный LLM (нужен VPN в РФ)

### Speech-to-Text
- **Deepgram** - основной STT провайдер

### Text-to-Speech
- **ElevenLabs** - основной TTS провайдер
- **Yandex SpeechKit** - резервный TTS провайдер

## 📍 Места хранения ключей

### GitHub Secrets (Фронтенд)
**URL**: https://github.com/aihrtest-create/ai-interview/settings/secrets/actions

#### Текущие секреты:
```
ELEVENLABS_API_KEY = ваш_elevenlabs_ключ
YANDEX_API_KEY = ваш_yandex_ключ
OPENROUTER_API_KEY = ваш_openrouter_ключ
GEMINI_API_KEY = ваш_gemini_ключ
DEEPGRAM_API_KEY = ваш_deepgram_ключ
```

### Vercel Environment Variables (Прокси)
**URL**: https://vercel.com/dashboard → ai-interview-mu-nine → Settings → Environment Variables

#### Текущие переменные:
```
OPENROUTER_API_KEY = ваш_openrouter_ключ
GEMINI_API_KEY = ваш_gemini_ключ
ELEVENLABS_API_KEY = ваш_elevenlabs_ключ
YANDEX_API_KEY = ваш_yandex_ключ
DEEPGRAM_API_KEY = ваш_deepgram_ключ
```

## 🆕 Добавление нового API

### Шаг 1: Добавьте ключ в GitHub Secrets
1. Идите в https://github.com/aihrtest-create/ai-interview/settings/secrets/actions
2. Нажмите "New repository secret"
3. **Name**: `НОВЫЙ_API_KEY` (например, `ANTHROPIC_API_KEY`)
4. **Value**: ваш API ключ
5. Нажмите "Add secret"

### Шаг 2: Добавьте ключ в Vercel Environment Variables
1. Идите в https://vercel.com/dashboard
2. Выберите проект `ai-interview-mu-nine`
3. Settings → Environment Variables
4. Нажмите "Add New"
5. **Name**: `НОВЫЙ_API_KEY`
6. **Value**: ваш API ключ
7. **Environments**: Production, Preview, Development
8. Нажмите "Save"

### Шаг 3: Обновите код для поддержки нового API

#### Обновите `api-keys-public.js`:
```javascript
// Новый API Key (заполняется автоматически при деплое)
window.API_KEYS = window.API_KEYS || {};
window.API_KEYS.newApi = '{{NEW_API_KEY}}';
```

#### Обновите `.github/workflows/deploy.yml`:
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

#### Обновите `proxy-server/server.js`:
```javascript
// Добавьте поддержку нового API в прокси-сервер
app.post('/api/new-api', async (req, res) => {
    try {
        const apiKey = process.env.NEW_API_KEY;
        // Логика нового API
    } catch (error) {
        console.error('New API error:', error);
        res.status(500).json({ error: 'New API error' });
    }
});
```

#### Обновите `index.html`:
```javascript
// Добавьте функцию для вызова нового API
async function callNewAPI(data) {
    const apiKey = localStorage.getItem('newApiKey') || (window.API_KEYS ? window.API_KEYS.newApi : '');
    
    if (!apiKey) {
        throw new Error('New API key not provided');
    }
    
    // Логика вызова нового API
}
```

### Шаг 4: Протестируйте
1. Сделайте коммит и пуш:
```bash
git add .
git commit -m "✨ Добавлена поддержка нового API"
git push origin main
```

2. Дождитесь деплоя (2-3 минуты)
3. Проверьте на https://aihrtest-create.github.io/ai-interview/

## 🔄 Процесс обновления ключей

### Если нужно обновить существующий ключ:
1. **GitHub Secrets**: Обновите значение в веб-интерфейсе
2. **Vercel Environment Variables**: Обновите значение в Vercel Dashboard
3. **Автоматический деплой**: Ключи обновятся при следующем деплое

### Если нужно удалить ключ:
1. **GitHub Secrets**: Удалите секрет в веб-интерфейсе
2. **Vercel Environment Variables**: Удалите переменную в Vercel Dashboard
3. **Обновите код**: Удалите ссылки на ключ из кода
4. **Сделайте коммит**: Изменения применятся при деплое

## 🛡️ Безопасность

### Лучшие практики:
- **Регулярно ротируйте** API ключи
- **Используйте разные ключи** для разных окружений
- **Мониторьте использование** ключей
- **Немедленно отзывайте** скомпрометированные ключи

### Что НЕ делать:
- ❌ Не коммитьте ключи в Git
- ❌ Не передавайте ключи через URL
- ❌ Не логируйте ключи в консоль
- ❌ Не храните ключи в localStorage

## 🔍 Отладка проблем с API

### Если API не работает:
1. **Проверьте ключи** в GitHub Secrets и Vercel
2. **Проверьте логи** в GitHub Actions и Vercel Dashboard
3. **Проверьте консоль браузера** на ошибки
4. **Проверьте статус API** провайдера

### Частые проблемы:
- **CORS ошибки** - используйте прокси-сервер
- **401 Unauthorized** - проверьте API ключ
- **403 Forbidden** - проверьте права доступа
- **429 Too Many Requests** - превышен лимит запросов

## 📊 Мониторинг использования

### GitHub Actions
- **Логи деплоя**: https://github.com/aihrtest-create/ai-interview/actions
- **Статус**: Успешный/Неудачный деплой

### Vercel Dashboard
- **Логи прокси**: https://vercel.com/dashboard
- **Метрики**: Запросы, ошибки, производительность

### API провайдеры
- **OpenRouter**: https://openrouter.ai/usage
- **ElevenLabs**: https://elevenlabs.io/app/speech-synthesis
- **Deepgram**: https://console.deepgram.com/
- **Yandex**: https://console.cloud.yandex.ru/

---

**📅 Последнее обновление**: 8 сентября 2025  
**👤 Автор**: AI Assistant + Dima  
**🔄 Версия**: 2.0
