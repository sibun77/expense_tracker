const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.getAIReview = async (req, res) => {
    try {
        const userId = req.user.id; // assuming JWT auth
        const incomes = await Income.find({ userId });
        const expenses = await Expense.find({ userId });

        // Prepare data summary for AI
        const formattedData = {
            incomes: incomes.map((i) => ({
                source: i.source,
                amount: i.amount,
                date: i.date,
            })),
            expenses: expenses.map((e) => ({
                category: e.category,
                amount: e.amount,
                date: e.date,
            })),
        };

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a financial advisor AI. Analyze this user's income and expense data.
Provide output in valid JSON with:
{
  "status": "safe" | "warning" | "danger",
  "goodHabits": ["..."],
  "badHabits": ["..."],
  "suggestions": ["..."]
}
Consider:
- Expense-to-income ratio
- Spending in categories (e.g., food, travel, entertainment)
- Regularity of savings or overspending
Data: ${JSON.stringify(formattedData, null, 2)}
    `;

        const result = await model.generateContent(prompt);
        const aiText = result.response.text();

        // Clean possible markdown or code block characters
        const jsonString = aiText.replace(/```json|```/g, "").trim();
        const aiResponse = JSON.parse(jsonString);

        res.json(aiResponse);
    } catch (error) {
        console.error("AI Review Error:", error);
        res.status(500).json({ message: "Failed to generate AI review" });
    }
};
