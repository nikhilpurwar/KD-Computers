import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './layout/Layout'
import Login from './auth/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import Fee from './pages/Fee'
import FeeReport from './pages/FeeReport'
import Books from './pages/Books'
import Shift from './pages/Shift'
import StudentProfile from './pages/StudentProfile'

function Protected({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:roll" element={<StudentProfile />} />
        <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"        element={<Dashboard />} />
          <Route path="students"         element={<Students />} />
          <Route path="add-student"      element={<AddStudent />} />
          <Route path="fee"              element={<Fee />} />
          <Route path="fee-report"       element={<FeeReport />} />
          <Route path="fee-report/:roll" element={<FeeReport />} />
          <Route path="books"            element={<Books />} />
          <Route path="settings/shift"   element={<Shift />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
