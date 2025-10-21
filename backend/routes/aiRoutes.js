const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const uploadFile = require("../middleware/uploadFileMiddleware");

const {
    analyzeFinancials,
    extractTransactionsFromFile,
} = require("../controllers/aiController");

const { importTransactions } = require("../controllers/transactionsController"); // ✅ import our new controller

// ✅ Analyze existing income/expense data
router.post("/analyze", protect, analyzeFinancials);

// ✅ Upload file → AI extract transactions
router.post(
    "/extract-transactions",
    protect,
    uploadFile.single("file"),
    extractTransactionsFromFile
);

// ✅ Import selected transactions into DB (new route)
router.post("/import", protect, importTransactions);

module.exports = router;
