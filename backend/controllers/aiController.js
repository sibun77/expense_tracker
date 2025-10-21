const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const PDFParser = require("pdf2json");
const xlsx = require("xlsx");

exports.analyzeFinancials = async (req, res) => {
    try {
        const userId = req.user.id; // assuming JWT
        const { period, type } = req.body; // e.g. 1M / 3M / 6M / all

        // Calculate date range based on `period`
        const now = new Date();
        let startDate = new Date();
        if (period === "1M") startDate.setMonth(now.getMonth() - 1);
        else if (period === "3M") startDate.setMonth(now.getMonth() - 3);
        else if (period === "6M") startDate.setMonth(now.getMonth() - 6);
        else startDate = new Date(0); // "All" case

        // Fetch records
        const incomes = await Income.find({
            userId,
            date: { $gte: startDate, $lte: now },
        });
        const expenses = await Expense.find({
            userId,
            date: { $gte: startDate, $lte: now },
        });

        if (!incomes.length && !expenses.length)
            return res.status(404).json({ message: "No data found for this period." });

        // Compute totals
        const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
        const balance = totalIncome - totalExpense;
        
        // Prepare AI prompt
        const prompt = `
You are a financial analysis assistant. Provide a concise, user-friendly summary.

UserId: ${userId}
Analysis Type: ${type || "both"}
Period: ${period}

Summary stats:
Total Income = ${totalIncome}
Total Expense = ${totalExpense}
Balance = ${balance}

==== INCOME RECORDS ====
${incomes
                .map(
                    (i) =>
                        `Income: ${i.source} | Amount: ${i.amount} | Date: ${i.date.toISOString().split("T")[0]}`
                )
                .join("\n")}

==== EXPENSE RECORDS ====
${expenses
                .map(
                    (e) =>
                        `Expense: ${e.category} | Amount: ${e.amount} | Date: ${e.date.toISOString().split("T")[0]}`
                )
                .join("\n")}

Provide:
1) A short "Executive Summary" (2–3 lines)
2) Top 3 insights or risks
3) Improvement suggestions
Return plain text, not JSON or markdown.
`;

        // Call Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        res.json({
            message: "Success",
            totalIncome,
            totalExpense,
            balance,
            aiResponse,
        });
    } catch (error) {
        console.error("analyzeFinancials error:", error);
        res.status(500).json({ message: "Failed to analyze financial data" });
    }
};


exports.extractTransactionsFromFile = async (req, res) => {
    let filePath;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        filePath = path.join(__dirname, "..", req.file.path);
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        let fileText = "";

        // 🔹 Extract text
        if (fileExt === ".pdf") {
            fileText = await new Promise((resolve, reject) => {
                const PDFParser = require("pdf2json");
                const pdfParser = new PDFParser();

                pdfParser.on("pdfParser_dataError", err => reject(err.parserError));
                pdfParser.on("pdfParser_dataReady", pdfData => {
                    const text = pdfData.Pages
                        .map(page => page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(" "))
                        .join("\n");
                    resolve(text);
                });

                pdfParser.loadPDF(filePath);
            });
        } else if (fileExt === ".csv" || fileExt === ".xlsx") {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            fileText = sheet.map((row) => row.join(" ")).join("\n");
        } else if (fileExt === ".txt") {
            fileText = fs.readFileSync(filePath, "utf8");
        } else {
            return res.status(400).json({ message: "Unsupported file format" });
        }

        // 🔹 Gemini AI prompt
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a financial assistant AI. Extract structured income and expense data from the provided text.
Return valid JSON ONLY in this exact format:
{
  "income": [
    { "source": "string or NA", "amount": number, "date": "YYYY-MM-DD" }
  ],
  "expenses": [
    { "category": "string or NA", "amount": number, "date": "YYYY-MM-DD" }
  ]
}

Rules:
- If a field (like source/category) is missing, set it to "NA".
- If a date is missing or invalid, set it to today's date.
- Include only numeric values for amounts.
- Return JSON only (no markdown, no explanations).

Here’s the text content from the uploaded file:
---
${fileText.slice(0, 12000)}
---
        `;

        const result = await Promise.race([
            model.generateContent(prompt),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 120000))
        ]);
        const aiText = result.response.text();
        const jsonString = aiText.replace(/```json|```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(jsonString);
        } catch (err) {
            console.error("AI JSON parse error:", jsonString);
            return res.status(500).json({ message: "AI returned invalid JSON" });
        }

        // 🔹 Normalize + merge into single unified format
        const today = new Date().toISOString().split("T")[0];
        const normalizeDate = (date) =>
            isNaN(new Date(date)) ? today : new Date(date).toISOString().split("T")[0];

        const incomeData = (parsed.income || []).map((i) => ({
            type: "income",
            source: i.source || "NA",
            amount: Number(i.amount) || 0,
            date: normalizeDate(i.date),
            category: "NA",
        }));

        const expenseData = (parsed.expenses || []).map((e) => ({
            type: "expense",
            category: e.category || "NA",
            amount: Number(e.amount) || 0,
            date: normalizeDate(e.date),
            source: "NA",
        }));

        const transactions = [...incomeData, ...expenseData];

        // ✅ Send clean format back to frontend
        res.json({
            message: "Success",
            data: {
                income: incomeData,
                expenses: expenseData,
                transactions,
            },
        });

    } catch (error) {
        console.error("extractTransactionsFromFile error:", error);
        res.status(500).json({ message: "Failed to extract transactions from file" });
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};