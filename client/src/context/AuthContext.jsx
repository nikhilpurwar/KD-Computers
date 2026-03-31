import { createContext, useContext, useState } from 'react'
import api from '../API/index'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user') || sessionStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch { return null }
  })

  const login = async ({ email, password, remember }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const store = remember ? localStorage : sessionStorage
      store.setItem('token', data.token)
      store.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message ?? 'Login failed.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setUser(null)
  }

  const changePassword = async ({ current, next }) => {
    try {
      const { data } = await api.put('/auth/password', { current, next })
      return { ok: true, message: data.message }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message ?? 'Failed to update password.' }
    }
  }

  const resetPassword = async ({ email, newPassword }) => {
    try {
      const { data } = await api.post('/auth/reset-password', { email, newPassword })
      return { ok: true, message: data.message }
    } catch (err) {
      return { ok: false, error: err.response?.data?.message ?? 'Reset failed.' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
