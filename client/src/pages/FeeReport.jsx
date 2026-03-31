import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, GraduationCap, Wallet, AlertCircle,
  CheckCircle, Clock, CalendarDays, BarChart3, TrendingUp,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import StatCard from '../components/ui/StatCard'
import Table, { Tr, Td } from '../components/ui/Table'
import { feeHistory, students } from '../data/feeData'

const TABS = ['Monthly', 'Yearly', 'All Students']

/* ── helpers ── */
const byYear  = records => [...new Set(records.map(r => r.ym.slice(0, 4)))].sort().reverse()
const byMonth = (records, year) => records.filter(r => r.ym.startsWith(year))

/* ── Student Report (drill-down) ── */
function StudentReport({ roll }) {
  const navigate  = useNavigate()
  const student   = students.find(s => s.roll === roll)
  const records   = feeHistory.filter(r => r.roll === roll)
  const [tab, setTab] = useState('Monthly')
  const [year, setYear] = useState('2025')

  if (!student) return (
    <div className="text-center py-20 text-gray-400 dark:text-gray-500">Student not found.</div>
  )

  const paid    = records.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0)
  const pending = records.filter(r => r.status === 'Pending').reduce((s, r) => s + r.amount, 0)
  const paidCount = records.filter(r => r.status === 'Paid').length

  const years   = byYear(records)
  const monthly = byMonth(records, year)

  const visible = tab === 'Monthly' ? monthly : records

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate('/fee-report')}
        className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:opacity-80 font-medium"
      >
        <ArrowLeft size={16} /> Back to Fee Report
      </button>

      {/* Student Info */}
      <Card>
        <div className="px-6 py-4 bg-indigo-900 dark:bg-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-yellow-400 dark:bg-indigo-600 flex items-center justify-center text-indigo-900 dark:text-white font-bold text-lg">
              {student.name[0]}
            </div>
            <div>
              <p className="text-white font-bold text-base">{student.name}</p>
              <p className="text-indigo-300 dark:text-gray-400 text-xs">{student.roll} · {student.shift} Shift</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              pending > 0
                ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300'
                : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
            }`}>
              {pending > 0 ? `₹${pending} Due` : 'All Clear ✓'}
            </span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Wallet}       label="Total Paid"    value={`₹${paid}`}    color="green"  />
        <StatCard icon={AlertCircle}  label="Total Pending" value={`₹${pending}`} color="red"    />
        <StatCard icon={CheckCircle}  label="Months Paid"   value={paidCount}     color="accent" />
        <StatCard icon={Clock}        label="Months Due"    value={records.length - paidCount} color="orange" />
      </div>

      {/* Tabs */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            {['Monthly', 'All Time'].map(t => (
              <button
                key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 ${
                  tab === t
                    ? 'bg-indigo-700 dark:bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === 'Monthly' && (
            <select
              value={year} onChange={e => setYear(e.target.value)}
              className="rounded-lg px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none"
            >
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
          )}
        </div>

        <Table headers={['Month', 'Amount', 'Status', 'Paid On']}>
          {visible.map(r => (
            <Tr key={r.id}>
              <Td><span className="font-medium text-gray-800 dark:text-gray-100">{r.month}</span></Td>
              <Td><span className="font-semibold text-gray-800 dark:text-gray-100">₹{r.amount}</span></Td>
              <Td><Badge label={r.status} color={r.status === 'Paid' ? 'green' : 'red'} /></Td>
              <Td><span className="text-xs">{r.date}</span></Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

/* ── Overview Report (all students) ── */
function OverviewReport() {
  const navigate  = useNavigate()
  const [tab, setTab]   = useState('Monthly')
  const [year, setYear] = useState('2025')
  const [month, setMonth] = useState('2025-06')

  const years  = byYear(feeHistory)
  const months = [...new Set(feeHistory.map(r => r.ym))].sort().reverse()

  const filtered = tab === 'Monthly'
    ? feeHistory.filter(r => r.ym === month)
    : tab === 'Yearly'
    ? feeHistory.filter(r => r.ym.startsWith(year))
    : feeHistory

  const totalCollected = filtered.filter(r => r.status === 'Paid').reduce((s, r) => s + r.amount, 0)
  const totalPending   = filtered.filter(r => r.status === 'Pending').reduce((s, r) => s + r.amount, 0)

  // per-student summary for yearly/all
  const studentSummary = students.map(s => {
    const recs    = filtered.filter(r => r.roll === s.roll)
    const paid    = recs.filter(r => r.status === 'Paid').reduce((a, r) => a + r.amount, 0)
    const pending = recs.filter(r => r.status === 'Pending').reduce((a, r) => a + r.amount, 0)
    return { ...s, paid, pending, total: recs.length }
  })

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Wallet}       label="Collected" value={`₹${totalCollected}`} color="green"  />
        <StatCard icon={AlertCircle}  label="Pending"   value={`₹${totalPending}`}   color="red"    />
        <StatCard icon={TrendingUp}   label="Total"     value={`₹${totalCollected + totalPending}`} color="accent" />
      </div>

      {/* Tabs + filters */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            {['Monthly', 'Yearly', 'All Time'].map(t => (
              <button
                key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 ${
                  tab === t
                    ? 'bg-indigo-700 dark:bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {tab === 'Monthly' && (
              <select
                value={month} onChange={e => setMonth(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            )}
            {tab === 'Yearly' && (
              <select
                value={year} onChange={e => setYear(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none"
              >
                {years.map(y => <option key={y}>{y}</option>)}
              </select>
            )}
          </div>
        </div>

        {/* Monthly view — flat records */}
        {tab === 'Monthly' && (
          <Table headers={['Student', 'Roll No', 'Amount', 'Status', 'Paid On', 'Report']}>
            {filtered.map(r => {
              const s = students.find(st => st.roll === r.roll)
              return (
                <Tr key={r.id}>
                  <Td>
                    <button
                      onClick={() => navigate(`/fee-report/${r.roll}`)}
                      className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {s?.name}
                    </button>
                  </Td>
                  <Td><span className="font-mono text-xs">{r.roll}</span></Td>
                  <Td><span className="font-semibold text-gray-800 dark:text-gray-100">₹{r.amount}</span></Td>
                  <Td><Badge label={r.status} color={r.status === 'Paid' ? 'green' : 'red'} /></Td>
                  <Td><span className="text-xs">{r.date}</span></Td>
                  <Td>
                    <button
                      onClick={() => navigate(`/fee-report/${r.roll}`)}
                      className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400 hover:opacity-80"
                    >
                      <BarChart3 size={13} /> View
                    </button>
                  </Td>
                </Tr>
              )
            })}
          </Table>
        )}

        {/* Yearly / All Time — per-student summary */}
        {(tab === 'Yearly' || tab === 'All Time') && (
          <Table headers={['Student', 'Roll No', 'Shift', 'Paid', 'Pending', 'Months', 'Report']}>
            {studentSummary.map(s => (
              <Tr key={s.roll}>
                <Td>
                  <button
                    onClick={() => navigate(`/fee-report/${s.roll}`)}
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {s.name}
                  </button>
                </Td>
                <Td><span className="font-mono text-xs">{s.roll}</span></Td>
                <Td><Badge label={s.shift} color="accent" /></Td>
                <Td><span className="font-semibold text-green-600 dark:text-green-400">₹{s.paid}</span></Td>
                <Td><span className="font-semibold text-red-500 dark:text-red-400">₹{s.pending}</span></Td>
                <Td>{s.total}</Td>
                <Td>
                  <button
                    onClick={() => navigate(`/fee-report/${s.roll}`)}
                    className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400 hover:opacity-80"
                  >
                    <BarChart3 size={13} /> View
                  </button>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  )
}

/* ── Main export — routes to student or overview ── */
export default function FeeReport() {
  const { roll } = useParams()
  return roll ? <StudentReport roll={roll} /> : <OverviewReport />
}
