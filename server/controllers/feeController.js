import Fee from '../models/Fee.js'
import Student from '../models/Student.js'

export const getFees = async (req, res) => {
  const { month, roll, status, page = 1, limit = 15 } = req.query
  const filter = {}
  if (month)  filter.month  = month
  if (roll)   filter.roll   = roll
  if (status && status !== 'All') filter.status = status
  const skip  = (page - 1) * limit
  const total = await Fee.countDocuments(filter)
  const fees  = await Fee.find(filter).sort({ ym: -1 }).skip(skip).limit(+limit)
  res.json({ data: fees, total, page: +page, pages: Math.ceil(total / limit) })
}

export const getStudentFeeHistory = async (req, res) => {
  const fees    = await Fee.find({ roll: req.params.roll }).sort({ ym: 1 })
  const student = await Student.findOne({ roll: req.params.roll }).select('name shift')
  res.json({ student, fees })
}

export const updateFeeStatus = async (req, res) => {
  const { status } = req.body
  const date = status === 'Paid'
    ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'
  const fee = await Fee.findByIdAndUpdate(req.params.id, { status, date }, { new: true })
  if (!fee) return res.status(404).json({ message: 'Fee record not found' })
  res.json(fee)
}

export const createFee = async (req, res) => {
  const fee = await Fee.create(req.body)
  res.status(201).json(fee)
}
