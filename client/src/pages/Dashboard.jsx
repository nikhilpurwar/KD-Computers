import { useNavigate } from 'react-router-dom'
import {
  GraduationCap, BookOpen, CreditCard, Clock,
  TrendingUp, AlertCircle, CheckCircle, Users,
  BookCheck, Armchair, ArrowRight, Loader2,
  BarChart3, Wallet, BookX,
} from 'lucide-react'
import { useGetStudentsQuery, useGetFeesQuery, useGetBooksQuery, useGetShiftsQuery } from '../redux/apiSlice'
import { useAuth } from '../context/AuthContext'

const CURRENT_MONTH = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
const shiftIcon = { Morning: '🌅', Afternoon: '☀️', Evening: '🌆', Night: '🌙' }

function StatBox({ icon: Icon, label, value, sub, color, onClick }) {
  const colors = {
    blue:   { bg: 'bg-blue-50 dark:bg-blue-900/30',   icon: 'text-blue-600 dark:text-blue-400',   border: 'border-blue-100 dark:border-blue-800' },
    green:  { bg: 'bg-green-50 dark:bg-green-900/30', icon: 'text-green-600 dark:text-green-400', border: 'border-green-100 dark:border-green-800' },
    red:    { bg: 'bg-red-50 dark:bg-red-900/30',     icon: 'text-red-500 dark:text-red-400',     border: 'border-red-100 dark:border-red-800' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/30', icon: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-800' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/30', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800' },
  }
  const c = colors[color] ?? colors.blue
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 rounded-2xl border ${c.border} p-5 flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
        <Icon size={22} className={c.icon} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function SectionHeader({ title, to, navigate }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{title}</h2>
      {to && (
        <button onClick={() => navigate(to)} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:opacity-80 font-medium">
          View all <ArrowRight size={13} />
        </button>
      )}
    </div>
  )
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: studentsData, isLoading: loadingStudents } = useGetStudentsQuery({ limit: 5 })
  const { data: feesData,     isLoading: loadingFees }     = useGetFeesQuery({ month: CURRENT_MONTH, limit: 100 })
  const { data: booksData,    isLoading: loadingBooks }    = useGetBooksQuery({ limit: 100 })
  const { data: shiftsData,   isLoading: loadingShifts }   = useGetShiftsQuery()

  const totalStudents  = studentsData?.total ?? 0
  const recentStudents = studentsData?.data  ?? []

  const fees           = feesData?.data ?? []
  const feeCollected   = fees.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0)
  const feePending     = fees.filter(f => f.status === 'Pending').reduce((s, f) => s + f.amount, 0)
  const feePaidCount   = fees.filter(f => f.status === 'Paid').length
  const feePendingCount= fees.filter(f => f.status === 'Pending').length

  const books          = booksData?.data ?? []
  const totalBooks     = booksData?.total ?? 0
  const totalAvailable = books.reduce((s, b) => s + b.available, 0)
  const totalIssued    = books.reduce((s, b) => s + (b.total - b.available), 0)

  const shifts         = shiftsData ?? []
  const activeShifts   = shifts.filter(s => s.active)
  const totalSeats     = shifts.reduce((s, sh) => s + sh.seats, 0)

  const loading = loadingStudents || loadingFees || loadingBooks || loadingShifts

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6 pb-6">

        {/* ── Welcome banner ── */}
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-700 rounded-2xl px-6 py-6 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-300 text-sm font-medium">{greeting} 👋</p>
              <h1 className="text-white font-bold text-2xl mt-0.5">{user?.name ?? 'Admin'}</h1>
              <p className="text-blue-300 text-xs mt-1">KD Library Management · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => navigate('/add-student')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold transition-colors">
                <GraduationCap size={15} /> Add Student
              </button>
              <button onClick={() => navigate('/fee')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-900 text-sm font-semibold transition-colors">
                <CreditCard size={15} /> Manage Fees
              </button>
            </div>
          </div>
        </div>

        {/* ── Top stats ── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <>
            <div>
              <SectionHeader title="Students" to="/students" navigate={navigate} />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBox icon={Users}        label="Total Students"  value={totalStudents}  color="blue"   onClick={() => navigate('/students')} />
                <StatBox icon={GraduationCap} label="Active This Month" value={feePaidCount + feePendingCount} color="indigo" onClick={() => navigate('/students')} />
                <StatBox icon={CheckCircle}  label="Fee Paid"        value={feePaidCount}   color="green"  onClick={() => navigate('/fee')} />
                <StatBox icon={AlertCircle}  label="Fee Pending"     value={feePendingCount} color="red"   onClick={() => navigate('/fee')} />
              </div>
            </div>

            <div>
              <SectionHeader title={`Fee — ${CURRENT_MONTH}`} to="/fee" navigate={navigate} />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBox icon={Wallet}      label="Collected"       value={`₹${feeCollected.toLocaleString()}`}  color="green"  onClick={() => navigate('/fee')} />
                <StatBox icon={AlertCircle} label="Pending"         value={`₹${feePending.toLocaleString()}`}    color="red"    onClick={() => navigate('/fee')} />
                <StatBox icon={TrendingUp}  label="Total Revenue"   value={`₹${(feeCollected + feePending).toLocaleString()}`} color="blue" onClick={() => navigate('/fee-report')} />
                <StatBox icon={BarChart3}   label="Collection Rate" value={fees.length ? `${Math.round((feePaidCount / fees.length) * 100)}%` : '—'} color="purple" onClick={() => navigate('/fee-report')} />
              </div>
            </div>

            <div>
              <SectionHeader title="Books" to="/books" navigate={navigate} />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBox icon={BookOpen}  label="Total Books"   value={totalBooks}      color="indigo" onClick={() => navigate('/books')} />
                <StatBox icon={BookCheck} label="Available"     value={totalAvailable}  color="green"  onClick={() => navigate('/books')} />
                <StatBox icon={BookX}     label="Issued / Out"  value={totalIssued}     color="orange" onClick={() => navigate('/books')} />
                <StatBox icon={Armchair}  label="Total Seats"   value={totalSeats}      color="purple" onClick={() => navigate('/settings/shift')} />
              </div>
            </div>
          </>
        )}

        {/* ── Bottom panels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Recent Students */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-blue-500" />
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Recent Students</span>
              </div>
              <button onClick={() => navigate('/students')} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:opacity-80 font-medium">
                View all <ArrowRight size={13} />
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {loadingStudents
                ? [...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <Skeleton className="w-9 h-9 rounded-xl" />
                      <div className="flex-1 space-y-1.5"><Skeleton className="h-3 w-32" /><Skeleton className="h-2.5 w-20" /></div>
                    </div>
                  ))
                : recentStudents.map(s => (
                    <div key={s._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {s.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{s.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{s.roll} · {s.shift}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                        s.fee === 'Paid'
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300'
                      }`}>{s.fee}</span>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Shifts overview */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-indigo-500" />
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Shift Overview</span>
              </div>
              <button onClick={() => navigate('/settings/shift')} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:opacity-80 font-medium">
                Manage <ArrowRight size={13} />
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {loadingShifts
                ? [...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <Skeleton className="w-9 h-9 rounded-xl" />
                      <div className="flex-1 space-y-1.5"><Skeleton className="h-3 w-28" /><Skeleton className="h-2.5 w-20" /></div>
                    </div>
                  ))
                : shifts.map(sh => (
                    <div key={sh._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xl flex-shrink-0">
                        {sh.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{sh.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{sh.start} – {sh.end} · {sh.seats} seats</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                        sh.active
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      }`}>{sh.active ? 'Active' : 'Inactive'}</span>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Fee status breakdown */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-green-500" />
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Fee Breakdown — {CURRENT_MONTH}</span>
              </div>
              <button onClick={() => navigate('/fee-report')} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:opacity-80 font-medium">
                Full report <ArrowRight size={13} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {loadingFees ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
              ) : fees.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No fee records for this month.</p>
              ) : (
                <>
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      <span>Collection Progress</span>
                      <span>{fees.length ? Math.round((feePaidCount / fees.length) * 100) : 0}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${fees.length ? (feePaidCount / fees.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800">
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Collected</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300 mt-0.5">₹{feeCollected.toLocaleString()}</p>
                      <p className="text-xs text-green-500 dark:text-green-500">{feePaidCount} students</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-100 dark:border-red-800">
                      <p className="text-xs text-red-500 dark:text-red-400 font-medium">Pending</p>
                      <p className="text-lg font-bold text-red-600 dark:text-red-300 mt-0.5">₹{feePending.toLocaleString()}</p>
                      <p className="text-xs text-red-400 dark:text-red-500">{feePendingCount} students</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Books at a glance */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-purple-500" />
                <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Books at a Glance</span>
              </div>
              <button onClick={() => navigate('/books')} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:opacity-80 font-medium">
                View all <ArrowRight size={13} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {loadingBooks ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
              ) : books.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No books found.</p>
              ) : (
                <>
                  {/* Availability bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      <span>Availability</span>
                      <span>{books.reduce((s,b)=>s+b.total,0) ? Math.round((totalAvailable / books.reduce((s,b)=>s+b.total,0)) * 100) : 0}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${books.reduce((s,b)=>s+b.total,0) ? (totalAvailable / books.reduce((s,b)=>s+b.total,0)) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  {/* Top 5 books */}
                  <div className="space-y-2">
                    {books.slice(0, 5).map(b => (
                      <div key={b._id} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={13} className="text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">{b.title}</p>
                          <p className="text-[10px] text-gray-400">{b.author}</p>
                        </div>
                        <span className={`text-xs font-bold flex-shrink-0 ${b.available === 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                          {b.available}/{b.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
