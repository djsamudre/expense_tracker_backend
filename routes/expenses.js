// routes/expenses.js
const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Create an expense
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || amount == null) {
      return res.status(400).json({ error: "title and amount are required" });
    }
    const exp = await Expense.create({ title, amount, category, date });
    res.status(201).json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all expenses (with optional query params ?start=&end=&category=)
router.get("/", async (req, res) => {
  try {
    const { start, end, category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }
    const list = await Expense.find(filter).sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one
router.get("/:id", async (req, res) => {
  try {
    const exp = await Expense.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: "Not found" });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const exp = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) return res.status(404).json({ error: "Not found" });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics: monthly totals (last N months, default 6)
router.get("/analytics/monthly-totals", async (req, res) => {
  try {
    const months = parseInt(req.query.months || "6", 10);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - months + 1, 1);

    const agg = await Expense.aggregate([
      { $match: { date: { $gte: start } } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    const formatted = agg.map(a => ({
      year: a._id.year,
      month: a._id.month,
      total: a.total,
      count: a.count
    }));

    res.json({ months: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
