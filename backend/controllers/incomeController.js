const xlsx = require('xlsx');
const Income = require('../models/Income')
const path = require('path')

// Add Income Source
exports.addIncome = async (req, res ) => {
    const userId = req.user.id;
    try {
        const {icon, source, amount, date} = req.body;

        // Validation: Check for missing fields
        if(!source || !amount || !date){
            return res.status(400).json({message:"All fields are required"});
        }
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date:new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}
// Get All Income Source
exports.getAllIncome = async (req, res ) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({userId}).sort({date:-1});
        res.json(income);
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}

// Update Income Source
exports.updateIncome = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { icon, source, amount, date } = req.body;

    try {
        // Validate inputs
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the income record and ensure it belongs to the logged-in user
        const income = await Income.findOne({ _id: id, userId });
        if (!income) {
            return res.status(404).json({ message: "Income record not found" });
        }

        // Update fields
        income.source = source;
        income.amount = amount;
        income.date = new Date(date);
        income.icon = icon || income.icon;

        await income.save();

        res.status(200).json({
            message: "Income updated successfully",
            income
        });
    } catch (error) {
        console.error("Error updating income:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Delete Income Source
exports.deleteIncome = async (req, res ) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({message:"Income delete successfully"})
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}
// Download Excel
// exports.downloadIncomeExcel = async (req, res ) => {
//     const userId = req.user.id;
//     try {
//         const income = await Income.find({userId}).sort({date:-1});

//         // Prepare data for Excel
//         const data = income.map((item) => ({
//             Source: item.source,
//             Amount:item.amount,
//             Date: item.date,
//         }));
        

//         const wb = xlsx.utils.book_new();
//         const ws = xlsx.utils.json_to_sheet(data);
//         xlsx.utils.book_append_sheet(wb,ws,"Income");

//         const fileName = 'income_details.xlsx';

//         xlsx.writeFile(wb, fileName);

//         res.download(fileName);
//     } catch (error) {
//         res.status(500).json({message:"Server Error"})
//         console.log(error)
//     }
// }
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const incomeRecords = await Income.find({ userId }).sort({ date: -1 });

        if (!incomeRecords.length) {
            return res.status(404).json({ message: "No income records found" });
        }

        // Prepare Excel data
        const data = incomeRecords.map(item => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date.toISOString().split("T")[0], // format date cleanly
        }));

        // Create workbook in memory
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");

        // Write workbook to buffer
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        // Set headers for Excel download
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=income_details.xlsx"
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