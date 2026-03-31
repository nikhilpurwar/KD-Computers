import { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useTheme } from '../context/ThemeContext'
import {
  Menu, Sun, Moon, UserCircle, ChevronRight,
  GraduationCap, UserPlus, CreditCard, BookOpen, Settings, Clock, LayoutDashboard,
  PanelLeftClose, PanelLeftOpen, BarChart3,
} from 'lucide-react'

const segmentMeta = {
  '':          { label: 'Home',    icon: LayoutDashboard },
  'students':  { label: 'Students',     icon: GraduationCap   },
  'add-student':{ label: 'Add Student', icon: UserPlus        },
  'fee':        { label: 'Fee',         icon: CreditCard  },
  'fee-report': { label: 'Fee Report',  icon: BarChart3   },
  'books':      { label: 'Books',       icon: BookOpen    },
  'settings':  { label: 'Settings',     icon: Settings        },
  'shift':     { label: 'Shift',        icon: Clock           },
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
              <Link to={c.path} className="flex items-center gap-1.5 text-gray-800 dark:text-gray-500 hover:text-blue-700 transition-colors">
                {Icon && <Icon size={15} />}{meta.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const { dark, toggle } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-black">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'lg:ml-16' : 'lg:ml-56'}`}>
        <header className="sticky top-0 z-10 px-4 sm:px-8 md:pt-3 py-4 flex items-center justify-between">
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

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggle}
              className="flex items-center justify-center text-gray-900 dark:text-gray-200 hover:opacity-80 transition-opacity"
              title="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className='flex items-center gap-2 bg-blue-100 dark:bg-white/10 pl-1.5 pr-4 py-1 rounded-full'>
              <div className="w-8 h-8 rounded-full flex items-center justify-center  text-blue-700">
                <UserCircle size={26} />
              </div>
              <span className="text-sm font-medium hidden sm:block text-gray-900 dark:text-gray-300">Ankit</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
