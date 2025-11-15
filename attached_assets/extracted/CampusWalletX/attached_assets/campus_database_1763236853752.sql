-- Campus Database SQL Script
-- Generated from CSV files

-- ============================================
-- Table: users
-- ============================================

CREATE TABLE users (
    user_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    major VARCHAR(50),
    class_year INT,
    residence_type VARCHAR(50),
    interests TEXT
);

INSERT INTO users (user_id, name, major, class_year, residence_type, interests) VALUES
('U001', 'Alex Rivera', 'Computer Science', 2027, 'Dorm', 'tech,gaming,clubs'),
('U002', 'Maya Patel', 'Finance', 2026, 'Commuter', 'finance,career,networking'),
('U003', 'Jordan Lee', 'Engineering', 2025, 'Dorm', 'robotics,hardware,fitness'),
('U004', 'Taylor Johnson', 'Biology', 2025, 'Dorm', 'wellness,volunteering,pre-med'),
('U005', 'Chris Martinez', 'Marketing', 2027, 'Off-Campus Apartment', 'content,social-media,events'),
('U006', 'Sara Kim', 'Data Science', 2026, 'Dorm', 'ai,stats,hackathons'),
('U007', 'Liam O''Connor', 'Accounting', 2025, 'Commuter', 'finance,investing,clubs'),
('U008', 'Noor Ali', 'Computer Science', 2028, 'Dorm', 'web-dev,open-source,gaming'),
('U009', 'Ethan Rogers', 'Economics', 2027, 'Off-Campus Apartment', 'macro,policy,reading'),
('U010', 'Zoe Hernandez', 'Psychology', 2026, 'Dorm', 'wellness,peer-support,art'),
('U011', 'Diego Santos', 'Computer Science', 2027, 'Dorm', 'security,ctf,gaming'),
('U012', 'Amira Hassan', 'Math', 2026, 'Commuter', 'problem-solving,tutoring,clubs'),
('U013', 'Brandon Wu', 'Information Systems', 2025, 'Dorm', 'productivity,automation,apps'),
('U014', 'Kayla Brown', 'Journalism', 2027, 'Off-Campus Apartment', 'writing,media,events'),
('U015', 'Isaac Green', 'Physics', 2026, 'Dorm', 'space,technology,reading'),
('U016', 'Olivia Park', 'Computer Engineering', 2025, 'Dorm', 'hardware,embedded-systems,gadgets'),
('U017', 'Malik Carter', 'Business Analytics', 2027, 'Commuter', 'data,finance,dashboarding'),
('U018', 'Hannah Nguyen', 'Statistics', 2026, 'Dorm', 'ai,data-viz,teaching'),
('U019', 'Ryan Flores', 'Computer Science', 2028, 'Dorm', 'mobile-dev,gaming,clubs'),
('U020', 'Jade Robinson', 'Urban Studies', 2025, 'Off-Campus Apartment', 'community,policy,advocacy');


-- ============================================
-- Table: campus_events
-- ============================================

CREATE TABLE campus_events (
    event_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    location VARCHAR(100),
    start_time TIMESTAMP,
    tags TEXT,
    cost DECIMAL(10,2)
);

