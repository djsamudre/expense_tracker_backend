// server.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./utils/db");
const expensesRouter = require("./routes/expenses");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Connect to DB
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/expenseDB";
connectDB(MONGO_URL);

// Routes
app.use("/api/expenses", expensesRouter);

app.get("/", (req, res) => res.json({ message: "Expense Tracker API - /api/expenses" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
