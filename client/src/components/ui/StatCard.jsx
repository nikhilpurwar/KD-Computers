const colorMap = {
  accent: { wrap: 'bg-indigo-50 dark:bg-indigo-900/40', icon: 'text-indigo-600 dark:text-indigo-400' },
  green:  { wrap: 'bg-green-50  dark:bg-green-900/40',  icon: 'text-green-600  dark:text-green-400'  },
  red:    { wrap: 'bg-red-50    dark:bg-red-900/40',    icon: 'text-red-600    dark:text-red-400'    },
  orange: { wrap: 'bg-orange-50 dark:bg-orange-900/40', icon: 'text-orange-600 dark:text-orange-400' },
  yellow: { wrap: 'bg-yellow-50 dark:bg-yellow-900/40', icon: 'text-yellow-600 dark:text-yellow-400' },
  purple: { wrap: 'bg-purple-50 dark:bg-purple-900/40', icon: 'text-purple-600 dark:text-purple-400' },
  blue:   { wrap: 'bg-blue-50   dark:bg-blue-900/40',   icon: 'text-blue-600   dark:text-blue-400'   },
}

// icon — a lucide-react component e.g. icon={GraduationCap}
export default function StatCard({ icon: Icon, label, value, color = 'accent' }) {
  const c = colorMap[color] ?? colorMap.accent
  return (
    <div className="bg-white dark:bg-white/10 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 flex items-center gap-4">
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.wrap} ${c.icon}`}>
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  )
}
