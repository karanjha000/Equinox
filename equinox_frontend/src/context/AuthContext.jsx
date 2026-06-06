import React, { createContext, useContext, useState, useCallback } from 'react'

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'fin_token'
const USERNAME_KEY = import.meta.env.VITE_USERNAME_KEY || 'fin_username'
const ROLE_KEY = import.meta.env.VITE_ROLE_KEY || 'fin_role'

const Ctx = createContext(null)
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const username = localStorage.getItem(USERNAME_KEY)
    const role = localStorage.getItem(ROLE_KEY)
    return token ? { token, username, role } : null
  })
  const login = useCallback((token, username, role) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USERNAME_KEY, username)
    localStorage.setItem(ROLE_KEY, role)
    setAuth({ token, username, role })
  }, [])
  const logout = useCallback(() => {
    [TOKEN_KEY, USERNAME_KEY, ROLE_KEY].forEach(k => localStorage.removeItem(k))
    setAuth(null)
  }, [])
  return (
    <Ctx.Provider value={{
      auth,
      login,
      logout,
      isAdmin: auth?.role === 'ADMIN',
      isAnalyst: auth?.role === 'ANALYST' || auth?.role === 'ADMIN',
    }}>
      {children}
    </Ctx.Provider>
  )
}
export const useAuth = () => useContext(Ctx)
