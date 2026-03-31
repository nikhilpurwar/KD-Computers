import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const protect = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorised, no token.' })

  try {
    const { id } = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.admin = await Admin.findById(id).select('-password')
    if (!req.admin) return res.status(401).json({ message: 'Admin not found.' })
    next()
  } catch {
    res.status(401).json({ message: 'Token invalid or expired.' })
  }
}
