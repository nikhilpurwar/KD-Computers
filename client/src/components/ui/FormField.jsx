import { Search, Plus } from 'lucide-react'

const inputCls = 'w-full rounded-lg px-3 py-2.5 text-sm outline-none border border-gray-200 dark:border-gray-600 bg-white dark:bg-white/10 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors'

export function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </label>
      {children}
    </div>
  )
}

export function Input({ className = '', ...props }) {
  return <input className={`${inputCls} ${className}`} {...props} />
}

export function Select({ children, className = '', ...props }) {
  return (
    <select className={`${inputCls} ${className}`} {...props}>
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`${inputCls} resize-none ${className}`} {...props} />
}

export function SearchInput({ className = '', ...props }) {
  return (
    <div
      className={`relative w-full sm:w-56 rounded-lg
        bg-white dark:bg-white/10
        
        border border-gray-200 dark:border-gray-600
        
        focus-within:ring-2 focus-within:ring-blue-700
        focus-within:border-transparent
        
        transition-all duration-200
        flex items-center
  
  ${className}`}
    >
      {/* Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>

      {/* Input */}
      <input
        className="w-full pl-10 pr-3 py-1.5 text-sm rounded-lg
          bg-transparent
          text-gray-800 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          outline-none"
        {...props}
      />
    </div>
  )
}
