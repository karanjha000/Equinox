import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetsPage from './pages/BudgetsPage'
import UsersPage from './pages/UsersPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace/>}/>
              <Route path="dashboard" element={<DashboardPage/>}/>
              <Route path="transactions" element={<TransactionsPage/>}/>
              <Route path="budgets" element={<BudgetsPage/>}/>
              <Route path="users" element={<ProtectedRoute adminOnly><UsersPage/></ProtectedRoute>}/>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
