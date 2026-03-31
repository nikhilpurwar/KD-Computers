import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layout/Layout'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import Fee from './pages/Fee'
import FeeReport from './pages/FeeReport'
import Books from './pages/Books'
import Shift from './pages/Shift'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/students" replace />} />
          <Route path="students"          element={<Students />} />
          <Route path="add-student"       element={<AddStudent />} />
          <Route path="fee"               element={<Fee />} />
          <Route path="fee-report"        element={<FeeReport />} />
          <Route path="fee-report/:roll"  element={<FeeReport />} />
          <Route path="books"             element={<Books />} />
          <Route path="settings/shift"    element={<Shift />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
