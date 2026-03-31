const colorMap = {
  accent: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  green:  'bg-green-100  dark:bg-green-900/40  text-green-700  dark:text-green-300',
  red:    'bg-red-100    dark:bg-red-900/40    text-red-600    dark:text-red-300',
  orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  blue:   'bg-blue-100   dark:bg-blue-900/40   text-blue-700   dark:text-blue-300',
}

export default function Badge({ label, color = 'accent' }) {
  const cls = colorMap[color] ?? colorMap.accent
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}
