import mysql.connector as alice
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os

app = Flask(__name__)

# 🔑 Update these with your MySQL credentials
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your_password_here",
    "database": "campus_DB"
}


def get_db_connection():
    """Create and return a database connection."""
    try:
        conn = alice.connect(**DB_CONFIG)
        return conn
    except alice.Error as e:
        print(f"Database connection error: {e}")
        return None


@app.route("/")
def home():
    """Home page with navigation."""
    return render_template("home.html")


@app.route("/users")
def list_users():
    """Display all users."""
    conn = get_db_connection()
    if not conn:
        return "<h2>Database connection error</h2>", 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users ORDER BY name")
    users = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return render_template("users.html", users=users)


@app.route("/users/<user_id>")
def user_profile(user_id):
    """Display user profile with summary stats."""
    conn = get_db_connection()
    if not conn:
        return "<h2>Database connection error</h2>", 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Get user info
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        conn.close()
        return "<h2>User not found</h2>", 404
    
    # Get spending summary
    cursor.execute("""
        SELECT 
            COUNT(*) as transaction_count,
            SUM(amount) as total_spent,
            AVG(amount) as avg_transaction
        FROM wallet_transactions 
        WHERE user_id = %s
    """, (user_id,))
    spending_summary = cursor.fetchone()
    
    # Get spending by category
    cursor.execute("""
        SELECT category, SUM(amount) as total, COUNT(*) as count
        FROM wallet_transactions
        WHERE user_id = %s
        GROUP BY category
        ORDER BY total DESC
    """, (user_id,))
    spending_by_category = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return render_template("user_profile.html", 
                         user=user, 
                         summary=spending_summary,
                         categories=spending_by_category)


@app.route("/users/<user_id>/transactions")
def user_transactions(user_id):
    """Show wallet transactions for a user."""
    conn = get_db_connection()
    if not conn:
        return "<h2>Database connection error</h2>", 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Get user info
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        conn.close()
        return "<h2>User not found</h2>", 404
    
    # Get transactions
    query = """
        SELECT wt.*
        FROM wallet_transactions wt
        WHERE wt.user_id = %s
        ORDER BY wt.date DESC, wt.transaction_id DESC
    """
    cursor.execute(query, (user_id,))
    transactions = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return render_template("transactions.html", 
                         user=user, 
                         transactions=transactions)


@app.route("/users/<user_id>/events")
def recommended_events(user_id):
    """Recommend events based on user interests."""
    conn = get_db_connection()
    if not conn:
        return "<h2>Database connection error</h2>", 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Get user info
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        conn.close()
        return "<h2>User not found</h2>", 404
    
    # Parse user interests
    interests = (user["interests"] or "").split(",")
    interest_keywords = [i.strip().lower() for i in interests]
    
    # Get all upcoming events
    cursor.execute("SELECT * FROM campus_events ORDER BY start_time")
    events = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    # Match events to interests
    matched_events = []
    other_events = []
    
    for event in events:
        tags = (event["tags"] or "").split(",")
        tag_list = [t.strip().lower() for t in tags]
        
        # Check for matches
        matches = [tag for tag in tag_list if tag in interest_keywords]
        
        if matches:
            event['matched_interests'] = matches
            matched_events.append(event)
        else:
            other_events.append(event)
    
    return render_template("recommended_events.html", 
                         user=user,
                         matched_events=matched_events,
                         other_events=other_events)


@app.route("/events")
def list_events():
    """Display all campus events."""
    conn = get_db_connection()
    if not conn:
        return "<h2>Database connection error</h2>", 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Get filter parameters
    category_filter = request.args.get('category', None)
    
    if category_filter:
        cursor.execute("SELECT * FROM campus_events WHERE category = %s ORDER BY start_time", 
                      (category_filter,))
    else:
        cursor.execute("SELECT * FROM campus_events ORDER BY start_time")
    
    events = cursor.fetchall()
    
    # Get unique categories for filter
    cursor.execute("SELECT DISTINCT category FROM campus_events ORDER BY category")
    categories = [row['category'] for row in cursor.fetchall()]
    
    cursor.close()
    conn.close()
    
    return render_template("events.html", 
                         events=events, 
                         categories=categories,
                         selected_category=category_filter)


@app.route("/analytics")
def analytics():
    """Display spending analytics dashboard."""
    conn = get_db_connection()
    if not conn:
        return "<h2>Database connection error</h2>", 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Total spending by category
    cursor.execute("""
        SELECT category, SUM(amount) as total, COUNT(*) as count
        FROM wallet_transactions
        GROUP BY category
        ORDER BY total DESC
    """)
    category_totals = cursor.fetchall()
    
    # Top merchants
    cursor.execute("""
        SELECT merchant, SUM(amount) as total, COUNT(*) as count
        FROM wallet_transactions
        GROUP BY merchant
        ORDER BY total DESC
        LIMIT 10
    """)
    top_merchants = cursor.fetchall()
    
    # Payment method usage
    cursor.execute("""
        SELECT payment_method, SUM(amount) as total, COUNT(*) as count
        FROM wallet_transactions
        GROUP BY payment_method
        ORDER BY total DESC
    """)
    payment_methods = cursor.fetchall()
    
    # Top spenders
    cursor.execute("""
        SELECT u.user_id, u.name, u.major, SUM(wt.amount) as total_spent, COUNT(*) as transaction_count
        FROM users u
        LEFT JOIN wallet_transactions wt ON u.user_id = wt.user_id
        GROUP BY u.user_id, u.name, u.major
        ORDER BY total_spent DESC
        LIMIT 10
    """)
    top_spenders = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return render_template("analytics.html",
                         category_totals=category_totals,
                         top_merchants=top_merchants,
                         payment_methods=payment_methods,
                         top_spenders=top_spenders)


@app.route("/api/users")
def api_users():
    """API endpoint to get all users as JSON."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users ORDER BY name")
    users = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(users)


@app.route("/api/users/<user_id>/spending")
def api_user_spending(user_id):
    """API endpoint to get user spending data as JSON."""
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT category, SUM(amount) as total
        FROM wallet_transactions
        WHERE user_id = %s
        GROUP BY category
    """, (user_id,))
    spending = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify(spending)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
