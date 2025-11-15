#!/bin/bash

echo "🎓 Campus Wallet Setup Script"
echo "=============================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Python 3 found"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL not found. Please install MySQL first."
    echo "   macOS: brew install mysql"
    echo "   Ubuntu: sudo apt install mysql-server"
    exit 1
fi

echo "✅ MySQL found"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Database setup instructions
echo ""
echo "=============================="
echo "Next Steps:"
echo "=============================="
echo ""
echo "1. Create the database:"
echo "   mysql -u root -p -e 'CREATE DATABASE campus_DB;'"
echo ""
echo "2. Import the sample data:"
echo "   mysql -u root -p campus_DB < campus_database.sql"
echo ""
echo "3. Update database credentials in app.py"
echo "   Edit DB_CONFIG section with your MySQL password"
echo ""
echo "4. Run the application:"
echo "   source venv/bin/activate  # if not already activated"
echo "   python app.py"
echo ""
echo "5. Open your browser to:"
echo "   http://localhost:5000"
echo ""
echo "=============================="
echo "Setup complete! 🎉"
echo "=============================="
