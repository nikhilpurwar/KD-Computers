import { useState } from 'react'
import { GraduationCap, CheckCircle, Clock, Plus } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table, { Tr, Td } from '../components/ui/Table'
import { SearchInput } from '../components/ui/FormField'
import { useNavigate } from 'react-router-dom'

const students = [
  { id: 1, name: 'Arjun Sharma', roll: 'LIB001', shift: 'Morning', phone: '9876543210', fee: 'Paid', joined: '01 Jan 2025' },
  { id: 2, name: 'Priya Singh', roll: 'LIB002', shift: 'Evening', phone: '9123456780', fee: 'Pending', joined: '15 Jan 2025' },
  { id: 3, name: 'Rahul Verma', roll: 'LIB003', shift: 'Morning', phone: '9988776655', fee: 'Paid', joined: '20 Jan 2025' },
  { id: 4, name: 'Sneha Patel', roll: 'LIB004', shift: 'Afternoon', phone: '9871234560', fee: 'Paid', joined: '05 Feb 2025' },
  { id: 5, name: 'Mohit Yadav', roll: 'LIB005', shift: 'Night', phone: '9765432100', fee: 'Pending', joined: '10 Feb 2025' },
]

const shiftColor = { Morning: 'blue', Afternoon: 'orange', Evening: 'purple', Night: 'accent' }

export default function Students() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={GraduationCap} label="Total Students" value={students.length} color="accent" />
        <StatCard icon={CheckCircle} label="Fee Paid" value={students.filter(s => s.fee === 'Paid').length} color="green" />
        <StatCard icon={Clock} label="Fee Pending" value={students.filter(s => s.fee === 'Pending').length} color="red" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">All Students</span>
          <div className='flex gap-4'>
            <SearchInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or roll..." />
            <button onClick={()=> navigate('/add-student')} className="flex items-center bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
              <Plus size={16} className="inline-block mr-1" />
              Add Student
            </button>
          </div>
        </div>
        <Table
          headers={['#', 'Name', 'Roll No', 'Shift', 'Phone', 'Fee Status', 'Joined']}
          empty={filtered.length === 0 ? 'No students found.' : null}
        >
          {filtered.map(s => (
            <Tr key={s.id}>
              <Td>{s.id}</Td>
              <Td><span className="font-medium text-gray-800 dark:text-gray-100">{s.name}</span></Td>
              <Td><span className="font-mono text-xs">{s.roll}</span></Td>
              <Td><Badge label={s.shift} color={shiftColor[s.shift]} /></Td>
              <Td>{s.phone}</Td>
              <Td><Badge label={s.fee} color={s.fee === 'Paid' ? 'green' : 'red'} /></Td>
              <Td><span className="text-xs">{s.joined}</span></Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
