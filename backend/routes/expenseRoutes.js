const express = require("express");
const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel,
    updateExpense
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.put("/update/:id", protect, updateExpense); // ✅ ADD THIS
router.get("/downloadexcel", protect, downloadExpenseExcel);
router.delete("/:id", protect, deleteExpense);

module.exports = router;
