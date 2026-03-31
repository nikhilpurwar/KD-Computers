import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, AlertCircle, GraduationCap, CheckCircle, Clock, FileText, Loader2 } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table, { Tr, Td } from '../components/ui/Table'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import api from '../API/index'

const CURRENT_MONTH = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })

export default function Fee() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  const { items: records, setItems, total, loading, initial, sentinelRef } = useInfiniteScroll({
    endpoint: '/fees',
    params:   { month: CURRENT_MONTH, ...(filter !== 'All' ? { status: filter } : {}) },
  })

  const collected = records.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0)
  const pending   = records.filter(f => f.status === 'Pending').reduce((s, f) => s + f.amount, 0)

  const updateStatus = async (id, status) => {
    const { data } = await api.patch(`/fees/${id}/status`, { status })
    setItems(prev => prev.map(f => f._id === id ? data : f))
  }

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
        <StatCard icon={Wallet}        label="Total Collected" value={`₹${collected}`} color="green"  />
        <StatCard icon={AlertCircle}   label="Pending Amount"  value={`₹${pending}`}   color="red"    />
        <StatCard icon={GraduationCap} label="Total Students"  value={total}           color="accent" />
      </div>

      <Card className="flex-1 min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Fee Records — {CURRENT_MONTH}</span>
          <div className="flex gap-2">
            {['All', 'Paid', 'Pending'].map(f => (
              <button
                key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 ${
                  filter === f ? 'bg-blue-700 dark:bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Table
          headers={['#', 'Student', 'Roll No', 'Amount', 'Status', 'Paid On', 'Action']}
          empty={!initial && !loading && records.length === 0 ? 'No fee records found.' : null}
        >
          {records.map((f, i) => (
            <Tr key={f._id}>
              <Td>{i + 1}</Td>
              <Td>
                <button
                  onClick={() => navigate(`/fee-report/${f.roll}`)}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                >
                  {f.roll} <FileText size={13} className="opacity-60" />
                </button>
              </Td>
              <Td><span className="font-mono text-xs">{f.roll}</span></Td>
              <Td><span className="font-semibold text-gray-800 dark:text-gray-100">₹{f.amount}</span></Td>
              <Td><Badge label={f.status} color={f.status === 'Paid' ? 'green' : 'red'} /></Td>
              <Td><span className="text-xs">{f.date}</span></Td>
              <Td>
                {f.status === 'Pending' ? (
                  <button
                    onClick={() => updateStatus(f._id, 'Paid')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:opacity-80"
                  >
                    <CheckCircle size={13} /> Mark Paid
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(f._id, 'Pending')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:opacity-80"
                  >
                    <Clock size={13} /> Mark Pending
                  </button>
                )}
              </Td>
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
