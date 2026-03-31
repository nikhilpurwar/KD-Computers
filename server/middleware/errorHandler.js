export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  const status = err.statusCode ?? 500
  res.status(status).json({ message: err.message ?? 'Internal Server Error' })
}

export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
