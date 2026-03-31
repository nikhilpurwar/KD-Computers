import Book from '../models/Book.js'

export const getBooks = async (req, res) => {
  const { search, page = 1, limit = 15 } = req.query
  const filter = search
    ? { $or: [{ title: new RegExp(search, 'i') }, { author: new RegExp(search, 'i') }] }
    : {}
  const skip  = (page - 1) * limit
  const total = await Book.countDocuments(filter)
  const books = await Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(+limit)
  res.json({ data: books, total, page: +page, pages: Math.ceil(total / limit) })
}

export const createBook = async (req, res) => {
  const book = await Book.create(req.body)
  res.status(201).json(book)
}

export const updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!book) return res.status(404).json({ message: 'Book not found' })
  res.json(book)
}

export const deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id)
  if (!book) return res.status(404).json({ message: 'Book not found' })
  res.json({ message: 'Book deleted' })
}
