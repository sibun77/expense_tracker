export const BASE_URL = "http://localhost:8000";

// utils/apiPath.js
export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_ALL_INCOME: "/api/v1/income/get",
        UPDATE_INCOME: (incomeId) => `/api/v1/income/update/${incomeId}`,
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        GET_CATEGORIES: "/api/v1/category/income",
        ADD_CATEGORY: "/api/v1/category/income",
        DELETE_CATEGORY: "/api/v1/category/income",
        DOWNLOAD_INCOME: "/api/v1/income/downloadexcel"
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/v1/expense/add",
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        UPDATE_EXPENSE: (expenseId) => `/api/v1/expense/update/${expenseId}`,
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        GET_CATEGORIES: "/api/v1/category/expense",
        ADD_CATEGORY: "/api/v1/category/expense",
        DELETE_CATEGORY: "/api/v1/category/expense",
        DOWNLOAD_EXPENSE: "/api/v1/expense/downloadexcel",
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image"
    },
    AI: {
        ANALYZE: "/api/v1/ai/analyze",
        EXTRACT_TRANSACTIONS: "/api/v1/ai/extract-transactions",
        IMPORT: "/api/v1/ai/import",
    }
};
