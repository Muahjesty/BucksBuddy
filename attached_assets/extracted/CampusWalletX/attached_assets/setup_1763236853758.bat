@echo off
echo Campus Wallet Setup Script (Windows)
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed. Please install Python 3 first.
    pause
    exit /b 1
)

echo [OK] Python found

REM Check if MySQL is installed
mysql --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] MySQL not found. Please install MySQL first.
    echo Download from: https://dev.mysql.com/downloads/installer/
    pause
    exit /b 1
)

echo [OK] MySQL found

REM Create virtual environment
echo.
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo.
echo Installing Python dependencies...
pip install -r requirements.txt

REM Next steps
echo.
echo ======================================
echo Next Steps:
echo ======================================
echo.
echo 1. Create the database:
echo    mysql -u root -p -e "CREATE DATABASE campus_DB;"
echo.
echo 2. Import the sample data:
echo    mysql -u root -p campus_DB ^< campus_database.sql
echo.
echo 3. Update database credentials in app.py
echo    Edit DB_CONFIG section with your MySQL password
echo.
echo 4. Run the application:
echo    venv\Scripts\activate.bat
echo    python app.py
echo.
echo 5. Open your browser to:
echo    http://localhost:5000
echo.
echo ======================================
echo Setup complete!
echo ======================================
echo.
pause
