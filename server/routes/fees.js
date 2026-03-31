import express from 'express'
import { getFees, getStudentFeeHistory, updateFeeStatus, createFee } from '../controllers/feeController.js'

const router = express.Router()

router.get('/',                    getFees)
router.get('/student/:roll',       getStudentFeeHistory)
router.post('/',                   createFee)
router.patch('/:id/status',        updateFeeStatus)

export default router
