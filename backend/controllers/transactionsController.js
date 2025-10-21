// controllers/transactionsController.js
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const IncomeCategory = require("../models/IncomeCategory");
const ExpenseCategory = require("../models/ExpenseCategory");

exports.importTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { income = [], expenses = [] } = req.body;

        // Validate arrays
        if (!Array.isArray(income) || !Array.isArray(expenses)) {
            return res.status(400).json({ message: "Invalid payload. Expect arrays." });
        }

        // 1) Ensure Income categories (sources) exist in IncomeCategory
        const incomeSources = Array.from(new Set(
            income.map(i => (i.source || "").trim()).filter(s => s && s !== "NA")
        ));

        if (incomeSources.length) {
            const existingIncomeCats = await IncomeCategory.find({ name: { $in: incomeSources }, userId });
            const existingIncomeNames = new Set(existingIncomeCats.map(c => c.name));
            const toInsertIncomeCats = incomeSources
                .filter(n => !existingIncomeNames.has(n))
                .map(n => ({ userId, name: n, isDefault: false }));
            if (toInsertIncomeCats.length) {
                await IncomeCategory.insertMany(toInsertIncomeCats);
            }
        }

        // 2) Ensure Expense categories exist
        const expenseCats = Array.from(new Set(
            expenses.map(e => (e.category || "").trim()).filter(s => s && s !== "NA")
        ));

        if (expenseCats.length) {
            const existingExpenseCats = await ExpenseCategory.find({ name: { $in: expenseCats }, userId });
            const existingExpenseNames = new Set(existingExpenseCats.map(c => c.name));
            const toInsertExpenseCats = expenseCats
                .filter(n => !existingExpenseNames.has(n))
                .map(n => ({ userId, name: n, isDefault: false }));
            if (toInsertExpenseCats.length) {
                await ExpenseCategory.insertMany(toInsertExpenseCats);
            }
        }

        // 3) Build docs for insertMany
        const incomeDocs = (income || []).map(i => ({
            userId,
            icon: i.icon || "",
            source: i.source && i.source !== "NA" ? i.source : "NA",
            amount: Number(i.amount) || 0,
            date: i.date ? new Date(i.date) : new Date(),
        }));

        const expenseDocs = (expenses || []).map(e => ({
            userId,
            icon: e.icon || "",
            category: e.category && e.category !== "NA" ? e.category : "NA",
            amount: Number(e.amount) || 0,
            date: e.date ? new Date(e.date) : new Date(),
        }));

        // 4) Insert
        const insertedIncomes = incomeDocs.length ? await Income.insertMany(incomeDocs) : [];
        const insertedExpenses = expenseDocs.length ? await Expense.insertMany(expenseDocs) : [];

        res.json({
            message: "Imported successfully",
            inserted: {
                incomes: insertedIncomes.length,
                expenses: insertedExpenses.length,
            },
        });
    } catch (err) {
        console.error("importTransactions error:", err);
        res.status(500).json({ message: "Failed to import transactions" });
    }
};
