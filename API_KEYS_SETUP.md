# 🔑 Настройка API ключей

## Проблема
На сайте не работают API ключи, потому что файл `api-keys-public.js` содержит заглушки.

## Решение

### 1. Откройте файл `api-keys-public.js`

### 2. Замените заглушки на реальные API ключи:

```javascript
window.API_KEYS = {
    // ElevenLabs API Key
    elevenlabs: 'YOUR_ELEVENLABS_API_KEY_HERE',
    
    // Yandex SpeechKit API Key
    yandex: 'YOUR_YANDEX_API_KEY_HERE',
    
    // OpenRouter API Key
    openrouter: 'YOUR_OPENROUTER_API_KEY_HERE',
    
    // OpenAI API Key
    openai: 'YOUR_OPENAI_API_KEY_HERE',
    
    // Gemini API Key
    gemini: 'YOUR_GEMINI_API_KEY_HERE'
};
```

### 3. Отправьте изменения:

```bash
git add api-keys-public.js
git commit -m "Add real API keys"
git push origin main
```

### 4. Дождитесь деплоя:
- Сайт обновится автоматически через GitHub Actions
- Займет 2-3 минуты

## Альтернативный способ

Если не хотите редактировать файл, можете:

1. **Открыть настройки** в приложении
2. **Ввести API ключи** в поля
3. **Сохранить** - ключи сохранятся в браузере

## Проверка

После настройки:
- Кнопки "Начать тренировку" и "Настройки" должны работать
- STT и TTS должны функционировать
- Чат с ИИ должен отвечать

