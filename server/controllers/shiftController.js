import Shift from '../models/Shift.js'

export const getShifts = async (req, res) => {
  const shifts = await Shift.find().sort({ createdAt: 1 })
  res.json(shifts)
}

export const createShift = async (req, res) => {
  const shift = await Shift.create(req.body)
  res.status(201).json(shift)
}

export const updateShift = async (req, res) => {
  const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!shift) return res.status(404).json({ message: 'Shift not found' })
  res.json(shift)
}

export const deleteShift = async (req, res) => {
  const shift = await Shift.findByIdAndDelete(req.params.id)
  if (!shift) return res.status(404).json({ message: 'Shift not found' })
  res.json({ message: 'Shift deleted' })
}
