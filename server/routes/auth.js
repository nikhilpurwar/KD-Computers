import express from 'express'
import { login, getMe, changePassword, resetPassword } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/login',          login)
router.get('/me',   protect,   getMe)
router.put('/password', protect, changePassword)
router.post('/reset-password', resetPassword)

export default router
