import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import getSummary from '../controller/dashboardController.js';
const router=express.Router();

router.get("/summary",authMiddleware,getSummary);
export default router;
