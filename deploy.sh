#!/bin/bash

# Скрипт для автоматического деплоя
echo "🚀 Начинаем деплой..."

# Проверяем статус git
if [ -z "$(git status --porcelain)" ]; then
    echo "❌ Нет изменений для коммита"
    exit 0
fi

# Добавляем все изменения
echo "📁 Добавляем файлы..."
git add .

# Создаем коммит с текущей датой
COMMIT_MSG="Update: $(date '+%Y-%m-%d %H:%M:%S')"
echo "💾 Создаем коммит: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# Пушим в main ветку
echo "⬆️ Отправляем в GitHub..."
git push origin main

echo "✅ Деплой завершен!"
echo "🌐 Ваш сайт будет доступен по адресу:"
echo "   https://aihrtest-create.github.io/ai-interview/"
