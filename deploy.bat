@echo off
echo 🚀 Начинаем деплой...

REM Проверяем статус git
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ошибка проверки git статуса
    pause
    exit /b 1
)

REM Добавляем все изменения
echo 📁 Добавляем файлы...
git add .

REM Создаем коммит с текущей датой
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "COMMIT_MSG=Update: %YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

echo 💾 Создаем коммит: %COMMIT_MSG%
git commit -m "%COMMIT_MSG%"

REM Пушим в main ветку
echo ⬆️ Отправляем в GitHub...
git push origin main

echo ✅ Деплой завершен!
echo 🌐 Ваш сайт будет доступен по адресу:
echo    https://aihrtest-create.github.io/ai-interview/
pause
