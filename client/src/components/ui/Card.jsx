export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-white/10 rounded-xl border border-gray-300 dark:border-gray-700 flex flex-col min-h-0 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
