import React from "react";

const TaskCard = ({ title, subtitle, onClick }) => (
    <button
        onClick={onClick}
        className="border rounded-lg p-6 text-left hover:shadow-md transition-shadow bg-white"
    >
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
    </button>
);

export default TaskCard;
