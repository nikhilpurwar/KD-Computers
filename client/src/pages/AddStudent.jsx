import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FormField, Input, Select, Textarea } from '../components/ui/FormField'

const init = { name: '', roll: '', phone: '', email: '', shift: 'Morning', address: '' }

export default function AddStudent() {
  const [form, setForm] = useState(init)
  const [success, setSuccess] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    setSuccess(true)
    setForm(init)
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="max-w-2xl w-full mx-auto space-y-5">
      {success && (
        <div className="flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium border bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
          <CheckCircle size={16} />
          Student registered successfully!
        </div>
      )}

      <Card>
        <div className="bg-blue-700 dark:bg-white/10 px-6 py-4">
          <h2 className="text-white font-semibold">Student Registration Form</h2>
          <p className="text-blue-300 dark:text-gray-400 text-xs mt-0.5">Fill in the details to enroll a new student</p>
        </div>

        <form onSubmit={submit} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <FormField label="Full Name">
            <Input name="name" value={form.name} onChange={handle} placeholder="e.g. Arjun Sharma" required />
          </FormField>
          <FormField label="Roll / Seat No">
            <Input name="roll" value={form.roll} onChange={handle} placeholder="e.g. LIB006" required />
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

          <div className="sm:col-span-2 flex flex-wrap justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setForm(init)}>Reset</Button>
            <Button type="submit">Register Student</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
