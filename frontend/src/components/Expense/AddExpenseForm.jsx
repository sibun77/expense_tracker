import React, { useState } from 'react'
import Input from '../../components/Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddExpenseForm = ({ onAddExpense, existingData, isEditing }) => {
    const [formData, setFormData] = useState({
        category: existingData?.category || "",
        amount: existingData?.amount || "",
        date: existingData?.date ? existingData.date.split("T")[0] : "",
        icon: existingData?.icon || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            onAddExpense({ ...formData, _id: existingData._id });
        } else {
            onAddExpense(formData);
        }
    };

    const handleChange = (key, value) => setFormData({ ...formData, [key]: value });

    return (
        <div>
            <EmojiPickerPopup
                icon={formData.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={formData.category}
                onChange={({ target }) => handleChange("category", target.value)}
                label="Expense Category"
                placeholder="Rent, Groceries, etc"
                type="text"
            />

            <Input
                value={formData.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder=""
                type="number"
            />

            <Input
                value={formData.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className='flex justify-end mt-6'>
                <button
                    type='button'
                    className='add-btn add-btn-fill'
                    onClick={handleSubmit}
                >
                    {isEditing ? "Update Expense" : "Add Expense"}
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;
