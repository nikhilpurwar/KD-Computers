import { useState } from 'react'
import { GraduationCap, CheckCircle, Clock, Plus, Loader2, Pencil, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table, { Tr, Td } from '../components/ui/Table'
import { SearchInput } from '../components/ui/FormField'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import StudentProfileCard from '../components/StudentProfileCard'
import api from '../API/index'

const shiftColor = { Morning: 'blue', Afternoon: 'orange', Evening: 'purple', Night: 'accent' }

export default function Students() {
  const navigate = useNavigate()
  const [search, setSearch]               = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [deleteId, setDeleteId]           = useState(null)
  const [profileStudent, setProfileStudent] = useState(null)

  const { items: students, setItems, total, loading, initial, sentinelRef } = useInfiniteScroll({
    endpoint: '/students',
    params:   debouncedSearch ? { search: debouncedSearch } : {},
  })

  const handleSearch = e => {
    const v = e.target.value
    setSearch(v)
    clearTimeout(window._studentSearchTimer)
    window._studentSearchTimer = setTimeout(() => setDebouncedSearch(v), 300)
  }

  const toggleActive = async (s) => {
    const { data } = await api.put(`/students/${s._id}`, { active: !s.active })
    setItems(prev => prev.map(x => x._id === s._id ? data : x))
    if (profileStudent?._id === s._id) setProfileStudent(data)
  }

  const doDelete = async () => {
    await api.delete(`/students/${deleteId}`)
    setItems(prev => prev.filter(x => x._id !== deleteId))
    setDeleteId(null)
  }

  const paid    = students.filter(s => s.fee === 'Paid').length
  const pending = students.filter(s => s.fee === 'Pending').length

  return (
    <div className="h-full flex flex-col gap-5 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
        <StatCard icon={GraduationCap} label="Total Students" value={total}   color="accent" />
        <StatCard icon={CheckCircle}   label="Fee Paid"        value={paid}    color="green"  />
        <StatCard icon={Clock}         label="Fee Pending"     value={pending} color="red"    />
      </div>

      <Card className="flex-1 min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <span className="font-bold text-lg text-gray-800 dark:text-gray-100">All Students</span>
          <div className="flex gap-4">
            <SearchInput value={search} onChange={handleSearch} placeholder="Search name or roll..." />
            <button
              onClick={() => navigate('/add-student')}
              className="flex items-center bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <Plus size={16} className="inline-block mr-1" /> Add Student
            </button>
          </div>
        </div>

        <Table
          headers={['#', 'Name', 'Roll No', 'Seat No', 'Shift', 'Phone', 'Fee Status', 'Joined', 'Actions']}
          empty={!initial && !loading && students.length === 0 ? 'No students found.' : null}
        >
          {students.map((s, i) => (
            <Tr key={s._id}>
              <Td>{i + 1}</Td>
              <Td>
                <button
                  onClick={() => setProfileStudent(s)}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline text-left"
                >
                  {s.name}
                </button>
              </Td>
              <Td><span className="font-mono text-xs">{s.roll}</span></Td>
              <Td><span className="font-mono text-xs">{s.seat || '—'}</span></Td>
              <Td><Badge label={s.shift} color={shiftColor[s.shift]} /></Td>
              <Td>{s.phone}</Td>
              <Td><Badge label={s.fee} color={s.fee === 'Paid' ? 'green' : 'red'} /></Td>
              <Td><span className="text-xs">{new Date(s.joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></Td>
              <Td>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(s)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                      s.active
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {s.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => navigate('/add-student', { state: { student: s } })}
                    className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(s._id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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

      {/* ── Profile Drawer ── */}
      {profileStudent && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setProfileStudent(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] flex flex-col bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 shadow-2xl">
            {/* header bar */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Student Profile</span>
              <button
                onClick={() => setProfileStudent(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {/* scrollable card area */}
            <div className="flex-1 min-h-0 overflow-y-auto py-4 px-3">
              <StudentProfileCard student={profileStudent} />
            </div>
          </div>
        </>
      )}

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto text-red-500">
              <Trash2 size={26} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Delete Student?</h3>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={doDelete} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
