import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  roll:    { type: String, required: true, unique: true, trim: true },
  seat:    { type: String, trim: true },
  phone:   { type: String, required: true, trim: true },
  email:   { type: String, trim: true, lowercase: true },
  shift:   { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Night'], default: 'Morning' },
  address: { type: String, trim: true },
  aadhar:  { type: String },
  fee:     { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  active:  { type: Boolean, default: true },
  joined:  { type: Date, default: Date.now },
  barcode: { type: String },   // base64 PNG
  qrcode:  { type: String },   // base64 PNG
}, { timestamps: true })

export default mongoose.model('Student', studentSchema)
