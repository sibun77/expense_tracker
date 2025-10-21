import React from "react";

const AnalysisResult = ({ analysis }) => {
    if (!analysis) {
        return <div className="text-sm text-gray-500">No analysis yet. Click a card to start.</div>;
    }

    return (
        <div className="bg-white shadow rounded p-4">
            <div className="flex items-center gap-6 mb-3">
                <div>
                    <div className="text-xs text-gray-500">Total Income</div>
                    <div className="text-lg font-medium">₹{analysis.totalIncome}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Total Expense</div>
                    <div className="text-lg font-medium">₹{analysis.totalExpense}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Balance</div>
                    <div className="text-lg font-medium">₹{analysis.balance}</div>
                </div>
            </div>
            <hr className="my-3" />
            <div className="whitespace-pre-line text-sm text-gray-800">
                {analysis.aiResponse}
            </div>
        </div>
    );
};

export default AnalysisResult;
