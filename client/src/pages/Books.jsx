import { useState } from 'react'
import { BookOpen, BookCheck, BookX } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table, { Tr, Td } from '../components/ui/Table'
import { SearchInput } from '../components/ui/FormField'

const books = [
  { id: 1, title: 'The Alchemist',     author: 'Paulo Coelho',       category: 'Fiction',   total: 3, available: 2 },
  { id: 2, title: 'Wings of Fire',     author: 'A.P.J. Abdul Kalam', category: 'Biography', total: 5, available: 5 },
  { id: 3, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki',    category: 'Finance',   total: 4, available: 1 },
  { id: 4, title: 'Atomic Habits',     author: 'James Clear',        category: 'Self-Help', total: 6, available: 4 },
  { id: 5, title: 'Deep Work',         author: 'Cal Newport',        category: 'Self-Help', total: 3, available: 0 },
  { id: 6, title: 'Sapiens',           author: 'Yuval Noah Harari',  category: 'History',   total: 4, available: 3 },
]

const catColor = { Fiction: 'purple', Biography: 'blue', Finance: 'green', 'Self-Help': 'yellow', History: 'orange' }

export default function Books() {
  const [search, setSearch] = useState('')
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={BookOpen}  label="Total Books"  value={books.reduce((s, b) => s + b.total, 0)}                 color="accent" />
        <StatCard icon={BookCheck} label="Available"    value={books.reduce((s, b) => s + b.available, 0)}             color="green" />
        <StatCard icon={BookX}     label="Issued / Out" value={books.reduce((s, b) => s + (b.total - b.available), 0)} color="orange" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Book Inventory</span>
          <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or author..." />
        </div>

        <Table
          headers={['#', 'Title', 'Author', 'Category', 'Total', 'Available', 'Status']}
          empty={filtered.length === 0 ? 'No books found.' : null}
        >
          {filtered.map(b => (
            <Tr key={b.id}>
              <Td>{b.id}</Td>
              <Td><span className="font-medium text-gray-800 dark:text-gray-100">{b.title}</span></Td>
              <Td>{b.author}</Td>
              <Td><Badge label={b.category} color={catColor[b.category] ?? 'accent'} /></Td>
              <Td>{b.total}</Td>
              <Td><span className="font-semibold text-gray-800 dark:text-gray-100">{b.available}</span></Td>
              <Td><Badge label={b.available === 0 ? 'Out of Stock' : 'In Stock'} color={b.available === 0 ? 'red' : 'green'} /></Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
