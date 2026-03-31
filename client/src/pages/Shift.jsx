import { useState, useEffect } from 'react'
import { Clock, CheckCircle, Armchair, Trash2, X, Plus } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import api from '../API/index'

const icons = ['🌅', '☀️', '🌆', '🌙', '🌤️', '🌃', '⭐', '🕐']

const cardStyle = [
  'bg-amber-50  dark:bg-amber-900/20  border-amber-300  dark:border-amber-700',
  'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700',
  'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700',
  'bg-slate-50  dark:bg-slate-800/40  border-slate-300  dark:border-slate-600',
  'bg-blue-50   dark:bg-blue-900/20   border-blue-300   dark:border-blue-700',
  'bg-green-50  dark:bg-green-900/20  border-green-300  dark:border-green-700',
  'bg-pink-50   dark:bg-pink-900/20   border-pink-300   dark:border-pink-700',
  'bg-teal-50   dark:bg-teal-900/20   border-teal-300   dark:border-teal-700',
]
const titleStyle = [
  'text-amber-600  dark:text-amber-400',
  'text-orange-600 dark:text-orange-400',
  'text-purple-600 dark:text-purple-400',
  'text-slate-500  dark:text-slate-400',
  'text-blue-600   dark:text-blue-400',
  'text-green-600  dark:text-green-400',
  'text-pink-600   dark:text-pink-400',
  'text-teal-600   dark:text-teal-400',
]

const inputCls = 'w-full rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:border-blue-400 transition-colors'
const emptyForm = { name: '', icon: '🌅', start: '08:00', end: '14:00', seats: 20 }

export default function Shift() {
  const [shifts, setShifts]       = useState([])
  const [saved, setSaved]         = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId]   = useState(null)
  const [form, setForm]           = useState(emptyForm)

  useEffect(() => {
    api.get('/shifts').then(({ data }) => setShifts(data))
  }, [])

  const toggle = async sh => {
    const { data } = await api.put(`/shifts/${sh._id}`, { ...sh, active: !sh.active })
    setShifts(s => s.map(x => x._id === sh._id ? data : x))
  }

  const update = async (sh, field, val) => {
    const updated = { ...sh, [field]: field === 'seats' ? +val : val }
    setShifts(s => s.map(x => x._id === sh._id ? updated : x))
  }

  const save = async sh => {
    await api.put(`/shifts/${sh._id}`, sh)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleAdd = async e => {
    e.preventDefault()
    const { data } = await api.post('/shifts', { ...form, seats: +form.seats })
    setShifts(s => [...s, data])
    setShowModal(false)
    setForm(emptyForm)
  }

  const doDelete = async () => {
    await api.delete(`/shifts/${deleteId}`)
    setShifts(s => s.filter(sh => sh._id !== deleteId))
    setDeleteId(null)
  }

  const getStyle = idx => ({ card: cardStyle[idx % cardStyle.length], title: titleStyle[idx % titleStyle.length] })

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-5 pb-4">
      {saved && <Alert color="green">✅ Shift settings saved successfully!</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Clock}       label="Total Shifts"  value={shifts.length}                           color="accent" />
        <StatCard icon={CheckCircle} label="Active Shifts" value={shifts.filter(s => s.active).length}     color="green"  />
        <StatCard icon={Armchair}    label="Total Seats"   value={shifts.reduce((a, s) => a + s.seats, 0)} color="orange" />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus size={15} /> Add Shift
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {shifts.map((sh, idx) => {
          const s = getStyle(idx)
          return (
            <div key={sh._id} className={`rounded-xl border-2 p-5 transition-all ${sh.active ? s.card : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 opacity-60'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{sh.icon}</span>
                  <div>
                    <p className={`font-bold text-base ${sh.active ? s.title : 'text-gray-400 dark:text-gray-500'}`}>{sh.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{sh.active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDeleteId(sh._id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() => toggle(sh)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${sh.active ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${sh.active ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <Button onClick={() => save(sh)} className="!px-3 !py-[5px] !rounded-full !text-xs">Save</Button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Timing</p>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">Start</label>
                    <input type="time" value={sh.start} onChange={e => update(sh, 'start', e.target.value)} className={inputCls} />
                  </div>
                  <span className="pb-2 text-gray-300 dark:text-gray-600 text-lg">→</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">End</label>
                    <input type="time" value={sh.end} onChange={e => update(sh, 'end', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Seat Capacity</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number" value={sh.seats} min={1} max={200}
                    onChange={e => update(sh, 'seats', e.target.value)}
                    className="w-24 rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-center font-semibold focus:border-blue-400 transition-colors"
                  />
                  <span className="text-sm text-gray-400">seats available</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base">Add New Shift</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} className="px-6 py-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Shift Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Early Morning" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {icons.map(ic => (
                    <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center border-2 transition-colors ${form.icon === ic ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'}`}
                    >{ic}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Start</label>
                  <input type="time" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} className={inputCls} />
                </div>
                <span className="pb-2 text-gray-300 text-lg">→</span>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">End</label>
                  <input type="time" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} className={inputCls} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Seat Capacity</label>
                <input type="number" min={1} max={200} value={form.seats} onChange={e => setForm(f => ({ ...f, seats: e.target.value }))} className={inputCls} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Add Shift</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto text-red-500">
              <Trash2 size={26} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Delete Shift?</h3>
              <p className="text-sm text-gray-500 mt-1">"{shifts.find(s => s._id === deleteId)?.name}" will be permanently removed.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <button onClick={doDelete} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
