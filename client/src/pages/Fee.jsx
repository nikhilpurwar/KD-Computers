import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, AlertCircle, GraduationCap, CheckCircle, Clock, FileText } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table, { Tr, Td } from '../components/ui/Table'
import { feeHistory, students } from '../data/feeData'

const CURRENT_MONTH = 'June 2025'

export default function Fee() {
  const navigate = useNavigate()

  // local state so status updates are reflected immediately
  const [records, setRecords] = useState(
    feeHistory.filter(f => f.month === CURRENT_MONTH).map(f => ({
      ...f,
      name: students.find(s => s.roll === f.roll)?.name ?? f.roll,
    }))
  )
  const [filter, setFilter] = useState('All')

  const collected = records.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0)
  const pending   = records.filter(f => f.status === 'Pending').reduce((s, f) => s + f.amount, 0)
  const visible   = filter === 'All' ? records : records.filter(f => f.status === filter)

  const markPaid = id => setRecords(r => r.map(f =>
    f.id === id ? { ...f, status: 'Paid', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) } : f
  ))
  const markPending = id => setRecords(r => r.map(f =>
    f.id === id ? { ...f, status: 'Pending', date: '—' } : f
  ))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Wallet}        label="Total Collected" value={`₹${collected}`} color="green"  />
        <StatCard icon={AlertCircle}   label="Pending Amount"  value={`₹${pending}`}   color="red"    />
        <StatCard icon={GraduationCap} label="Total Students"  value={records.length}  color="accent" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">
            Fee Records — {CURRENT_MONTH}
          </span>
          <div className="flex gap-2">
            {['All', 'Paid', 'Pending'].map(f => (
              <button
                key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 ${
                  filter === f
                    ? 'bg-indigo-700 dark:bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Table headers={['#', 'Student', 'Roll No', 'Amount', 'Status', 'Paid On', 'Action']}>
          {visible.map(f => (
            <Tr key={f.id}>
              <Td>{f.id}</Td>

              {/* Clickable name → student report */}
              <Td>
                <button
                  onClick={() => navigate(`/fee-report/${f.roll}`)}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                >
                  {f.name}
                  <FileText size={13} className="opacity-60" />
                </button>
              </Td>

              <Td><span className="font-mono text-xs">{f.roll}</span></Td>
              <Td><span className="font-semibold text-gray-800 dark:text-gray-100">₹{f.amount}</span></Td>
              <Td><Badge label={f.status} color={f.status === 'Paid' ? 'green' : 'red'} /></Td>
              <Td><span className="text-xs">{f.date}</span></Td>

              {/* Action */}
              <Td>
                {f.status === 'Pending' ? (
                  <button
                    onClick={() => markPaid(f.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:opacity-80 transition-opacity"
                  >
                    <CheckCircle size={13} /> Mark Paid
                  </button>
                ) : (
                  <button
                    onClick={() => markPending(f.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:opacity-80 transition-opacity"
                  >
                    <Clock size={13} /> Mark Pending
                  </button>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
