import { useState, useRef, useEffect } from 'react'
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import {
  Menu, Sun, Moon, UserCircle, ChevronRight,
  GraduationCap, UserPlus, CreditCard, BookOpen, Settings, Clock, LayoutDashboard,
  PanelLeftClose, PanelLeftOpen, BarChart3, LogOut, KeyRound, X, Eye, EyeOff, CheckCircle, Heart,
} from 'lucide-react'

const segmentMeta = {
  '':           { label: 'Home',         icon: LayoutDashboard },
  'dashboard':  { label: 'Dashboard',    icon: LayoutDashboard },
  'students':   { label: 'Students',     icon: GraduationCap   },
  'add-student':{ label: 'Add Student',  icon: UserPlus        },
  'fee':        { label: 'Fee',          icon: CreditCard      },
  'fee-report': { label: 'Fee Report',   icon: BarChart3       },
  'books':      { label: 'Books',        icon: BookOpen        },
  'settings':   { label: 'Settings',     icon: Settings        },
  'shift':      { label: 'Shift',        icon: Clock           },
}

function Breadcrumb({ pathname }) {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = [
    { key: '', path: '/' },
    ...segments.map((seg, i) => ({ key: seg, path: '/' + segments.slice(0, i + 1).join('/') }))
  ]
  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((c, i) => {
        const meta = segmentMeta[c.key] || { label: c.key.replace(/-/g, ' ').replace(/\b\w/g, x => x.toUpperCase()), icon: null }
        const Icon = meta.icon
        const isLast = i === crumbs.length - 1
        return (
          <span key={c.path} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} className="text-gray-300 dark:text-gray-600" />}
            {isLast ? (
              <span className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-gray-100">
                {Icon && <Icon size={15} />}{meta.label}
              </span>
            ) : (
              <Link to={c.path} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500 hover:text-blue-600 transition-colors">
                {Icon && <Icon size={15} />}{meta.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

/* ── Change Password Modal ── */
function ChangePasswordModal({ onClose }) {
  const { changePassword } = useAuth()
  const [form, setForm]   = useState({ current: '', next: '', confirm: '' })
  const [show, setShow]   = useState({ current: false, next: false, confirm: false })
  const [error, setError] = useState('')
  const [done, setDone]   = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError('') }
  const toggleShow = k => setShow(s => ({ ...s, [k]: !s[k] }))

  const submit = async e => {
    e.preventDefault()
    if (form.next !== form.confirm) { setError('New passwords do not match.'); return }
    setLoading(true)
    const res = await changePassword({ current: form.current, next: form.next })
    setLoading(false)
    if (!res.ok) { setError(res.error); return }
    setDone(true)
    setTimeout(onClose, 1800)
  }

  const fieldCls = 'w-full pr-10 pl-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm outline-none focus:border-blue-400 transition-colors'
  const labelCls = 'text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <KeyRound size={17} className="text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-gray-800 dark:text-gray-100">Change Password</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {done ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Password updated!</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {[['current', 'Current Password'], ['next', 'New Password'], ['confirm', 'Confirm New Password']].map(([name, label]) => (
                <div key={name} className="space-y-1.5">
                  <label className={labelCls}>{label}</label>
                  <div className="relative">
                    <input
                      name={name}
                      type={show[name] ? 'text' : 'password'}
                      required
                      value={form[name]}
                      onChange={handle}
                      placeholder="••••••••"
                      className={fieldCls}
                    />
                    <button type="button" onClick={() => toggleShow(name)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      {show[name] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              {error && (
                <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : 'Update'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Profile Dropdown ── */
function ProfileDropdown({ user, onChangePw, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-blue-100 dark:bg-white/10 pl-1.5 pr-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
          <UserCircle size={20} />
        </div>
        <span className="text-sm font-medium hidden sm:block text-gray-800 dark:text-gray-200">{user?.name}</span>
        <ChevronRight size={14} className={`text-gray-400 transition-transform hidden sm:block ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user?.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
            {/* <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {user?.role}
            </span> */}
          </div>

          {/* Actions */}
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => { setOpen(false); onChangePw() }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
            >
              <KeyRound size={15} className="text-blue-500" /> Change Password
            </button>
            <button
              onClick={() => { setOpen(false); onLogout() }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Layout ── */
export default function Layout() {
  const { pathname }     = useLocation()
  const { dark, toggle } = useTheme()
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [collapsed, setCollapsed]       = useState(false)
  const [changePwOpen, setChangePwOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-200">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />

      {/* Content column — fills remaining width, locked to viewport height */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-56'}`}>

        {/* Sticky header — never scrolls */}
        <header className="flex-shrink-0 sticky top-0 z-10 px-4 md:px-8 md:pt-4 py-3 flex items-center justify-between bg-white dark:bg-gray-950 transition-100">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:opacity-80"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <button
              className="hidden lg:flex p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:opacity-80"
              onClick={() => setCollapsed(c => !c)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <Breadcrumb pathname={pathname} />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggle}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-800 dark:text-gray-100 hover:opacity-80 transition-opacity"
              title="Toggle theme"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <ProfileDropdown
              user={user}
              onChangePw={() => setChangePwOpen(true)}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Page content — fills remaining height, pages manage their own scroll */}
        <main className="flex-1 min-h-0 overflow-hidden p-4 sm:px-6 lg:px-8 pb-4">
          <Outlet />
        </main>

      </div>

      {changePwOpen && <ChangePasswordModal onClose={() => setChangePwOpen(false)} />}
    </div>
  )
}
