import axios from 'axios'

// In production (Vercel) VITE_API_URL is set to https://kd-computers.onrender.com
// In local dev it's undefined, so we fall back to '/api' which Vite proxies to localhost:5000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    const isAuthRoute = ['/auth/login', '/auth/reset-password'].includes(err.config?.url)
    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
