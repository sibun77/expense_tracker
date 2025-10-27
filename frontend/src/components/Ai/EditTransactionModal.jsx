import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { toast } from "react-hot-toast";

const EditTransactionModal = ({ open, data, onClose, onSave }) => {
    const [form, setForm] = useState({ ...data });
    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(false);
    const [addingCategory, setAddingCategory] = useState(false);
    const [showTextInput, setShowTextInput] = useState(false);

    useEffect(() => {
        if (data) {
            setForm({ ...data });
            fetchCategoriesForType(data.type);
        }
    }, [data]);

    const fetchCategoriesForType = async (type) => {
        setLoadingCats(true);
        try {
            const path =
                type === "income"
                    ? API_PATHS.INCOME.GET_CATEGORIES
                    : API_PATHS.EXPENSE.GET_CATEGORIES;

            const resp = await axiosInstance.get(path);
            const list = resp.data || [];
            setCategories(list);

            const aiValue =
                type === "income" ? data?.source?.trim() : data?.category?.trim();

            // ✅ Case 1: If there are no categories, auto-show text box
            if (!list.length) {
                setShowTextInput(true);
                return;
            }

            // ✅ Case 2: If AI-suggested value isn’t found in saved categories
            const exists = list.some(
                (c) => c.name?.toLowerCase() === aiValue?.toLowerCase()
            );

            if (aiValue && !exists) {
                setShowTextInput(true);
                // Auto-fill text box with AI-detected source/category
                setForm((p) => ({
                    ...p,
                    [type === "income" ? "source" : "category"]: aiValue,
                }));
            } else {
                setShowTextInput(false);
            }
        } catch (err) {
            console.error("Failed to load categories", err);
            toast.error("Failed to load categories");
        } finally {
            setLoadingCats(false);
        }
    };


    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setForm((p) => ({ ...p, type: newType }));
        fetchCategoriesForType(newType);
    };

    const handleSelectCategory = (e) => {
        const val = e.target.value;
        if (val === "__other__") {
            setShowTextInput(true);
            setForm((p) => ({
                ...p,
                category: p.type === "income" ? p.source : p.category,
            }));
        } else {
            setShowTextInput(false);
            if (form.type === "income")
                setForm((p) => ({ ...p, source: val }));
            else setForm((p) => ({ ...p, category: val }));
        }
    };

    const handleAddCategory = async () => {
        const name =
            form.type === "income" ? form.source?.trim() : form.category?.trim();
        if (!name) return toast.error("Enter category/source name");

        setAddingCategory(true);
        try {
            const path =
                form.type === "income"
                    ? API_PATHS.INCOME.ADD_CATEGORY
                    : API_PATHS.EXPENSE.ADD_CATEGORY;
            const resp = await axiosInstance.post(path, { name });
            const added = resp.data;
            setCategories((s) => [...s, added]);
            setShowTextInput(false);
            toast.success("Added successfully");
        } catch (err) {
            console.error("Add category error:", err);
            toast.error(err.response?.data?.message || "Failed to add");
        } finally {
            setAddingCategory(false);
        }
    };

    const handleSave = () => {
        if (!form.amount || Number(form.amount) <= 0)
            return toast.error("Amount must be > 0");
        if (!form.date) return toast.error("Date required");

        // normalize defaults
        if (form.type === "income" && !form.source)
            form.source = "NA";
        if (form.type === "expense" && !form.category)
            form.category = "NA";

        onSave(form);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h4 className="text-lg font-semibold mb-3">Edit Transaction</h4>

                <div className="space-y-3">
                    {/* Type selector */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleTypeChange}
                            className="w-full border rounded p-2"
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    {/* Category / Source */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            {form.type === "income" ? "Source" : "Category"}
                        </label>
                        <select
                            value={
                                showTextInput
                                    ? "__other__"
                                    : form.type === "income"
                                        ? form.source || ""
                                        : form.category || ""
                            }
                            onChange={handleSelectCategory}
                            className="w-full border rounded p-2 mb-2"
                        >
                            <option value="">-- Select --</option>
                            {loadingCats ? (
                                <option disabled>Loading...</option>
                            ) : (
                                categories.map((c) => (
                                    <option key={c._id || c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))
                            )}
                            <option value="__other__">Other...</option>
                        </select>

                        {showTextInput && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder={`Enter ${form.type === "income" ? "source" : "category"}`}
                                    value={form.type === "income" ? form.source || "" : form.category || ""}
                                    onChange={(e) =>
                                        setForm((p) =>
                                            form.type === "income"
                                                ? { ...p, source: e.target.value }
                                                : { ...p, category: e.target.value }
                                        )
                                    }
                                    className="w-full border rounded p-2"
                                />
                                <button
                                    onClick={handleAddCategory}
                                    disabled={addingCategory}
                                    className="px-3 py-2 bg-primary text-white rounded"
                                >
                                    {addingCategory ? "Adding..." : "Add"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            name="amount"
                            type="number"
                            value={form.amount}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, amount: e.target.value }))
                            }
                            className="w-full border rounded p-2"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, date: e.target.value }))
                            }
                            className="w-full border rounded p-2"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTransactionModal;
