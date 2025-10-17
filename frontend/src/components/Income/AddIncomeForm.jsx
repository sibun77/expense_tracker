import React, { useState, useEffect } from 'react'
import Input from '../../components/Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddIncomeForm = ({ onAddIncome, existingData, isEditing }) => {
    const [formData, setFormData] = useState({
        source: "",
        amount: "",
        date: "",
        icon: ""
    });

    // Pre-fill form data if editing
    useEffect(() => {
        if (existingData) {
            setFormData({
                source: existingData.source || "",
                amount: existingData.amount || "",
                date: existingData.date ? existingData.date.split("T")[0] : "",
                icon: existingData.icon || ""
            });
        }
    }, [existingData]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing && existingData?._id) {
            onAddIncome({ ...formData, _id: existingData._id });
        } else {
            onAddIncome(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <EmojiPickerPopup
                icon={formData.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={formData.source}
                onChange={({ target }) => handleChange("source", target.value)}
                label="Income Source"
                placeholder="Freelance, Salary, etc"
                type="text"
            />

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
                placeholder=""
                type="date"
            />

            <div className='flex justify-end mt-6'>
                <button
                    type="submit"
                    className='add-btn add-btn-fill'
                >
                    {isEditing ? "Update Income" : "Add Income"}
                </button>
            </div>
        </form>
    );
};

export default AddIncomeForm;
