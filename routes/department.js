import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addDepartment , getDepartment, editDepartment, updateDepartment, deleteDepartment } from '../controller/departmentController.js';
const router=express.Router();
router.get('/', authMiddleware,  getDepartment);
router.get('/:id', authMiddleware, editDepartment);
router.post('/add', authMiddleware, addDepartment);
router.put('/:id', authMiddleware, updateDepartment);
router.delete('/:id', authMiddleware, deleteDepartment);


export default router;