INSERT INTO campus_events (event_id, name, category, location, start_time, tags, cost) VALUES
('E001', 'Tech and Innovation Mixer', 'Tech', 'Business School Atrium', '2025-11-05 17:00:00', 'tech,networking', 0.00),
('E002', 'Career Networking Night', 'Career', 'Campus Center', '2025-11-06 18:00:00', 'career,networking', 0.00),
('E003', 'Financial Wellness Workshop', 'Finance', 'Innovation Hub', '2025-11-07 16:00:00', 'finance,wellness', 0.00),
('E004', 'HackFest Info Session', 'Tech', 'Innovation Hub', '2025-11-01 15:00:00', 'hackathon,ai', 0.00),
('E005', 'Study Skills Bootcamp', 'Academic', 'Library', '2025-11-08 11:00:00', 'academic,success', 0.00),
('E006', 'Esports Tournament', 'Sports', 'Rec Center', '2025-11-09 19:00:00', 'gaming,competition', 5.00),
('E007', 'Yoga and Mindfulness', 'Wellness', 'Rec Center', '2025-11-03 08:00:00', 'wellness,health', 0.00),
('E008', 'Cultural Night', 'Cultural', 'Campus Center', '2025-11-09 18:00:00', 'culture,community', 0.00),
('E009', 'Women in Tech Panel', 'Tech', 'Business School Atrium', '2025-11-04 17:30:00', 'tech,diversity', 0.00),
('E010', 'Entrepreneurship 101', 'Career', 'Innovation Hub', '2025-11-02 14:00:00', 'startups,business', 0.00),
('E011', 'Resume and LinkedIn Clinic', 'Career', 'Campus Center', '2025-11-05 13:00:00', 'career,workshops', 0.00),
('E012', 'Music on the Green', 'Social', 'Quad', '2025-11-06 19:00:00', 'music,social', 0.00),
('E013', 'Campus Cleanup Day', 'Community', 'Quad', '2025-11-02 10:00:00', 'community,volunteering', 0.00),
('E014', 'Intro to Personal Finance', 'Finance', 'Innovation Hub', '2025-11-03 16:00:00', 'finance,students', 0.00),
('E015', 'Data Science Club Meetup', 'Tech', 'Innovation Hub', '2025-11-07 18:00:00', 'data,ai', 0.00),
('E016', 'Movie Night', 'Social', 'Student Union', '2025-11-08 20:00:00', 'film,social', 0.00),
('E017', 'Leadership Workshop', 'Academic', 'Business School Atrium', '2025-11-01 12:00:00', 'leadership,skills', 0.00),
('E018', 'Healthy Eating on a Budget', 'Wellness', 'Campus Center', '2025-11-04 12:30:00', 'wellness,finance', 0.00),
('E019', 'Campus Job Fair', 'Career', 'Campus Center', '2025-11-09 13:00:00', 'career,employment', 0.00),
('E020', 'Library Late Night Study', 'Academic', 'Library', '2025-11-10 21:00:00', 'study,academic', 0.00);


-- ============================================
-- Table: wallet_transactions
-- ============================================

