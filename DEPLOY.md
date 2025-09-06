# 🚀 Автоматический деплой в GitHub

## 📋 Настройка (один раз)

### 1. Создайте репозиторий на GitHub
1. Идите на https://github.com/new
2. Название: `ai-interview-trainer`
3. Сделайте публичным
4. Создайте репозиторий

### 2. Настройте локальный Git
```bash
# Инициализация (если еще не сделано)
git init

# Добавьте удаленный репозиторий
git remote add origin https://github.com/YOUR_USERNAME/ai-interview-trainer.git

# Создайте main ветку
git branch -M main

# Первый коммит
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 3. Включите GitHub Pages
1. Идите в Settings вашего репозитория
2. Прокрутите до "Pages"
3. Source: "GitHub Actions"
4. Сохраните

## 🚀 Использование

### Способ 1: Скрипт (рекомендуется)

**На Mac/Linux:**
```bash
# Сделайте скрипт исполняемым
chmod +x deploy.sh

# Запустите деплой
./deploy.sh
```

**На Windows:**
```cmd
# Просто запустите
deploy.bat
```

### Способ 2: Ручные команды
```bash
git add .
git commit -m "Update: $(date)"
git push origin main
```

## ⚙️ Что происходит автоматически

1. **GitHub Actions** запускается при каждом push
2. **Собирает** ваш проект
3. **Деплоит** на GitHub Pages
4. **Ваш сайт** доступен по адресу:
   `https://YOUR_USERNAME.github.io/ai-interview-trainer/`

## 🔧 Настройка для вашего случая

Замените `YOUR_USERNAME` в файлах на ваш GitHub username:
- `deploy.sh` (строка с URL)
- `deploy.bat` (строка с URL)

## 📱 Мобильное приложение (опционально)

Можете добавить PWA манифест для установки как приложение:

```json
{
  "name": "AI Interview Trainer",
  "short_name": "Interview AI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#6366f1"
}
```

## 🎯 Результат

После настройки:
- ✅ Любые изменения автоматически деплоятся
- ✅ Сайт всегда актуальный
- ✅ Доступен по постоянной ссылке
- ✅ Работает на всех устройствах

---

**Готово! Теперь ваши изменения будут автоматически появляться в интернете! 🎉**
