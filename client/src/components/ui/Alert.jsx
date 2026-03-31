const colorMap = {
  green: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300',
  red:   'bg-red-50   dark:bg-red-900/30   border-red-200   dark:border-red-700   text-red-600   dark:text-red-300',
}

export default function Alert({ children, color = 'green' }) {
  const cls = colorMap[color] ?? colorMap.green
  return (
    <div className={`flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium border ${cls}`}>
      {children}
    </div>
  )
}
