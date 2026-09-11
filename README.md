<div align="center">
  <h1>Equinox OS</h1>
  <p>A modern financial management platform designed to bring personal and business financial workflows into one secure, intuitive workspace.</p>

  [![Live Demo (Frontend)](https://img.shields.io/badge/Demo-Frontend-success?style=flat-square&logo=vercel)](https://equinox-a4s7.onrender.com/login)
  [![Live Demo (Backend)](https://img.shields.io/badge/Demo-Backend-success?style=flat-square&logo=render)](https://finance-bbackend.onrender.com)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](#)
</div>

## Overview

Equinox OS is a comprehensive, full-stack financial management platform built to help users track budgets, monitor transactions, and visualize data trends. Designed with a multi-user, role-based architecture, Equinox OS ensures that financial data is securely isolated while providing administrative oversight. The platform delivers an interactive, responsive experience across both desktop and mobile devices.

## Key Capabilities

- **Secure Multi-User Access:** Data isolation ensures users only interact with their own financial records.
- **Role-Based Permissions:** Distinct access levels (Admin, Analyst, Viewer) control data visibility and modification capabilities.
- **Financial Dashboard & Analytics:** Real-time data visualization covering cashflow trends, net-worth trajectories, and category distributions.
- **Transaction & Budget Management:** Complete tools for tracking income, expenses, and monthly category limits with real-time progress indicators.
- **Secure Authentication:** Stateless JWT-based authentication flow.
- **Responsive Application Experience:** Adaptive UI with dedicated layouts for desktop and mobile environments.

## Technology Stack

**Frontend**
React 18 • Vite • Tailwind CSS • Recharts • Axios

**Backend**
Java 17 • Spring Boot 4 • Spring Security • REST APIs

**Database**
PostgreSQL (Production) • H2 (Development)

**Authentication**
JSON Web Tokens (JWT) • Role-Based Access Control (RBAC)

**Deployment**
Render • Neon (DB)

## Architecture

Equinox OS follows a clean, layered architecture separating the client interface from the backend business logic and data persistence.

```text
Client (Web/Mobile Browser)
       ↓
Frontend (React SPA)
       ↓
REST API (JSON / HTTP)
       ↓
Backend Services (Spring Boot)
       ↓
Database (PostgreSQL / H2)
```

## Authentication & Access Control

Equinox OS operates on a secure, multi-user model. Authentication is handled statelessly via **JSON Web Tokens (JWT)**. 

The application uses **Role-Based Access Control (RBAC)** to govern permissions:
- **Admin:** System-wide access, user management, and global data oversight.
- **Analyst:** Full read/write capabilities for their own financial transactions and budgets.
- **Viewer:** Read-only access to their own dashboards and historical data.

Protected routes and resources are strictly enforced at both the frontend application layer and the backend service layer.

## Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js** (v18+ recommended) & npm
- **Git**

### Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/karanjha000/Equinox_dashboard.git
cd Equinox_dashboard
```

### Environment Configuration

The application requires specific environment variables to function. 

#### Frontend (`equinox_frontend/.env`)
Create a `.env` file in the `equinox_frontend` directory. For local development, use:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Equinox OS
VITE_TOKEN_KEY=eq_token
VITE_USERNAME_KEY=eq_username
VITE_ROLE_KEY=eq_role
```

#### Backend (Spring Profiles)
The backend uses Spring Profiles (`dev` and `prod`). By default, the `dev` profile is active and uses an in-memory H2 database requiring no extra configuration.

For **production**, the following environment variables must be provided to the backend hosting environment:

```env
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRATION=86400000
ALLOWED_ORIGINS=https://your-frontend-url.com
```

## Running Locally

You will need two terminal windows to run both the backend and frontend simultaneously.

**1. Start the Backend (API)**
```bash
cd equinox_backend
./mvnw spring-boot:run
```
The backend API will be available at `http://localhost:8080`.

**2. Start the Frontend (UI)**
```bash
cd equinox_frontend
npm install
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

## Production & Deployment

Equinox OS is configured for modern cloud deployment platforms:

- **Frontend:** Deployed globally as a static site via **Render**.
- **Backend:** Containerized via Docker and deployed as a web service on **Render**.
- **Database:** Managed **PostgreSQL** database hosted on Neon.

The repository includes a `render.yaml` blueprint for streamlined backend deployment.

### Live Links

- **Application (Frontend):** [Equinox OS on Render](https://equinox-a4s7.onrender.com)
- **API (Backend):** [Equinox OS API on Render](https://finance-bbackend.onrender.com)
