# Finance Dashboard — Frontend

A modern, responsive finance dashboard built with React.js that connects to the Finance Backend REST API.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI Framework |
| Vite | 6.0.5 | Build Tool |
| React Router DOM | 6.28.0 | Client-side Routing |
| Axios | 1.7.9 | HTTP Client |
| Recharts | 2.15.0 | Charts & Graphs |
| Lucide React | 0.469.0 | Icons |
| Tailwind CSS | 3.4.17 | Styling |

---

## Project Structure

```
finance-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ConfirmDialog.jsx      # Reusable confirmation modal
│   │   ├── Layout.jsx             # App layout wrapper
│   │   ├── ProtectedRoute.jsx     # Route guard based on auth
│   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   ├── StatCard.jsx           # Dashboard stat card
│   │   └── TransactionModal.jsx   # Add/Edit transaction modal
│   ├── context/
│   │   ├── AuthContext.jsx        # Auth state management
│   │   └── ToastContext.jsx       # Toast notifications
│   ├── pages/
│   │   ├── DashboardPage.jsx      # Overview with charts
│   │   ├── LoginPage.jsx          # Login form
│   │   ├── TransactionsPage.jsx   # Transactions with filters
│   │   └── UsersPage.jsx          # User management (Admin only)
│   ├── services/
│   │   └── api.js                 # Axios instance + all API calls
│   ├── App.jsx                    # Routes configuration
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── .env                           # Environment variables (not in git)
├── .gitignore
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## Pages & Features

### Login Page
- Username and password form
- JWT token stored in localStorage on success
- Redirects to dashboard after login

### Dashboard Page
- Total Income, Total Expenses, Net Balance cards
- Monthly trends area chart
- Category breakdown pie chart
- Category comparison bar chart
- Recent transactions table

### Transactions Page
- Paginated transactions table
- Filter by type (INCOME/EXPENSE) — auto applies on change
- Filter by category — auto applies on change
- Filter by date range — applies when both dates selected
- Create new transaction (Analyst/Admin only)
- Edit transaction (Analyst/Admin only)
- Delete transaction (Admin only)
- Soft deleted transactions hidden automatically

### Users Page (Admin only)
- All users table with stats
- Change user role via dropdown
- Toggle user active/inactive status
- Delete user with confirmation

---

## Role Based UI

| Feature | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| View Dashboard | ✅ | ✅ | ✅ |
| View Transactions | ✅ | ✅ | ✅ |
| Create Transaction | ❌ | ✅ | ✅ |
| Edit Transaction | ❌ | ✅ | ✅ |
| Delete Transaction | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Finance Backend running on port 9090

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/finance-backend.git

# 2. Navigate to frontend folder
cd finance-dashboard

# 3. Install dependencies
npm install

# 4. Create .env file
cp .env.example .env

# 5. Update .env with your values
VITE_API_BASE_URL=http://localhost:9090
VITE_APP_NAME=FinanceOS
VITE_TOKEN_KEY=fin_token
VITE_USERNAME_KEY=fin_username
VITE_ROLE_KEY=fin_role

# 6. Start development server
npm run dev
```

App runs on `http://localhost:5173`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | http://localhost:9090 |
| `VITE_APP_NAME` | App display name | FinanceOS |
| `VITE_TOKEN_KEY` | localStorage key for JWT | fin_token |
| `VITE_USERNAME_KEY` | localStorage key for username | fin_username |
| `VITE_ROLE_KEY` | localStorage key for role | fin_role |

> ⚠️ Never commit `.env` to GitHub — it is in `.gitignore`

---

## Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.

---

## API Integration

All API calls are centralized in `src/services/api.js`:

```js
// Auth
authAPI.login({ username, password })
authAPI.register({ username, password, email, role })

// Transactions
txAPI.getAll(page, size)
txAPI.create(data)
txAPI.update(id, data)
txAPI.remove(id)
txAPI.byType('INCOME' | 'EXPENSE')
txAPI.byCategory('Salary')
txAPI.byDate('2026-01-01', '2026-04-30')

// Dashboard
dashAPI.summary()
dashAPI.monthly()
dashAPI.category()

// Users (Admin)
usersAPI.getAll()
usersAPI.updateRole(id, role)
usersAPI.toggle(id)
usersAPI.remove(id)
```

---

## Known Issues & Future Improvements

- [ ] Add dark/light mode toggle
- [ ] Add transaction search by notes/description
- [ ] Export transactions to CSV
- [ ] Add profile page
- [ ] Add refresh token support
- [ ] Mobile responsive improvements