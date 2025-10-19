const IncomeCategory = require("../models/IncomeCategory");
const ExpenseCategory = require("../models/ExpenseCategory");

// Default categories
const defaultIncomeCategories = ["Salary", "Freelance", "Investments"];
const defaultExpenseCategories = ["Rent", "Food", "Travel", "Bills"];

exports.getIncomeCategories = async (req, res) => {
    try {
        const userId = req.user.id;
        let categories = await IncomeCategory.find({ $or: [{ userId }, { isDefault: true }] });
        if (categories.length === 0) {
            // seed defaults
            await IncomeCategory.insertMany(
                defaultIncomeCategories.map(name => ({ name, isDefault: true }))
            );
            categories = await IncomeCategory.find({ isDefault: true });
        }
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addIncomeCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name?.trim()) return res.status(400).json({ message: "Category name is required" });

        const existing = await IncomeCategory.findOne({ userId, name: name.trim() });
        if (existing) return res.json(existing);

        const category = new IncomeCategory({ userId, name: name.trim() });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getExpenseCategories = async (req, res) => {
    try {
        const userId = req.user.id;
        let categories = await ExpenseCategory.find({ $or: [{ userId }, { isDefault: true }] });
        if (categories.length === 0) {
            await ExpenseCategory.insertMany(
                defaultExpenseCategories.map(name => ({ name, isDefault: true }))
            );
            categories = await ExpenseCategory.find({ isDefault: true });
        }
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addExpenseCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        if (!name?.trim()) return res.status(400).json({ message: "Category name is required" });

        const existing = await ExpenseCategory.findOne({ userId, name: name.trim() });
        if (existing) return res.json(existing);

        const category = new ExpenseCategory({ userId, name: name.trim() });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteIncomeCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const category = await IncomeCategory.findOne({ _id: id, userId });
        if (!category) {
            return res.status(404).json({ message: "Category not found or not yours" });
        }
        if (category.isDefault) {
            return res.status(400).json({ message: "Default categories cannot be deleted" });
        }

        await category.deleteOne();
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteExpenseCategory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const category = await ExpenseCategory.findOne({ _id: id, userId });
        if (!category) {
            return res.status(404).json({ message: "Category not found or not yours" });
        }
        if (category.isDefault) {
            return res.status(400).json({ message: "Default categories cannot be deleted" });
        }

        await category.deleteOne();
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
