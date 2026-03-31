import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import StudentProfileCard from '../components/StudentProfileCard'

export default function StudentProfile() {
  const { roll } = useParams()
  const [student, setStudent] = useState(null)
  const [error, setError]     = useState('')

  useEffect(() => {
    axios.get(`/api/students/profile/${roll}`)
      .then(r => setStudent(r.data))
      .catch(() => setError('Student not found.'))
  }, [roll])

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 text-gray-500">{error}</div>
  )
  if (!student) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 text-gray-400">Loading...</div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-700 flex items-center justify-center p-4">
      <StudentProfileCard student={student} />
    </div>
  )
}
