@echo off
echo Starting Mannlytics Platform...
echo.

:: Start ML Service (venv + uvicorn)
echo [1/3] Starting ML Service...
start "ML Service" cmd /k "cd ml_service && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

:: Wait 3 seconds for ML to initialize
timeout /t 3 /nobreak > nul

:: Start Backend
echo [2/3] Starting Backend...
start "Backend" cmd /k "cd backend && npm start"

:: Wait 2 seconds
timeout /t 2 /nobreak > nul

:: Start Frontend
echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services started!
echo ML Service  : http://localhost:8000
echo Backend     : http://localhost:5000
echo Frontend    : http://localhost:5173
echo.
pause
