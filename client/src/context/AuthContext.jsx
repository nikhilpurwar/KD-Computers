import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const DEMO_USER = { name: 'Ankit', email: 'admin@kdlibrary.com', role: 'Admin' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const login = ({ email, password, remember }) => {
    // Demo: accept any non-empty credentials
    if (!email || !password) return { ok: false, error: 'Enter email and password.' }
    const u = { ...DEMO_USER, email }
    if (remember) localStorage.setItem('user', JSON.stringify(u))
    else          sessionStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    setUser(null)
  }

  const changePassword = ({ current, next }) => {
    if (!current || !next) return { ok: false, error: 'Fill all fields.' }
    if (next.length < 6)   return { ok: false, error: 'Password must be at least 6 characters.' }
    return { ok: true }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
