@echo off
echo Starting ARQ (The Private Strength Suite)...
set PORT=3000
set DATA_DIR=%~dp0data
set RP_ID=localhost
set ORIGIN=http://localhost:5173
set RP_NAME=ARQ

start "ARQ API Backend" cmd /k "cd /d %~dp0api && node server.js"
start "ARQ Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul
start http://localhost:5173
echo ARQ is running at http://localhost:5173!
