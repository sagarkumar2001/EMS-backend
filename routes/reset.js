import express from 'express';
import { sendEmail , verifyEmail, setPassword } from '../controller/resetController.js';


const router=express.Router();

router.post("/",sendEmail);
router.get("/:id/:token",verifyEmail);
router.put("/verify/:id/:token",setPassword);




export default router;