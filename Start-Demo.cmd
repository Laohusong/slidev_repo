@echo off
setlocal
set "PATH=D:\app\Slidev\runtime;%PATH%"
cd /d "%~dp0presentations\00-demo"
if not exist "node_modules\@slidev\cli\bin\slidev.mjs" (
  call npm ci
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
call npm run dev -- --port 3031
if errorlevel 1 pause
