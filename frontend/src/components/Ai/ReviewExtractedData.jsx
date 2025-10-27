import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiEdit, FiCheckSquare } from "react-icons/fi";
import { FaCheckDouble } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance.jsx";
import EditTransactionModal from "./EditTransactionModal.jsx";
import { API_PATHS } from "../../utils/apiPaths.js";

const ReviewExtractedData = ({ data, onClear }) => {
    const [selected, setSelected] = useState([]);
    const [editing, setEditing] = useState(null);
    const [transactions, setTransactions] = useState(data?.transactions || []);

    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-gray-500 text-sm italic mt-4">
                No transactions extracted yet.
            </div>
        );
    }

    // ✅ Toggle select
    const toggleSelect = (index) => {
        setSelected((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    // ✅ Select / Deselect all
    const toggleSelectAll = () => {
        if (selected.length === transactions.length) setSelected([]);
        else setSelected(transactions.map((_, idx) => idx));
    };

    // ✅ Save edit changes
    const handleSaveEdit = (updatedTx) => {
        const updated = [...transactions];
        updated[editing.index] = updatedTx;
        setTransactions(updated);
        setEditing(null);
        toast.success("Transaction updated");
    };

    // ✅ Import selected
    const handleImport = async () => {
        const selectedData = selected.map((i) => transactions[i]);
        if (selectedData.length === 0) return toast.error("No transactions selected");

        try {
            const payload = {
                income: selectedData.filter((t) => t.type === "income"),
                expenses: selectedData.filter((t) => t.type === "expense"),
            };
            const resp = await axiosInstance.post(API_PATHS.AI.IMPORT, payload);
            toast.success(resp.data.message || "Imported successfully");
            onClear?.();
        } catch (err) {
            console.error("Import error:", err);
            toast.error(err.response?.data?.message || "Import failed");
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Review Extracted Transactions</h3>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSelectAll}
                        className="px-3 py-2 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-100"
                    >
                        <FaCheckDouble className="text-blue-600" />
                        {selected.length === transactions.length ? "Deselect All" : "Select All"}
                    </button>

                    <button
                        onClick={handleImport}
                        className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
                    >
                        <FiCheckSquare size={16} /> Import Selected
                    </button>
                </div>
            </div>

            {/* ✅ Card grid layout */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {transactions.map((tx, idx) => (
                    <div
                        key={idx}
                        className={`relative border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-150 ${
                            selected.includes(idx) ? "bg-blue-50 border-blue-400" : "bg-white"
                        }`}
                    >
                        {/* Checkbox */}
                        <input
                            type="checkbox"
                            checked={selected.includes(idx)}
                            onChange={() => toggleSelect(idx)}
                            className="absolute top-3 left-3 accent-blue-600"
                        />

                        {/* Edit button */}
                        <button
                            onClick={() => setEditing({ index: idx, data: tx })}
                            className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
                        >
                            <FiEdit size={16} />
                        </button>

                        <div className="mt-6 space-y-2">
                            <div className="text-sm text-gray-600 capitalize">
                                Type: <span className="font-medium text-gray-900">{tx.type}</span>
                            </div>

                            {tx.type === "income" ? (
                                <div className="text-sm text-gray-600">
                                    Source:{" "}
                                    <span className="font-medium text-gray-900">
                                        {tx.source || "NA"}
                                    </span>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-600">
                                    Category:{" "}
                                    <span className="font-medium text-gray-900">
                                        {tx.category || "NA"}
                                    </span>
                                </div>
                            )}

                            <div className="text-sm text-gray-600">
                                Amount:{" "}
                                <span className="font-semibold text-gray-900">₹{tx.amount}</span>
                            </div>

                            <div className="text-sm text-gray-600">
                                Date:{" "}
                                <span className="font-medium text-gray-900">{tx.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editing && (
                <EditTransactionModal
                    open={!!editing}
                    data={editing.data}
                    onClose={() => setEditing(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default ReviewExtractedData;
