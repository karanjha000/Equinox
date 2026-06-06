<div align="center">
  <h1>Equinox Dashboard</h1>
  <p>A Full-Stack Financial Management Dashboard</p>

  <!-- Live Demo Badge Placeholder -->
  [![Live Demo](https://img.shields.io/badge/Demo-Live_Website-success?style=flat-square&logo=vercel)](https://finance-frontend-zeta-umber.vercel.app)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)](#)
  [![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
  [![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=flat-square&logo=vite&logoColor=white)](#)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](#)
</div>

## 📖 About / Project Overview

Equinox Dashboard is a comprehensive financial management platform designed to track budgets, monitor transactions, and provide insightful data trends. Built with a robust Spring Boot backend and a modern React (Vite) frontend, the platform features role-based access control, interactive data visualization, budget tracking with progress indicators, and secure JWT-based authentication to ensure your financial data is safe and easily accessible.

## 💻 Tech Stack

**Backend:**
- ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white) Spring Boot (Web, Data JPA, Security, Validation)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) PostgreSQL (Production) & H2 Database (Development)
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) JSON Web Tokens (Auth)
- ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black) OpenAPI 3.0 (Springdoc)
- ![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white) Java 17 & Lombok

**Frontend:**
- ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) React 18 & React Router
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) Vite
- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) Tailwind CSS
- ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square) Recharts (Data Visualization)
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) Axios
- ![Lucide React](https://img.shields.io/badge/Lucide_React-F472B6?style=flat-square) Icons

## ✨ Features

- **🔐 Secure Authentication:** Stateless JWT-based authentication and authorization.
- **👥 User Management:** Admin tools to manage users, roles, and account statuses.
- **💵 Transaction Management:** Create, update, delete, and filter transactions by type, category, or date. Export transactions as CSV.
- **📊 Interactive Dashboard:** Visual summaries of income, expenses, balances, and monthly/category trends using Recharts.
- **🎯 Budget Tracking:** Set monthly budget limits per category and monitor spending progress with real-time progress bars and status indicators (Safe / Warning / Exceeded).
- **🛡️ Role-Based Access Control:** Distinct permissions for Admin, Analyst, and Viewer roles.
- **🔄 Admin Switching:** Non-admin users can quickly switch to an Admin session via a dedicated modal without logging out.
- **📱 Responsive Design:** Fully adaptive layout with dedicated desktop sidebar and mobile drawer navigation.
- **⚙️ Environment Profiles:** Separate configurations for Development (H2 in-memory DB) and Production (PostgreSQL) environments.

## 📂 Project Structure

```text
Equinox/
├── equinox_backend/                  # Spring Boot Backend
│   ├── src/main/java/.../backend/
│   │   ├── controller/               # REST API Endpoints
│   │   │   ├── AuthController.java
│   │   │   ├── BudgetController.java
│   │   │   ├── DashboardController.java
│   │   │   ├── HealthController.java
│   │   │   ├── TransactionController.java
│   │   │   └── UserController.java
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── enums/                    # Enums (Roles, Transaction Types)
│   │   ├── exception/                # Global Exception Handling
│   │   ├── model/                    # JPA Entities (User, Transaction, Budget)
│   │   ├── repository/               # Data Access Layer
│   │   ├── security/                 # JWT, Auth Filters, CORS, Security Config
│   │   └── service/                  # Business Logic
│   └── src/main/resources/
│       ├── application.properties            # Base config (shared)
│       ├── application-dev.properties        # Development profile (H2)
│       └── application-prod.properties       # Production profile (PostgreSQL)
├── equinox_frontend/                 # React/Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Shared (SwitchAdminModal, TransactionFilters, RecentTransactions)
│   │   │   ├── desktop/              # Desktop-only (DesktopSidebar, DesktopTransactionTable, DesktopUserTable)
│   │   │   ├── mobile/               # Mobile-only (MobileDrawer, MobileNavbar, MobileTransactionList, MobileUserList)
│   │   │   ├── ConfirmDialog.jsx     # Reusable delete confirmation modal
│   │   │   ├── Layout.jsx            # App shell with responsive sidebar/drawer
│   │   │   ├── ProtectedRoute.jsx    # Auth guard for routes
│   │   │   └── TransactionModal.jsx  # Create/Edit transaction modal
│   │   ├── context/                  # AuthContext, ToastContext
│   │   ├── hooks/                    # Custom hooks (useIsMobile)
│   │   ├── pages/                    # DashboardPage, TransactionsPage, BudgetsPage, UsersPage, LoginPage
│   │   └── services/                 # Axios API client (api.js)
│   ├── package.json
│   └── tailwind.config.js
└── render.yaml                       # Render.com deployment blueprint
```

## 🔑 Role Permissions

| Role | Permissions |
| :--- | :--- |
| **ADMIN** | Full access. Can manage users, roles, and all financial data. |
| **ANALYST** | Can read dashboards/budgets and perform full CRUD operations on transactions. |
| **VIEWER** | Read-only access to transactions, budgets, and dashboard summaries. |

## 📡 API Endpoints

### 🟢 Public (No Auth Required)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Health Check |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate user and get JWT |
| `GET` | `/swagger-ui.html` | Swagger UI Documentation |

### 👤 Users (Admin Only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/{id}` | Get user by ID |
| `PUT` | `/api/users/{id}/role` | Update user role |
| `PUT` | `/api/users/{id}/toggle-status` | Enable/Disable user account |
| `DELETE`| `/api/users/{id}` | Delete user |

### 💵 Transactions
| Method | Endpoint | Allowed Roles |
| :--- | :--- | :--- |
| `GET` | `/api/transactions` | Admin, Analyst, Viewer |
| `POST` | `/api/transactions` | Admin, Analyst |
| `GET` | `/api/transactions/{id}` | Admin, Analyst, Viewer |
| `PUT` | `/api/transactions/{id}` | Admin, Analyst |
| `DELETE`| `/api/transactions/{id}` | Admin |
| `GET` | `/api/transactions/filter/type` | Admin, Analyst, Viewer |
| `GET` | `/api/transactions/filter/category` | Admin, Analyst, Viewer |
| `GET` | `/api/transactions/filter/date` | Admin, Analyst, Viewer |
| `GET` | `/api/transactions/export/csv` | Admin, Analyst, Viewer |

### 📊 Dashboard & Budgets
| Method | Endpoint | Allowed Roles |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | Admin, Analyst, Viewer |
| `GET` | `/api/dashboard/income` | Admin, Analyst, Viewer |
| `GET` | `/api/dashboard/expenses` | Admin, Analyst, Viewer |
| `GET` | `/api/dashboard/balance` | Admin, Analyst, Viewer |
| `GET` | `/api/dashboard/trends/monthly`| Admin, Analyst, Viewer |
| `GET` | `/api/dashboard/trends/category`| Admin, Analyst, Viewer |
| `GET` | `/api/budgets` | Admin, Analyst, Viewer |
| `GET` | `/api/budgets/progress` | Admin, Analyst, Viewer |
| `POST` | `/api/budgets` | Admin, Analyst, Viewer |
| `DELETE`| `/api/budgets/{id}` | Admin, Analyst, Viewer |

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js** (v18+ recommended) & npm
- **Maven** (optional, wrapper included)
- **PostgreSQL** (only needed for production profile)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karanjha000/Equinox_dashboard.git
   cd Equinox_dashboard
   ```

2. **Backend Setup:**
   ```bash
   cd equinox_backend
   mvn clean install
   ```

3. **Frontend Setup:**
   ```bash
   cd ../equinox_frontend
   npm install
   ```

## ⚙️ Environment Configuration

The backend uses **Spring Profiles** to manage environment-specific settings:

| File | Purpose |
| :--- | :--- |
| `application.properties` | Base/shared config (server port, Hikari pool, JWT expiration, Swagger) |
| `application-dev.properties` | Development — H2 in-memory DB, SQL logging enabled |
| `application-prod.properties` | Production — PostgreSQL via env vars, SQL logging disabled |

The active profile defaults to `dev`. To run in production mode, set:
```bash
-Dspring.profiles.active=prod
```

### Production Environment Variables

When deploying, configure these environment variables on your hosting provider:

```properties
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_very_long_secret_key_here_at_least_32_chars
JWT_EXPIRATION=86400000
ALLOWED_ORIGINS=https://your-frontend-url.com
PORT=8080
```

## 🏃 Running Locally

**Start the Backend (Development — H2 Database):**
```bash
cd equinox_backend
mvn spring-boot:run
# API available at http://localhost:8080
# Swagger Docs at http://localhost:8080/swagger-ui.html
# H2 Console at http://localhost:8080/h2-console
```

**Start the Frontend:**
```bash
cd equinox_frontend
npm run dev
# React app available at http://localhost:5173
```

## 🚢 Deployment (Render.com)

A `render.yaml` blueprint is included for one-click deployment to [Render](https://render.com):
- **Backend:** Deployed as a Docker web service connected to an external PostgreSQL database (e.g., Neon).
- **Frontend:** Deployed as a static site with automatic `npm run build`.

## 👨‍💻 Author

**Karan Jha**
- GitHub: [@karanjha000](https://github.com/karanjha000)
- LinkedIn: [Karan Jha](https://linkedin.com/in/karan-jha-k99999)
