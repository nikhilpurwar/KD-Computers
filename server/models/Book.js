import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  author:    { type: String, required: true, trim: true },
  category:  { type: String, trim: true },
  total:     { type: Number, required: true, min: 0 },
  available: { type: Number, required: true, min: 0 },
}, { timestamps: true })

export default mongoose.model('Book', bookSchema)
