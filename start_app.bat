@echo off
REM Start backend
start cmd /k "cd /d C:\Users\ashiq\OneDrive\Desktop\seo_analyzer\backend && python app.py"

REM Start frontend
start cmd /k "cd /d C:\Users\ashiq\OneDrive\Desktop\seo_analyzer\frontend && npm start"
