import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, LibraryBig, ArrowRight, ArrowLeft, KeyRound, Sun, Moon, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

// view: 'login' | 'forgot' | 'reset' | 'done'
export default function Login() {
  const { login, resetPassword } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const [view, setView]           = useState('login')
  const [form, setForm]           = useState({ email: '', password: '', remember: false })
  const [forgotEmail, setForgotEmail] = useState('')
  const [newPass, setNewPass]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [showNew, setShowNew]     = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const handle = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  const submitLogin = async e => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      const res = await login(form)
      if (res.ok) navigate('/', { replace: true })
      else setError(res.error)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 1: verify email exists → go to reset form
  const submitForgot = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await resetPassword({ email: forgotEmail, checkOnly: true })
      if (res.ok) setView('reset')
      else setError(res.error)
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: set new password
  const submitReset = async e => {
    e.preventDefault()
    if (newPass.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (newPass !== confirmPass) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await resetPassword({ email: forgotEmail, newPassword: newPass })
      if (res.ok) setView('done')
      else setError(res.error)
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500'

  return (
    <div className="min-h-screen w-full flex bg-slate-100 dark:bg-gray-950 transition-colors duration-200">

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-blue-900 dark:bg-gray-900 p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-800/50 dark:bg-white/5" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-blue-400/10" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-300 flex items-center justify-center">
            <LibraryBig  size={20} className="text-blue-900" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-tight">KD Library</p>
            <p className="text-blue-300 text-xs">Management System</p>
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Manage your<br />library smarter.
            </h1>
            <p className="text-blue-300 text-sm leading-relaxed max-w-xs">
              Track students, fees, books and shifts — all in one place. Built for KD Group.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Student Management', 'Fee Tracking', 'Book Inventory', 'Shift Control'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium">{f}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="relative text-blue-400 text-xs">Developed with ❤️ by Nikhil</p>
          <p className="relative text-blue-400 text-xs">© 2025 KD Group. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="absolute top-5 right-5 w-9 h-9 rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:opacity-80 transition-opacity shadow-sm"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center">
              <LibraryBig  size={18} className="text-blue-300" />
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-100 text-base leading-tight">KD Library</p>
              <p className="text-gray-400 text-xs">Management System</p>
            </div>
          </div>

          {/* ── LOGIN VIEW ── */}
          {view === 'login' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome back</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your admin account</p>
              </div>

              <form onSubmit={submitLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input name="email" type="email" required value={form.email} onChange={handle}
                      placeholder="admin@kdlibrary.com" className={`${inputCls} pl-9 pr-4`} />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input name="password" type={showPass ? 'text' : 'password'} required value={form.password} onChange={handle}
                      placeholder="••••••••" className={`${inputCls} pl-9 pr-10`} />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-600 dark:hover:text-gray-900 transition-colors">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name="remember" checked={form.remember} onChange={handle}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Keep me logged in</span>
                  </label>
                  <button type="button" onClick={() => { setView('forgot'); setError('') }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : <> Sign In <ArrowRight size={16} /> </>}
                </button>
              </form>


            </div>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {view === 'forgot' && (
            <div className="space-y-8">
              <div>
                <button onClick={() => { setView('login'); setError('') }}
                  className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:opacity-80 font-medium mb-4">
                  <ArrowLeft size={15} /> Back to Sign In
                </button>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
                  <KeyRound size={22} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Forgot password?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enter your registered admin email to continue.
                </p>
              </div>
              <form onSubmit={submitForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" required value={forgotEmail} onChange={e => { setForgotEmail(e.target.value); setError('') }}
                      placeholder="admin@kdlibrary.com" className={`${inputCls} pl-9 pr-4`} />
                  </div>
                </div>
                {error && (
                  <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</p>
                )}
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
                  {loading ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <> Continue <ArrowRight size={16} /> </>}
                </button>
              </form>
            </div>
          )}

          {/* ── RESET PASSWORD VIEW ── */}
          {view === 'reset' && (
            <div className="space-y-8">
              <div>
                <button onClick={() => { setView('forgot'); setError('') }}
                  className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:opacity-80 font-medium mb-4">
                  <ArrowLeft size={15} /> Back
                </button>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
                  <KeyRound size={22} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Set new password</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">For <span className="font-medium text-blue-600 dark:text-blue-400">{forgotEmail}</span></p>
              </div>
              <form onSubmit={submitReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showNew ? 'text' : 'password'} required value={newPass} onChange={e => { setNewPass(e.target.value); setError('') }}
                      placeholder="Min. 6 characters" className={`${inputCls} pl-9 pr-10`} />
                    <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showNew ? 'text' : 'password'} required value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setError('') }}
                      placeholder="Repeat new password" className={`${inputCls} pl-9 pr-4`} />
                  </div>
                </div>
                {error && (
                  <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</p>
                )}
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
                  {loading ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <> Reset Password <ArrowRight size={16} /> </>}
                </button>
              </form>
            </div>
          )}

          {/* ── DONE VIEW ── */}
          {view === 'done' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <CheckCircle size={30} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Password reset!</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">You can now sign in with your new password.</p>
              </div>
              <button
                onClick={() => { setView('login'); setForgotEmail(''); setNewPass(''); setConfirmPass('') }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors">
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
