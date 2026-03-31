import mongoose from 'mongoose'

const shiftSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  icon:   { type: String, default: '🌅' },
  start:  { type: String, required: true },
  end:    { type: String, required: true },
  seats:  { type: Number, required: true, min: 1 },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Shift', shiftSchema)
