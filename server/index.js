import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import { protect } from './middleware/auth.js'
import authRoutes    from './routes/auth.js'
import studentRoutes from './routes/students.js'
import feeRoutes     from './routes/fees.js'
import bookRoutes    from './routes/books.js'
import shiftRoutes   from './routes/shifts.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://kd-computers.vercel.app',
]

app.use(helmet())
app.use(cors({
  origin: (origin, cb) => {
    // allow server-to-server / curl (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())

import { getStudentProfile } from './controllers/studentController.js'

app.get('/api/students/profile/:roll', getStudentProfile)

app.use('/api/auth',     authRoutes)
app.use('/api/students', protect, studentRoutes)
app.use('/api/fees',     protect, feeRoutes)
app.use('/api/books',    protect, bookRoutes)
app.use('/api/shifts',   protect, shiftRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`)
  )
})
