const express = require("express")
const {
    addIncome,
    getAllIncome,
    updateIncome,
    deleteIncome,
    downloadIncomeExcel
} = require("../controllers/incomeController");

const {protect} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/add",protect,addIncome);
router.get("/get",protect,getAllIncome);
router.put("/update/:id", protect, updateIncome);
router.get("/downloadexcel",protect,downloadIncomeExcel);
router.delete("/:id",protect,deleteIncome)

module.exports = router;