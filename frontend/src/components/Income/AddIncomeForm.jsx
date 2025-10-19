import React, { useState, useEffect } from "react";
import Input from "../../components/Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddIncomeForm = ({ onAddIncome, existingData, isEditing }) => {
    const [formData, setFormData] = useState({
        source: existingData?.source || "",
        amount: existingData?.amount || "",
        date: existingData?.date ? existingData.date.split("T")[0] : "",
        icon: existingData?.icon || "",
    });

    const [categories, setCategories] = useState([]);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    // ✅ Fetch income categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.INCOME.GET_CATEGORIES);
                if (response.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching income categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === "other") {
            setShowNewCategoryInput(true);
            handleChange("source", "");
        } else {
            setShowNewCategoryInput(false);
            handleChange("source", value);
        }
    };

    // ✅ Add new income category
    const handleAddNewCategory = async () => {
        if (!newCategory.trim()) {
            toast.error("Enter a valid category name");
            return;
        }
        try {
            const response = await axiosInstance.post(API_PATHS.INCOME.ADD_CATEGORY, {
                name: newCategory,
            });
            const added = response.data;
            setCategories((prev) => [...prev, added]);
            handleChange("source", added.name);
            setShowNewCategoryInput(false);
            setNewCategory("");
            toast.success("New income category added");
        } catch (error) {
            console.error("Error adding income category:", error);
            toast.error("Failed to add income category");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = { ...formData };
        if (showNewCategoryInput && newCategory.trim()) {
            dataToSend.source = newCategory.trim();
        }

        if (isEditing && existingData?._id) {
            onAddIncome({ ...dataToSend, _id: existingData._id });
        } else {
            onAddIncome(dataToSend);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <EmojiPickerPopup
                icon={formData.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            {/* ✅ Category Dropdown */}
            <label className="block mb-1 font-medium text-gray-700">
                Income Source
            </label>
            <select
                value={showNewCategoryInput ? "other" : formData.source || ""}
                onChange={handleCategoryChange}
                className="border rounded p-2 w-full mb-3"
            >
                <option value="">-- Select Source --</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
                <option value="other">Other...</option>
            </select>

            {/* ✅ Delete selected custom category */}
            {formData.source && !showNewCategoryInput && (
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">
                        Selected: <span className="font-medium">{formData.source}</span>
                    </p>

                    {(() => {
                        const selectedCat = categories.find((c) => c.name === formData.source);
                        if (selectedCat && !selectedCat.isDefault) {
                            return (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (window.confirm("Delete this category?")) {
                                            try {
                                                await axiosInstance.delete(
                                                    `${API_PATHS.INCOME.DELETE_CATEGORY}/${selectedCat._id}`
                                                );
                                                toast.success("Category deleted");
                                                setCategories((prev) =>
                                                    prev.filter((c) => c._id !== selectedCat._id)
                                                );
                                                handleChange("source", "");
                                            } catch (error) {
                                                console.error(error);
                                                toast.error("Failed to delete category");
                                            }
                                        }
                                    }}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </button>
                            );
                        }
                        return null;
                    })()}
                </div>
            )}

            {/* ✅ New Category Input */}
            {showNewCategoryInput && (
                <div className="mb-3">
                    <Input
                        value={newCategory}
                        onChange={({ target }) => setNewCategory(target.value)}
                        label="New Income Source"
                        placeholder="Enter new income category"
                        type="text"
                    />
                    <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="bg-blue-600 text-white px-3 py-1 rounded mt-1"
                    >
                        Add Category
                    </button>
                </div>
            )}

            <Input
                value={formData.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="Enter amount"
                type="number"
            />

            <Input
                value={formData.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button type="submit" className="add-btn add-btn-fill">
                    {isEditing ? "Update Income" : "Add Income"}
                </button>
            </div>
        </form>
    );
};

export default AddIncomeForm;
