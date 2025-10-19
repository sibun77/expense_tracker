const mongoose = require("mongoose");

const incomeCategorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("IncomeCategory", incomeCategorySchema);
