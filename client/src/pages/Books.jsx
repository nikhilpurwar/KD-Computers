import { useState } from 'react'
import { BookOpen, BookCheck, BookX, Loader2 } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table, { Tr, Td } from '../components/ui/Table'
import { SearchInput } from '../components/ui/FormField'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

const catColor = { Fiction: 'purple', Biography: 'blue', Finance: 'green', 'Self-Help': 'yellow', History: 'orange' }

export default function Books() {
  const [search, setSearch]           = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const { items: books, total, loading, initial, sentinelRef } = useInfiniteScroll({
    endpoint: '/books',
    params:   debouncedSearch ? { search: debouncedSearch } : {},
  })

  const handleSearch = e => {
    const v = e.target.value
    setSearch(v)
    clearTimeout(window._bookSearchTimer)
    window._bookSearchTimer = setTimeout(() => setDebouncedSearch(v), 300)
  }

  const totalCopies    = books.reduce((s, b) => s + b.total, 0)
  const totalAvailable = books.reduce((s, b) => s + b.available, 0)
  const totalIssued    = books.reduce((s, b) => s + (b.total - b.available), 0)

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
        <StatCard icon={BookOpen}  label="Total Books"  value={total}          color="accent" />
        <StatCard icon={BookCheck} label="Available"    value={totalAvailable} color="green"  />
        <StatCard icon={BookX}     label="Issued / Out" value={totalIssued}    color="orange" />
      </div>

      <Card className="flex-1 min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Book Inventory</span>
          <SearchInput value={search} onChange={handleSearch} placeholder="Search title or author..." />
        </div>

        <Table
          headers={['#', 'Title', 'Author', 'Category', 'Total', 'Available', 'Status']}
          empty={!initial && !loading && books.length === 0 ? 'No books found.' : null}
        >
          {books.map((b, i) => (
            <Tr key={b._id}>
              <Td>{i + 1}</Td>
              <Td><span className="font-medium text-gray-800 dark:text-gray-100">{b.title}</span></Td>
              <Td>{b.author}</Td>
              <Td><Badge label={b.category} color={catColor[b.category] ?? 'accent'} /></Td>
              <Td>{b.total}</Td>
              <Td><span className="font-semibold text-gray-800 dark:text-gray-100">{b.available}</span></Td>
              <Td><Badge label={b.available === 0 ? 'Out of Stock' : 'In Stock'} color={b.available === 0 ? 'red' : 'green'} /></Td>
            </Tr>
          ))}
        </Table>

        <div ref={sentinelRef} className="h-1" />
        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 size={20} className="animate-spin text-blue-500" />
          </div>
        )}
      </Card>
    </div>
  )
}
