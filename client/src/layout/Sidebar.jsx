import { useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  GraduationCap, UserPlus, CreditCard, BookOpen,
  Settings, Clock, ChevronRight, ChevronLeft,
  ChevronDown, X, Library, BarChart3,
} from 'lucide-react'

const navItems = [
  { to: '/students',    icon: GraduationCap, label: 'Students'    },
  { to: '/add-student', icon: UserPlus,      label: 'Add Student' },
  { to: '/fee',         icon: CreditCard,    label: 'Fee'         },
  { to: '/fee-report',  icon: BarChart3,     label: 'Fee Report'  },
  { to: '/books',       icon: BookOpen,      label: 'Books'       },
]

const settingsChildren = [
  { to: '/settings/shift', icon: Clock, label: 'Shift' },
]

function HoverTooltip({ label, children, collapsed }) {
  const [visible, setVisible] = useState(false)
  const [top, setTop]         = useState(0)
  const ref                   = useRef(null)
  const timer                 = useRef(null)

  if (!collapsed) return children

  const show = () => { clearTimeout(timer.current); setTop(ref.current?.getBoundingClientRect().top ?? 0); setVisible(true) }
  const hide = () => { timer.current = setTimeout(() => setVisible(false), 80) }

  return (
    <div ref={ref} onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <div
          className="fixed z-50 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap pointer-events-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-lg"
          style={{ left: 72, top }}
        >
          {label}
        </div>
      )}
    </div>
  )
}

function SettingsPopover({ collapsed, settingsOpen, setSettingsOpen, onClose }) {
  const [visible, setVisible] = useState(false)
  const [top, setTop]         = useState(0)
  const ref                   = useRef(null)
  const timer                 = useRef(null)
  const navigate              = useNavigate()

  const show = () => { clearTimeout(timer.current); setTop(ref.current?.getBoundingClientRect().top ?? 0); setVisible(true) }
  const hide = () => { timer.current = setTimeout(() => setVisible(false), 80) }

  if (!collapsed) {
    return (
      <>
        <button
          onClick={() => setSettingsOpen(o => !o)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left text-blue-200 dark:text-slate-400 hover:opacity-80 transition-opacity"
        >
          <Settings size={18} className="flex-shrink-0" />
          <span className="flex-1">Settings</span>
          <ChevronDown size={14} className={`transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
        </button>
        {settingsOpen && (
          <div className="ml-4 flex flex-col gap-1">
            {settingsChildren.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to} to={to} onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-400 dark:bg-blue-600 text-blue-900 dark:text-white'
                      : 'text-blue-300 dark:text-slate-500 hover:opacity-80'
                  }`
                }
              >
                <Icon size={14} />{label}
              </NavLink>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <div ref={ref} onMouseEnter={show} onMouseLeave={hide}>
      <button className="w-full flex items-center justify-center py-2.5 rounded-lg text-blue-200 dark:text-slate-400 hover:opacity-80 transition-opacity">
        <Settings size={20} />
      </button>

      {visible && (
        <>
          <div className="fixed z-40" style={{ left: 64, top, width: 12, height: 100 }} onMouseEnter={show} onMouseLeave={hide} />
          <div
            className="fixed z-50 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl"
            style={{ left: 76, top, minWidth: 160 }}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            <p className="px-3 pt-2.5 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Settings
            </p>
            {settingsChildren.map(({ to, icon: Icon, label }) => (
              <button
                key={to}
                onClick={() => { navigate(to); onClose(); setVisible(false) }}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon size={14} />{label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <aside
      className={`
        fixed top-0 left-0 z-30 h-full flex flex-col
        bg-gradient-to-t from-blue-950 via-blue-800 to-blue-700
        dark:bg-gradient-to-b dark:from-white/10 dark:via-white/5 dark:to-white/1
        backdrop-blur-xl
        transition-all duration-300
        lg:translate-x-0 
        ${open ? 'translate-x-0' : '-translate-x-full'}
        ${collapsed ? 'w-16' : 'w-56 rounded-tr-3xl rounded-br-3xl'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-white/10 dark:border-gray-700 min-h-[64px]">
        <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-lg font-bold text-white dark:text-white">
          KD
        </div>
        {!collapsed && (
          <div className="flex-1 ml-3 overflow-hidden">
            <p className="font-bold text-sm leading-tight text-white truncate">KD Library</p>
            <p className="text-xs text-blue-300 dark:text-slate-400 truncate">Management System</p>
          </div>
        )}
        
        <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1 ml-1">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2 py-4 flex-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ to, icon: Icon, label }) => (
          <HoverTooltip key={to} label={label} collapsed={collapsed}>
            <NavLink
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-sm font-medium transition-all duration-150 text-blue-200 dark:text-slate-400
                ${collapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'}
                ${isActive
                  ? 'bg-white/10'
                  : ' hover:opacity-80'
                }`
              }
            >
              <Icon size={19} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          </HoverTooltip>
        ))}

        <SettingsPopover
          collapsed={collapsed}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          onClose={onClose}
        />
      </nav>

      {!collapsed && (
        <div className="px-4 py-3 text-xs border-t border-white/10 dark:border-gray-700 text-gray-500 dark:text-gray-600">
          © 2025 KD Group
        </div>
      )}
    </aside>
  )
}
