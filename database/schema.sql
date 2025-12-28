-- Database creation usually done manually or via createdb
CREATE DATABASE expense_tracker;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'active'
);

-- Categories Table
CREATE TABLE IF NOT EXISTS Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS Expenses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category INT, -- References Categories(id)
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (category) REFERENCES Categories(id) ON DELETE SET NULL
);

-- Seed Data
INSERT INTO Users (name, email, status) VALUES 
('John Doe', 'john@example.com', 'active'),
('Jane Smith', 'jane@example.com', 'active'),
('Robert Brown', 'robert@example.com', 'inactive');

INSERT INTO Categories (name) VALUES 
('Food'),
('Transportation'),
('Utilities'),
('Entertainment'),
('Healthcare'),
('Shopping');

-- Dummy Expenses
INSERT INTO Expenses (user_id, category, amount, date, description) VALUES
(1, 1, 150.00, CURRENT_DATE, 'Lunch validation'),
(1, 2, 50.00, CURRENT_DATE - INTERVAL '1 day', 'Bus ticket'),
(2, 3, 2000.00, CURRENT_DATE - INTERVAL '2 days', 'Electricity Bill');
