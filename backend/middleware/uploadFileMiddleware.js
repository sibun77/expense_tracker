const multer = require("multer");
const path = require("path");

// Storage for uploaded financial files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/financials/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File type filter for PDFs, CSVs, Excel, and text files
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Only PDF, CSV, XLSX, and TXT files are allowed."
            ),
            false
        );
    }
};

const uploadFile = multer({ storage, fileFilter });

module.exports = uploadFile;
