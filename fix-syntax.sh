#!/bin/bash

echo "🔧 Исправляем синтаксические ошибки в index.html..."

# Исправляем синтаксические ошибки в API ключах
sed -i '' 's/window.API_KEYS.elevenlabs : '\'''\''/window.API_KEYS.elevenlabs : '\'''\''/g' index.html
sed -i '' 's/window.API_KEYS.yandex : '\'''\''/window.API_KEYS.yandex : '\'''\''/g' index.html

echo "✅ Синтаксические ошибки исправлены!"
