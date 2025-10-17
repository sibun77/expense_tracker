const express = require("express");
const { getAIReview } = require ("../controllers/aiController.js");
const { protect } = require("../middleware/authMiddleware.js"); // if you use JWT

const router = express.Router();

router.post("/review", protect, getAIReview);

module.exports = router;
