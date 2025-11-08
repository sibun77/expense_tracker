# 💰 Expense Tracker - AI-Powered Personal Finance Management

A full-stack MERN application that helps users track their income and expenses with intelligent AI-powered insights and document processing capabilities.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-61dafb.svg)

## 🌟 Features

### 📊 Core Functionality
- **Dashboard Analytics**: Real-time visualization of financial health with interactive charts
- **Income Management**: Track multiple income sources with custom categorization
- **Expense Tracking**: Organize expenses by categories with detailed insights
- **Transaction History**: Complete CRUD operations on all transactions
- **Data Export**: Download income/expense reports in Excel format

### 🤖 AI-Powered Features (Google Gemini 2.5)
- **Smart Document Analysis**: Upload bank statements (PDF, CSV, XLSX, TXT) and let AI extract transactions automatically
- **Financial Insights**: Get personalized recommendations and spending analysis
- **Automated Categorization**: AI intelligently categorizes transactions
- **Bulk Import**: Review AI-extracted data and import in bulk
- **Predictive Analysis**: Analyze spending patterns by period (1M, 3M, 6M, All)

### 📈 Visualizations
- Interactive pie charts for financial overview
- Bar charts for expense/income trends
- Line charts for spending patterns
- Last 30/60 days transaction summaries

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **Tailwind CSS 4.1.13** - Styling
- **Recharts 3.2.1** - Data visualization
- **React Router DOM 7.9.1** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Emoji Picker React** - Custom icons
- **Moment.js** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **MongoDB** - Database
- **Mongoose 8.18.0** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests

### AI & Processing
- **Google Generative AI (Gemini 2.5 Flash)** - AI analysis
- **PDF2JSON** - PDF parsing
- **XLSX** - Excel file processing
- **Axios** - API integration

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- Google Gemini API Key

### Clone Repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Start backend server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Update `frontend/src/utils/apiPaths.js` with your backend URL:
```javascript
export const BASE_URL = "http://localhost:5000";
```

Start frontend development server:
```bash
npm run dev
```

## 🚀 Deployment

### Backend (Vercel)
1. Create `vercel.json` in backend root
2. Deploy using Vercel CLI or GitHub integration
3. Set environment variables in Vercel dashboard

### Frontend (Vercel)
1. Build the project: `npm run build`
2. Deploy `dist` folder to Vercel
3. Configure rewrites in `vercel.json` for SPA routing

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── incomeController.js    # Income management
│   │   ├── expenseController.js   # Expense management
│   │   ├── dashboardController.js # Dashboard analytics
│   │   ├── aiController.js        # AI features
│   │   ├── categoryController.js  # Category management
│   │   └── transactionsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── uploadFileMiddleware.js # File upload handling
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Income.js              # Income schema
│   │   ├── Expense.js             # Expense schema
│   │   ├── IncomeCategory.js      # Income categories
│   │   └── ExpenseCategory.js     # Expense categories
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── aiRoutes.js
│   │   └── categoryRoutes.js
│   └── server.js                  # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Ai/                # AI feature components
│   │   │   ├── Cards/             # Reusable card components
│   │   │   ├── Charts/            # Chart components
│   │   │   ├── Dashboard/         # Dashboard widgets
│   │   │   ├── Expense/           # Expense components
│   │   │   ├── Income/            # Income components
│   │   │   ├── Inputs/            # Form inputs
│   │   │   └── layouts/           # Layout components
│   │   ├── context/
│   │   │   └── UserContext.jsx    # Global user state
│   │   ├── hooks/
│   │   │   └── useUserAuth.jsx    # Auth hook
│   │   ├── pages/
│   │   │   ├── Auth/              # Login/Signup
│   │   │   ├── Dashboard/         # Dashboard pages
│   │   │   └── AI/                # AI assistance page
│   │   ├── utils/
│   │   │   ├── apiPaths.js        # API endpoints
│   │   │   ├── axiosInstance.js   # HTTP client
│   │   │   ├── helper.js          # Utility functions
│   │   │   └── uploadImage.js     # Image upload
│   │   └── App.jsx                # Root component
│   └── vite.config.js
└── README.md
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/getUser` - Get user info

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard analytics

### Income
- `POST /api/v1/income/add` - Add income
- `GET /api/v1/income/get` - Get all income
- `PUT /api/v1/income/update/:id` - Update income
- `DELETE /api/v1/income/:id` - Delete income
- `GET /api/v1/income/downloadexcel` - Download Excel

### Expense
- `POST /api/v1/expense/add` - Add expense
- `GET /api/v1/expense/get` - Get all expenses
- `PUT /api/v1/expense/update/:id` - Update expense
- `DELETE /api/v1/expense/:id` - Delete expense
- `GET /api/v1/expense/downloadexcel` - Download Excel

### AI Features
- `POST /api/v1/ai/analyze` - AI financial analysis
- `POST /api/v1/ai/extract-transactions` - Extract from documents
- `POST /api/v1/ai/import` - Import extracted transactions

### Categories
- `GET /api/v1/category/income` - Get income categories
- `POST /api/v1/category/income` - Add income category
- `DELETE /api/v1/category/income/:id` - Delete category
- `GET /api/v1/category/expense` - Get expense categories
- `POST /api/v1/category/expense` - Add expense category
- `DELETE /api/v1/category/expense/:id` - Delete category

## 🎨 Features in Detail

### AI Document Processing
1. Upload bank statement (PDF/CSV/XLSX/TXT)
2. AI extracts transactions automatically
3. Review extracted data in card view
4. Edit transactions individually with custom categories
5. Select transactions to import
6. Bulk import into database

### Financial Analysis
- Select analysis type: Income, Expense, or Both
- Choose time period: 1 Month, 3 Months, 6 Months, or All
- Get AI-generated insights:
  - Executive summary
  - Top 3 insights or risks
  - Personalized improvement suggestions

### Custom Categories
- Add custom income sources (Salary, Freelance, etc.)
- Create expense categories (Rent, Food, Travel, etc.)
- Delete user-created categories
- Default categories protected from deletion

## 🔒 Security Features

- **JWT Authentication**: Secure token-based sessions
- **Password Hashing**: BCrypt encryption for passwords
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data in .env files

## 📊 Database Schema

### User
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  profileImageUrl: String,
  timestamps: true
}
```

### Income
```javascript
{
  userId: ObjectId (ref: User),
  icon: String,
  source: String,
  amount: Number,
  date: Date,
  timestamps: true
}
```

### Expense
```javascript
{
  userId: ObjectId (ref: User),
  icon: String,
  category: String,
  amount: Number,
  date: Date,
  timestamps: true
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

Your Name
- GitHub: [@sibun77](https://github.com/sibun77)
- LinkedIn: [Shibabrata Jena](https://www.linkedin.com/in/shibabrata-jena-sibun/)

## 🙏 Acknowledgments

- Google Gemini AI for intelligent document processing
- Recharts for beautiful data visualizations
- MongoDB Atlas for cloud database hosting
- Vercel for seamless deployment

## 📞 Support

For support, email shibabrataj@gmail.com or open an issue in the GitHub repository.

---

⭐ If you found this project helpful, please give it a star!

## 🚀 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Budget alerts and notifications
- [ ] Bank API integration for auto-sync
- [ ] Advanced ML predictions
- [ ] Multi-user/family accounts
- [ ] Investment portfolio tracking
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Receipt scanning with OCR
- [ ] Multi-currency support