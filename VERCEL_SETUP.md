# 🚀 Настройка Vercel для прокси-сервера

## Шаг 1: Деплой на Vercel

1. **Перейдите на [vercel.com](https://vercel.com)** и войдите в аккаунт
2. **Нажмите "New Project"**
3. **Импортируйте ваш GitHub репозиторий** `ai-interview-trainer`
4. **Настройте проект:**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (корень проекта)
   - **Build Command**: (оставьте пустым)
   - **Output Directory**: (оставьте пустым)

## Шаг 2: Настройка Environment Variables

В настройках проекта Vercel добавьте следующие переменные окружения:

### Обязательные переменные:
```
OPENROUTER_API_KEY = ваш_openrouter_ключ
GEMINI_API_KEY = ваш_gemini_ключ  
ELEVENLABS_API_KEY = ваш_elevenlabs_ключ
YANDEX_API_KEY = ваш_yandex_ключ
DEEPGRAM_API_KEY = ваш_deepgram_ключ
```

### Как добавить:
1. В проекте Vercel перейдите в **Settings** → **Environment Variables**
2. Добавьте каждую переменную:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: ваш реальный API ключ
   - **Environment**: Production, Preview, Development (выберите все)
3. Повторите для всех ключей

## Шаг 3: Получение URL

После деплоя Vercel даст вам URL вида: `https://ai-interview-trainer-xxx.vercel.app`

## Шаг 4: Обновление фронтенда

После получения Vercel URL, обновите файл `index.html`:

Найдите функцию `getOptimalProxyUrl()` и замените:
```javascript
// Если это GitHub Pages (продакшн)
if (window.location.hostname.includes('github.io')) {
    // Здесь нужно будет указать ваш Vercel URL после деплоя
    // Пока возвращаем localhost для тестирования
    return 'http://localhost:3000';
}
```

На:
```javascript
// Если это GitHub Pages (продакшн)
if (window.location.hostname.includes('github.io')) {
    return 'https://ваш-vercel-url.vercel.app';
}
```

## Шаг 5: Тестирование

1. **Задеплойте изменения** на GitHub (git push)
2. **Проверьте GitHub Pages** - фронтенд должен автоматически обновиться
3. **Проверьте Vercel** - прокси-сервер должен работать
4. **Протестируйте приложение** - все функции должны работать

## 🔧 Troubleshooting

### Если прокси не работает:
1. Проверьте Environment Variables в Vercel
2. Проверьте логи в Vercel Dashboard
3. Убедитесь, что URL в `getOptimalProxyUrl()` правильный

### Если API ключи не работают:
1. Проверьте GitHub Secrets
2. Проверьте Environment Variables в Vercel
3. Убедитесь, что ключи действительны

## ✅ Готово!

После выполнения всех шагов у вас будет:
- ✅ Фронтенд на GitHub Pages
- ✅ Прокси-сервер на Vercel  
- ✅ Автоматический деплой
- ✅ Безопасное хранение API ключей
