# 🎓 Campus Wallet - Setup Checklist

## Pre-Requirements
- [ ] Python 3.7+ installed (`python3 --version`)
- [ ] MySQL installed and running
- [ ] Basic knowledge of terminal/command line

## Setup Steps

### 1. Database Setup
- [ ] Open MySQL terminal: `mysql -u root -p`
- [ ] Create database: `CREATE DATABASE campus_DB;`
- [ ] Exit MySQL: `exit;`
- [ ] Import data: `mysql -u root -p campus_DB < campus_database.sql`
- [ ] Verify tables exist:
  ```sql
  mysql -u root -p campus_DB
  SHOW TABLES;
  ```
  Should show: `campus_events`, `users`, `wallet_transactions`

### 2. Python Environment
- [ ] Navigate to project directory
- [ ] Create virtual environment: `python3 -m venv venv`
- [ ] Activate virtual environment:
  - **Mac/Linux**: `source venv/bin/activate`
  - **Windows**: `venv\Scripts\activate.bat`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Verify installation: `pip list`

### 3. Application Configuration
- [ ] Open `app.py` in text editor
- [ ] Find `DB_CONFIG` section (around line 9)
- [ ] Update these values:
  ```python
  DB_CONFIG = {
      "host": "localhost",
      "user": "root",              # Your MySQL username
      "password": "YOUR_PASSWORD", # Your MySQL password
      "database": "campus_DB"
  }
  ```
- [ ] Save the file

### 4. Test Run
- [ ] Start the application: `python app.py`
- [ ] Look for output: `Running on http://127.0.0.1:5000`
- [ ] Open browser to: `http://localhost:5000`
- [ ] You should see the Campus Wallet homepage

### 5. Verify All Features Work
- [ ] Click "Browse Users" - should show 20 users
- [ ] Click on any user - should show profile with stats
- [ ] Click "View Transactions" - should show transaction history
- [ ] Click "Recommended Events" - should show matched events
- [ ] Navigate to "Events" in menu - should show all events
- [ ] Try category filter on events page
- [ ] Navigate to "Analytics" - should show dashboard with charts

## Troubleshooting

### Problem: Database connection error
✅ **Solution:**
1. Check MySQL is running: `sudo systemctl status mysql` (Linux) or `brew services list` (Mac)
2. Verify credentials in `app.py` are correct
3. Test connection: `mysql -u root -p campus_DB`

### Problem: "Module not found" error
✅ **Solution:**
1. Ensure virtual environment is activated (you should see `(venv)` in terminal)
2. Reinstall: `pip install -r requirements.txt`

### Problem: Template not found
✅ **Solution:**
1. Verify folder structure:
   ```
   your-project/
   ├── app.py
   ├── templates/
   └── static/
   ```
2. Templates folder must be in same directory as app.py

### Problem: CSS not loading
✅ **Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check browser console for errors (F12)
3. Verify `static/css/style.css` exists

### Problem: Port 5000 already in use
✅ **Solution:**
1. Change port in `app.py` last line:
   ```python
   app.run(debug=True, port=5001)  # Changed from 5000
   ```
2. Access at `http://localhost:5001`

## File Structure Verification

Your project should look like this:

```
campus-wallet/
├── app.py                      ✅ Main Flask application
├── campus_database.sql         ✅ Database schema
├── requirements.txt            ✅ Dependencies
├── README.md                   ✅ Documentation
├── PROJECT_OVERVIEW.md         ✅ Overview
├── setup.sh                    ✅ Unix setup script
├── setup.bat                   ✅ Windows setup script
├── templates/                  ✅ HTML templates folder
│   ├── base.html
│   ├── home.html
│   ├── users.html
│   ├── user_profile.html
│   ├── transactions.html
│   ├── events.html
│   ├── recommended_events.html
│   └── analytics.html
└── static/                     ✅ Static files folder
    └── css/
        └── style.css
```

## Quick Test Commands

Once everything is set up, test these URLs:

- [ ] `http://localhost:5000/` - Homepage
- [ ] `http://localhost:5000/users` - User list
- [ ] `http://localhost:5000/users/U001` - User profile
- [ ] `http://localhost:5000/users/U001/transactions` - Transactions
- [ ] `http://localhost:5000/users/U001/events` - Recommended events
- [ ] `http://localhost:5000/events` - All events
- [ ] `http://localhost:5000/analytics` - Analytics
- [ ] `http://localhost:5000/api/users` - API endpoint (JSON)

## Success Criteria

You know it's working when:
✅ Homepage loads with purple gradient header
✅ Navigation menu appears at top
✅ User cards display with profile information
✅ Transaction tables show data
✅ Events have colored category badges
✅ Analytics dashboard shows charts and tables
✅ No error messages in terminal
✅ No 404 errors in browser console

## Next Steps After Setup

1. **Explore the app** - Click through all pages
2. **Read the code** - Understand how it works
3. **Customize** - Change colors, add features
4. **Add data** - Insert your own users/events
5. **Deploy** - Consider deploying to Heroku or PythonAnywhere

## Getting Help

If you encounter issues:

1. Check this checklist again
2. Read `README.md` for detailed setup
3. Review `PROJECT_OVERVIEW.md` for architecture
4. Check terminal output for error messages
5. Inspect browser console (F12) for frontend errors

## Maintenance

To update or restart:

1. **Stop the app**: `Ctrl+C` in terminal
2. **Make changes**: Edit files as needed
3. **Restart**: `python app.py`
4. **Refresh browser**: Hard refresh to clear cache

---

**Once all boxes are checked, you're ready to use Campus Wallet!** 🎉
