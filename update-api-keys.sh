#!/bin/bash

# Скрипт для обновления API ключей в index.html

echo "🔄 Обновляем API ключи в index.html..."

# Заменяем ElevenLabs STT API ключ
sed -i '' 's/localStorage.getItem('\''elevenlabsSttApiKey'\'') || '\''YOUR_ELEVENLABS_API_KEY_HERE'\''/localStorage.getItem('\''elevenlabsSttApiKey'\'') || (window.API_KEYS ? window.API_KEYS.elevenlabs : '\'''\''/g' index.html

# Заменяем ElevenLabs TTS API ключ
sed -i '' 's/localStorage.getItem('\''elevenlabsTtsApiKey'\'') || '\''YOUR_ELEVENLABS_API_KEY_HERE'\''/localStorage.getItem('\''elevenlabsTtsApiKey'\'') || (window.API_KEYS ? window.API_KEYS.elevenlabs : '\'''\''/g' index.html

# Заменяем Yandex STT API ключ
sed -i '' 's/localStorage.getItem('\''yandexSttApiKey'\'') || '\''YOUR_YANDEX_API_KEY_HERE'\''/localStorage.getItem('\''yandexSttApiKey'\'') || (window.API_KEYS ? window.API_KEYS.yandex : '\'''\''/g' index.html

# Заменяем Yandex TTS API ключ
sed -i '' 's/localStorage.getItem('\''yandexTtsApiKey'\'') || '\''YOUR_YANDEX_API_KEY_HERE'\''/localStorage.getItem('\''yandexTtsApiKey'\'') || (window.API_KEYS ? window.API_KEYS.yandex : '\'''\''/g' index.html

echo "✅ API ключи обновлены!"
