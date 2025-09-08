# 🔐 Environment Variables для Vercel

## 📋 Список переменных для добавления в Vercel:

### 1. OpenRouter API Key
- **Name**: `OPENROUTER_API_KEY`
- **Value**: `ваш_openrouter_ключ`
- **Environment**: Production, Preview, Development

### 2. Gemini API Key
- **Name**: `GEMINI_API_KEY`
- **Value**: `ваш_gemini_ключ`
- **Environment**: Production, Preview, Development

### 3. ElevenLabs API Key
- **Name**: `ELEVENLABS_API_KEY`
- **Value**: `ваш_elevenlabs_ключ`
- **Environment**: Production, Preview, Development

### 4. Yandex SpeechKit API Key
- **Name**: `YANDEX_API_KEY`
- **Value**: `ваш_yandex_ключ`
- **Environment**: Production, Preview, Development

### 5. Deepgram API Key
- **Name**: `DEEPGRAM_API_KEY`
- **Value**: `ваш_deepgram_ключ`
- **Environment**: Production, Preview, Development

### 6. Speechify API Key
- **Name**: `SPEECHIFY_API_KEY`
- **Value**: `ваш_speechify_ключ`
- **Environment**: Production, Preview, Development

## 🚀 Как добавить в Vercel:

1. **Откройте ваш проект в Vercel**
2. **Перейдите в Settings → Environment Variables**
3. **Нажмите "Add New"**
4. **Для каждой переменной:**
   - Вставьте **Name** из списка выше
   - Вставьте **Value** из списка выше
   - Выберите **Production, Preview, Development**
   - Нажмите **Save**
5. **Повторите для всех 6 переменных**
6. **Передеплойте проект** (Redeploy)

## ✅ Проверка:

После добавления всех переменных и передеплоя:
- Прокси-сервер должен работать
- STT (голосовой ввод) должен работать
- TTS (озвучка) должна работать
- Все API вызовы должны проходить через Vercel

## 🔗 Следующий шаг:

После получения Vercel URL, дайте мне знать - я обновлю код для подключения к вашему прокси-серверу!
