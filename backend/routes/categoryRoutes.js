const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getIncomeCategories,
    addIncomeCategory,
    getExpenseCategories,
    addExpenseCategory,
    deleteIncomeCategory,
    deleteExpenseCategory,
} = require("../controllers/categoryController");

router.get("/income", protect, getIncomeCategories);
router.post("/income", protect, addIncomeCategory);
router.delete("/income/:id", protect, deleteIncomeCategory);

router.get("/expense", protect, getExpenseCategories);
router.post("/expense", protect, addExpenseCategory);
router.delete("/expense/:id", protect, deleteExpenseCategory);

module.exports = router;
