export default function Table({ headers, children, empty }) {
  return (
    <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
      <div className="overflow-auto flex-1 min-h-0">
        <table className="w-full text-sm min-w-[540px]">
          <thead className="bg-blue-100 dark:bg-white/10 border-b-2 border-gray-400 dark:border-gray-700 sticky top-0 z-10">
            <tr>
              {headers.map(h => (
                <th
                  key={h}
                  className="px-4 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700/60">
            {children}
          </tbody>
        </table>
        {empty && (
          <p className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">{empty}</p>
        )}
      </div>
    </div>
  )
}

export function Tr({ children }) {
  return (
    <tr className="hover:bg-indigo-50/40 dark:hover:bg-gray-800/60 transition-colors">
      {children}
    </tr>
  )
}

export function Td({ children, className = '' }) {
  return (
    <td className={`px-4 sm:px-6 py-3 text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </td>
  )
}
