import express from 'express'
import { upload } from '../config/cloudinary.js'
import { getStudents, getStudent, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js'

const router = express.Router()

router.get('/',       getStudents)
router.get('/:id',    getStudent)
router.post('/',      upload.single('aadhar'), createStudent)
router.put('/:id',    upload.single('aadhar'), updateStudent)
router.delete('/:id', deleteStudent)

export default router
