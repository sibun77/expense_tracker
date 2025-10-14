const xlsx = require('xlsx');
const Expense = require('../models/Expense')
// const path = require('path')
// const fs = require('fs');

// Add Expense Source
exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, category, amount, date } = req.body;

        // Validation: Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });
        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}
// Get All Expense Source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}
// Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense delete successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}
// Download Excel
// exports.downloadExpenseExcel = async (req, res ) => {
//     const userId = req.user.id;
//     try {
//         const expense = await Expense.find({userId}).sort({date:-1});

//         // Prepare data for Excel
//         const data = expense.map((item) => ({
//             Source: item.category,
//             Amount:item.amount,
//             Date: item.date,
//         }));


//         const wb = xlsx.utils.book_new();
//         const ws = xlsx.utils.json_to_sheet(data);
//         xlsx.utils.book_append_sheet(wb,ws,"Expense");

//         const fileName = 'expense_details.xlsx';

//         xlsx.writeFile(wb, fileName);

//         res.download(fileName);
//     } catch (error) {
//         res.status(500).json({message:"Server Error"})
//         console.log(error)
//     }
// }

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found" });
        }

        // Prepare Excel data
        const data = expenses.map(item => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date.toISOString().split("T")[0],
        }));

        // Create workbook in memory
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        // Write workbook to buffer
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        // Set headers for Excel download
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=expense_details.xlsx"
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        // Send buffer directly
        res.send(buffer);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};