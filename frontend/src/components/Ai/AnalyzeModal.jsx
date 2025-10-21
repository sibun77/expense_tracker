import React, { useState } from "react";

const AnalyzeModal = ({ open, onClose, onAnalyze, loading }) => {
    const [type, setType] = useState("both");
    const [period, setPeriod] = useState("1M");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h4 className="text-xl font-semibold mb-4">Analyze Your Finances</h4>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">What to analyze</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                        <option value="both">Both</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Time range</label>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="1M">1 Month</option>
                        <option value="3M">3 Months</option>
                        <option value="6M">6 Months</option>
                        <option value="all">All</option>
                    </select>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onAnalyze({ type, period })}
                        className="px-4 py-2 rounded bg-primary text-white"
                        disabled={loading}
                    >
                        {loading ? "Analyzing..." : "Analyze"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyzeModal;
