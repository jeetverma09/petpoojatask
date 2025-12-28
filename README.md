# Premium Expense Tracker

A modern, full-stack Expense Tracker application with a rich dashboard and powerful statistics.

## Tech Stack
- **Frontend**: React.js (Vite), React Query, Vanilla CSS (Glassmorphism design).
- **Backend**: Node.js, Express.
- **Database**: MySQL.

## Prerequisites
- Node.js (v14+)
- MySQL Server

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (Workbench, Command Line, etc.).
2. Create the database and tables by running the script located at `database/schema.sql`.
   - This script creates the `expense_tracker` database and seeds it with initial Users and Categories.

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Open the `.env` file in the `backend` directory.
   - Update `DB_USER` and `DB_PASSWORD` to match your local MySQL credentials.
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=expense_tracker
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   - The server will start on `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   - Access the application at the URL provided (usually `http://localhost:5173`).

## Features
- **Dashboard**: View key metrics at a glance.
- **Add Expense**: Easily record new expenses.
- **Filtering**: Filter text by User, Category, and Date Range.
- **Statistics**:
  - **Top 3 Days**: Highest spending days per user.
  - **Monthly Change**: Percentage change compared to the previous month.
  - **Forecast**: Prediction for next month's spending based on the last 3 months average.

## Project Structure
- `/frontend`: React Frontend
- `/backend`: Node/Express Backend
- `/database`: SQL SchemaScript

## Note
- The application uses `mysql2` for database connections.
- Ensure your MySQL server is running before starting the backend.
