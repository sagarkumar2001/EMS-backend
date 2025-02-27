import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addEmployee ,getEmployees,upload,getEmployee,updateEmployee,fetchEmployeeByDeptId,deleteEmployee} from '../controller/employeeController.js';
const router=express.Router();

router.get('/', authMiddleware,  getEmployees);
 router.get('/:id', authMiddleware, getEmployee);
router.post('/add', authMiddleware, upload.single('image'), addEmployee);
 router.put('/:id', authMiddleware, updateEmployee);
 router.get('/department/:id', authMiddleware, fetchEmployeeByDeptId);
 router.delete('/:id', authMiddleware, deleteEmployee);


export default router;