CREATE TABLE wallet_transactions (
    transaction_id VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(10),
    merchant VARCHAR(100),
    category VARCHAR(50),
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    location VARCHAR(100),
    date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO wallet_transactions (transaction_id, user_id, merchant, category, amount, payment_method, location, date) VALUES
('T0001', 'U001', 'Starbucks', 'Dining', 5.75, 'Dining Dollars', 'Campus Center', '2025-10-01'),
('T0002', 'U001', 'Campus Dining Hall', 'Dining', 9.25, 'Meal Plan', 'Dining Hall', '2025-10-02'),
('T0003', 'U001', 'Bookstore', 'Books', 42.50, 'Campus Card', 'Bookstore', '2025-10-03'),
('T0004', 'U002', 'Target', 'Supplies', 28.99, 'Credit Card', 'Downtown Newark', '2025-10-01'),
('T0005', 'U002', 'Local Pizzeria', 'Dining', 14.25, 'Campus Card', 'Downtown Newark', '2025-10-03'),
('T0006', 'U002', 'Streaming Service', 'Entertainment', 9.99, 'Credit Card', 'Online', '2025-10-05'),
('T0007', 'U003', 'Campus Dining Hall', 'Dining', 8.50, 'Meal Plan', 'Dining Hall', '2025-10-02'),
('T0008', 'U003', 'Gym Cafe', 'Dining', 6.75, 'Campus Card', 'Rec Center', '2025-10-04'),
('T0009', 'U003', 'Uber / Transit', 'Transport', 12.40, 'Debit Card', 'Off-Campus', '2025-10-06'),
('T0010', 'U004', 'CVS', 'Pharmacy', 16.30, 'Credit Card', 'Downtown Newark', '2025-10-01'),
('T0011', 'U004', 'Starbucks', 'Dining', 4.95, 'Dining Dollars', 'Campus Center', '2025-10-03'),
('T0012', 'U004', 'Campus Dining Hall', 'Dining', 9.10, 'Meal Plan', 'Dining Hall', '2025-10-07'),
('T0013', 'U005', 'Bookstore', 'Books', 63.20, 'Campus Card', 'Bookstore', '2025-10-02'),
('T0014', 'U005', 'Food Truck', 'Dining', 7.80, 'Campus Card', 'Quad', '2025-10-05'),
('T0015', 'U005', 'Local Pizzeria', 'Dining', 13.50, 'Credit Card', 'Downtown Newark', '2025-10-08'),
('T0016', 'U006', 'Starbucks', 'Dining', 5.60, 'Dining Dollars', 'Campus Center', '2025-10-03'),
('T0017', 'U006', 'Streaming Service', 'Entertainment', 9.99, 'Debit Card', 'Online', '2025-10-04'),
('T0018', 'U006', 'Campus Dining Hall', 'Dining', 8.90, 'Meal Plan', 'Dining Hall', '2025-10-06'),
('T0019', 'U007', 'Target', 'Supplies', 35.40, 'Debit Card', 'Downtown Newark', '2025-10-02'),
('T0020', 'U007', 'Local Pizzeria', 'Dining', 11.75, 'Campus Card', 'Downtown Newark', '2025-10-06'),
('T0021', 'U007', 'Uber / Transit', 'Transport', 18.20, 'Credit Card', 'Off-Campus', '2025-10-07'),
('T0022', 'U008', 'Bookstore', 'Books', 24.99, 'Campus Card', 'Bookstore', '2025-10-01'),
('T0023', 'U008', 'Starbucks', 'Dining', 4.50, 'Dining Dollars', 'Campus Center', '2025-10-02'),
('T0024', 'U008', 'Food Truck', 'Dining', 8.25, 'Campus Card', 'Quad', '2025-10-05'),
('T0025', 'U009', 'Campus Dining Hall', 'Dining', 9.35, 'Meal Plan', 'Dining Hall', '2025-10-03'),
('T0026', 'U009', 'Streaming Service', 'Entertainment', 9.99, 'Credit Card', 'Online', '2025-10-05'),
('T0027', 'U009', 'Target', 'Supplies', 19.80, 'Debit Card', 'Downtown Newark', '2025-10-07'),
('T0028', 'U010', 'Local Pizzeria', 'Dining', 12.60, 'Campus Card', 'Downtown Newark', '2025-10-02'),
('T0029', 'U010', 'Gym Cafe', 'Dining', 5.95, 'Campus Card', 'Rec Center', '2025-10-04'),
('T0030', 'U010', 'CVS', 'Pharmacy', 13.10, 'Credit Card', 'Downtown Newark', '2025-10-08'),
('T0031', 'U001', 'Uber / Transit', 'Transport', 17.30, 'Credit Card', 'Off-Campus', '2025-10-09'),
('T0032', 'U002', 'Campus Dining Hall', 'Dining', 8.20, 'Meal Plan', 'Dining Hall', '2025-10-09'),
('T0033', 'U003', 'Bookstore', 'Books', 29.99, 'Campus Card', 'Bookstore', '2025-10-09'),
('T0034', 'U004', 'Target', 'Supplies', 22.45, 'Debit Card', 'Downtown Newark', '2025-10-10'),
('T0035', 'U005', 'Starbucks', 'Dining', 5.10, 'Dining Dollars', 'Campus Center', '2025-10-10'),
('T0036', 'U006', 'Local Pizzeria', 'Dining', 14.75, 'Credit Card', 'Downtown Newark', '2025-10-11'),
('T0037', 'U007', 'Streaming Service', 'Entertainment', 9.99, 'Credit Card', 'Online', '2025-10-11'),
('T0038', 'U008', 'Campus Dining Hall', 'Dining', 8.60, 'Meal Plan', 'Dining Hall', '2025-10-11'),
('T0039', 'U009', 'Target', 'Supplies', 31.25, 'Debit Card', 'Downtown Newark', '2025-10-12'),
('T0040', 'U010', 'Starbucks', 'Dining', 4.85, 'Dining Dollars', 'Campus Center', '2025-10-12');


-- ============================================
-- Useful sample queries
-- ============================================

-- Get total spending per user
-- SELECT user_id, SUM(amount) as total_spent 
-- FROM wallet_transactions 
-- GROUP BY user_id 
-- ORDER BY total_spent DESC;

-- Find events by category
-- SELECT * FROM campus_events WHERE category = 'Tech';

-- Get user spending by category
-- SELECT user_id, category, SUM(amount) as total 
-- FROM wallet_transactions 
-- GROUP BY user_id, category;
