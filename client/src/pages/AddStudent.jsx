import { useState, useRef, useEffect } from 'react'
import { CheckCircle, UploadCloud, X, FileImage, ShieldCheck } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FormField, Input, Select, Textarea } from '../components/ui/FormField'
import api from '../API/index'

const init = { name: '', roll: '', seat: '', phone: '', email: '', shift: 'Morning', address: '' }

export default function AddStudent() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const editData  = location.state?.student ?? null
  const isEdit    = !!editData

  const [form, setForm]         = useState(isEdit ? { name: editData.name, roll: editData.roll, seat: editData.seat || '', phone: editData.phone, email: editData.email || '', shift: editData.shift, address: editData.address || '' } : init)
  const [success, setSuccess]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [aadhar, setAadhar]     = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  // reset form when navigating between add/edit
  useEffect(() => {
    if (isEdit) {
      setForm({ name: editData.name, roll: editData.roll, seat: editData.seat || '', phone: editData.phone, email: editData.email || '', shift: editData.shift, address: editData.address || '' })
    } else {
      setForm(init)
    }
    setAadhar(null)
    setError('')
  }, [editData?._id])

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const loadFile = file => {
    if (!file) return
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return
    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    setAadhar({ file, preview, name: file.name, size: (file.size / 1024).toFixed(1) + ' KB', isPdf: file.type === 'application/pdf' })
  }

  const removeAadhar = () => {
    if (aadhar?.preview) URL.revokeObjectURL(aadhar.preview)
    setAadhar(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (aadhar?.file) fd.append('aadhar', aadhar.file)

      if (isEdit) {
        await api.put(`/students/${editData._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/students', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }

      setSuccess(true)
      if (!isEdit) { setForm(init); removeAadhar() }
      setTimeout(() => { setSuccess(false); navigate('/students') }, 2000)
    } catch (err) {
      setError(err.response?.data?.message ?? (isEdit ? 'Failed to update student' : 'Failed to register student'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto space-y-5 pb-4">
      {success && (
        <div className="flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium border bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
          <CheckCircle size={16} /> {isEdit ? 'Student updated successfully!' : 'Student registered successfully!'}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium border bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <Card>
        <div className="bg-gradient-to-l from-blue-950 via-blue-800 to-blue-700 dark:bg-gradient-to-l dark:from-blue-950 dark:via-white/5 dark:to-white/1 px-6 py-4">
          <h2 className="text-white font-semibold">{isEdit ? 'Edit Student' : 'Student Registration Form'}</h2>
          <p className="text-indigo-300 dark:text-gray-400 text-xs mt-0.5">{isEdit ? `Editing: ${editData.name}` : 'Fill in the details to enroll a new student'}</p>
        </div>

        <form onSubmit={submit} className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <FormField label="Full Name">
              <Input name="name" value={form.name} onChange={handle} placeholder="e.g. Arjun Sharma" required />
            </FormField>
            <FormField label="Roll / ID No">
              <Input name="roll" value={form.roll} onChange={handle} placeholder="e.g. LIB006" required />
            </FormField>
            <FormField label="Seat No">
              <Input name="seat" value={form.seat} onChange={handle} placeholder="e.g. A-12" />
            </FormField>
            <FormField label="Phone Number">
              <Input name="phone" value={form.phone} onChange={handle} placeholder="10-digit number" required />
            </FormField>
            <FormField label="Email Address">
              <Input type="email" name="email" value={form.email} onChange={handle} placeholder="student@email.com" />
            </FormField>
            <FormField label="Shift">
              <Select name="shift" value={form.shift} onChange={handle}>
                {['Morning', 'Afternoon', 'Evening', 'Night'].map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormField>
            <FormField label="Address">
              <Textarea name="address" value={form.address} onChange={handle} placeholder="Enter full address" rows={3} />
            </FormField>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <ShieldCheck size={13} /> Aadhar Card {isEdit && <span className="normal-case font-normal text-gray-400">(leave empty to keep existing)</span>}
            </label>
            {!aadhar ? (
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); loadFile(e.dataTransfer.files[0]) }}
                className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all py-10 px-6 ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/40 hover:border-indigo-400'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-500">
                  <UploadCloud size={28} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Drop your Aadhar here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF · Max 5 MB</p>
                </div>
                <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={e => loadFile(e.target.files[0])} />
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
                {aadhar.preview && (
                  <div className="relative bg-gray-100 dark:bg-gray-800">
                    <img src={aadhar.preview} alt="Aadhar preview" className="w-full max-h-56 object-contain" />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      <ShieldCheck size={12} /> Aadhar Card
                    </div>
                  </div>
                )}
                {aadhar.isPdf && (
                  <div className="flex items-center justify-center gap-3 py-8 bg-indigo-50 dark:bg-indigo-900/20">
                    <FileImage size={36} className="text-indigo-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">PDF Document</p>
                      <p className="text-xs text-gray-400">Preview not available for PDF</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                      <FileImage size={15} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">{aadhar.name}</p>
                      <p className="text-xs text-gray-400">{aadhar.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                      <CheckCircle size={13} /> Uploaded
                    </span>
                    <button
                      type="button" onClick={removeAadhar}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <X size={13} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-1">
            <Button variant="outline" type="button" onClick={() => isEdit ? navigate('/students') : (setForm(init), removeAadhar())}>
              {isEdit ? 'Cancel' : 'Reset'}
            </Button>
            <Button type="submit" disabled={loading}>{loading ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update Student' : 'Register Student')}</Button>
          </div>
        </form>
      </Card>
      </div>
    </div>
  )
}
