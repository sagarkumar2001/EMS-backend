import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import connectToDatabase from './db.js'
import DepartmentRouter from './routes/department.js'
import EmployeeRouter from './routes/employee.js'
import SalaryRouter from './routes/salary.js'
import LeaveRouter from './routes/leave.js'
import SettingRouter from './routes/setting.js'
import DashBoardRouter from './routes/dashboard.js'
import ResetRouter from './routes/reset.js';

connectToDatabase();

const app=express();
app.use(cors({
     origin:"https://ems-frontend-rho-blush.vercel.app",
     credentials:true
}));
app.use(express.json());
app.use(express.static('public/uploads'));
app.use('/api/auth',authRouter);
app.use('/api/department',DepartmentRouter);
app.use('/api/employee',EmployeeRouter);
app.use('/api/salary',SalaryRouter);
app.use('/api/leave',LeaveRouter);
app.use('/api/setting',SettingRouter);
app.use('/api/dashboard',DashBoardRouter);
app.use('/api/reset',ResetRouter);


const port =process.env.PORT;



app.listen(port,()=>{
     console.log(`Server is running on port ${port}`);
})