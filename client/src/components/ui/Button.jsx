export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center text-sm font-semibold transition-opacity hover:opacity-85 cursor-pointer'

  const variants = {
    primary: 'bg-blue-700 text-white border-none px-5 py-2.5 rounded-lg',
    outline: 'bg-transparent text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 px-5 py-2.5 rounded-lg',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
