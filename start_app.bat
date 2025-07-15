@echo off
REM Start backend with virtual environment
start cmd /k "cd /d C:\Users\ashiq\OneDrive\Desktop\seo_analyzer\backend && venv\Scripts\activate && python app.py"

REM Start frontend
start cmd /k "cd /d C:\Users\ashiq\OneDrive\Desktop\seo_analyzer\frontend && npm start"
