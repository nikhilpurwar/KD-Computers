import mongoose from 'mongoose'

const feeSchema = new mongoose.Schema({
  roll:   { type: String, required: true },
  month:  { type: String, required: true },   // e.g. "June 2025"
  ym:     { type: String, required: true },   // e.g. "2025-06"
  amount: { type: Number, required: true, default: 500 },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  date:   { type: String, default: '—' },
}, { timestamps: true })

feeSchema.index({ roll: 1, ym: 1 }, { unique: true })

export default mongoose.model('Fee', feeSchema)
