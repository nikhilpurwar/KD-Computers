import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' })

  const admin = await Admin.findOne({ email })
  if (!admin || !(await admin.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password.' })

  res.json({
    token: sign(admin._id),
    user:  { id: admin._id, name: admin.name, email: admin.email },
  })
}

export const getMe = async (req, res) => {
  res.json(req.admin)
}

export const changePassword = async (req, res) => {
  const { current, next } = req.body
  const admin = await Admin.findById(req.admin._id)
  if (!(await admin.matchPassword(current)))
    return res.status(400).json({ message: 'Current password is incorrect.' })
  if (!next || next.length < 6)
    return res.status(400).json({ message: 'New password must be at least 6 characters.' })
  admin.password = next
  await admin.save()
  res.json({ message: 'Password updated successfully.' })
}

export const resetPassword = async (req, res) => {
  const { email, newPassword, checkOnly } = req.body
  const admin = await Admin.findOne({ email })
  if (!admin) return res.status(404).json({ message: 'No account found with this email.' })
  if (checkOnly) return res.json({ message: 'Email verified.' })
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  admin.password = newPassword
  await admin.save()
  res.json({ message: 'Password reset successfully.' })
}
