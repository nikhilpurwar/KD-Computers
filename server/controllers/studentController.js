import Student from '../models/Student.js'
import bwipjs from 'bwip-js'
import QRCode from 'qrcode'

const APP_URL = process.env.APP_URL || 'http://localhost:5173'

async function generateCodes(roll, seat) {
  const barcodeText = seat ? `${seat}|${roll}` : roll
  const barcodeBuffer = await bwipjs.toBuffer({ bcid: 'code128', text: barcodeText, scale: 2, height: 10, includetext: true })
  const barcode = `data:image/png;base64,${barcodeBuffer.toString('base64')}`
  const qrcode  = await QRCode.toDataURL(`${APP_URL}/profile/${roll}`, { width: 200, margin: 1 })
  return { barcode, qrcode }
}

export const getStudentProfile = async (req, res) => {
  const student = await Student.findOne({ roll: req.params.roll }).select('-aadhar')
  if (!student) return res.status(404).json({ message: 'Student not found' })
  res.json(student)
}

export const getStudents = async (req, res) => {
  const { search, page = 1, limit = 15 } = req.query
  const filter = search
    ? { $or: [{ name: new RegExp(search, 'i') }, { roll: new RegExp(search, 'i') }] }
    : {}
  const skip  = (page - 1) * limit
  const total = await Student.countDocuments(filter)
  const students = await Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(+limit)
  res.json({ data: students, total, page: +page, pages: Math.ceil(total / limit) })
}

export const getStudent = async (req, res) => {
  const student = await Student.findById(req.params.id)
  if (!student) return res.status(404).json({ message: 'Student not found' })
  res.json(student)
}

export const createStudent = async (req, res) => {
  const body = { ...req.body, aadhar: req.file?.path ?? req.file?.secure_url ?? null }
  const codes = await generateCodes(body.roll, body.seat)
  const student = await Student.create({ ...body, ...codes })
  res.status(201).json(student)
}

export const updateStudent = async (req, res) => {
  const existing = await Student.findById(req.params.id)
  if (!existing) return res.status(404).json({ message: 'Student not found' })
  const roll = req.body.roll ?? existing.roll
  const seat = req.body.seat ?? existing.seat
  const codes = await generateCodes(roll, seat)
  const student = await Student.findByIdAndUpdate(req.params.id, { ...req.body, ...codes }, { new: true, runValidators: true })
  res.json(student)
}

export const regenerateCodes = async (req, res) => {
  const students = await Student.find({})
  let count = 0
  for (const s of students) {
    const codes = await generateCodes(s.roll, s.seat)
    await Student.findByIdAndUpdate(s._id, codes)
    count++
  }
  res.json({ message: `Regenerated codes for ${count} students.` })
}
  const student = await Student.findByIdAndDelete(req.params.id)
  if (!student) return res.status(404).json({ message: 'Student not found' })
  res.json({ message: 'Student deleted' })
}
