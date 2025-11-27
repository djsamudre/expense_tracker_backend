# Expense Tracker Backend

A modular RESTful backend for expense tracking implemented with Node.js, Express and MongoDB.

## Features
- CRUD endpoints for expenses (title, amount, category, date)
- Date-range and category filtering
- Monthly totals analytics using MongoDB aggregation
- CORS + request logging (morgan)
- Environment configuration via dotenv

## Tech
Node.js · Express · MongoDB · Mongoose · Nodemon · Morgan

## Quickstart (local)
1. Clone the repo
2. Copy `.env.example` → `.env` and set `MONGO_URL` (default: `mongodb://127.0.0.1:27017/expenseDB`)
3. Install dependencies:
   ```bash
   npm install
