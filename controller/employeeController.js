 import path from "path";
 import Employee from "../models/Employee.js";
 import User from "../models/User.js";
 import bcrypt from "bcrypt";
 import multer from 'multer';
 import axios from "axios";

 const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/uploads")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
 })

 const upload=multer({storage:storage});

 const verifyEmail = async (email) => {
    const apiKey = process.env.api_key; // Replace with your API key
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
  
    try {
      const response = await axios.get(url);
      const data =response.data;
      if (data.deliverability === "DELIVERABLE") {
          return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  

 const addEmployee=async (req,res)=>{
    try {
        
        const {name,email,employeeId,dob,gender,maritalStatus,designation,department,salary,password,role}=req.body;
        if(!verifyEmail(email)){
            return res.status(400).json({success:false,error:"Invalid Email Address.."});
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({success:false,error:"User with this email already exists"});
        }
        
        const emp=await Employee.findOne({employeeId});
        if(emp){
            return res.status(400).json({success:false,error:"EmployeeId already exists"});
        }

        const hashpassword=await bcrypt.hash(password,10);
        const newUser=new User({
            name,
            email,
            password:hashpassword,
            role,
            profileImage:req.file?req.file.filename:""
        })

        const savedUser=await newUser.save();
        const newEmployee=new Employee({
            userId:savedUser._id,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary
        })

      await newEmployee.save();
       return res.status(200).json({success:true,message:"employee created"});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success:false,error:"Servor Error in Adding Employee"})
    }
}


const getEmployees=async(req,res)=>{
    try {
        const employees=await Employee.find().populate('userId',{password:0}).populate('department');
        return res.status(200).json({success:true,employees})
     } catch (error) {
        return res.status(500).json({success:false,error:"Servor Error in Getting Employees"})
     }
}

const getEmployee=async(req,res)=>{
    const {id}=req.params;
    try {
        let employees;
         employees=await Employee.findById({_id:id}).populate('userId',{password:0}).populate('department');
         if(!employees){
            employees=await Employee.findOne({userId:id}).populate('userId',{password:0}).populate('department');
         }
        return res.status(200).json({success:true,employees})
     } catch (error) {
        return res.status(500).json({success:false,error:"Servor Error in Getting Employees"})
     }
}

const updateEmployee=async(req,res)=>{
    try {
        const {id}=req.params;
        const {name,maritalStatus,designation,department,salary}=req.body;
        const employee=await Employee.findById({_id:id});
        if(!employee){
            return res.status(404).json({success:false,error:"Employee Not Found"}) 
        }
        const user =await User.findById({_id:employee.userId});
        if(!user){
            return res.status(404).json({success:false,error:"User Not Found"}) 
        }

        const updateUser=await User.findByIdAndUpdate({_id:employee.userId},{name});
        const updateEmp=await Employee.findByIdAndUpdate({_id:id},{maritalStatus,designation,department,salary});
        if(!updateEmp||!updateUser){
            return res.status(404).json({success:false,error:"Document Not Found"}) 
        }
        return res.status(200).json({success:true,message:"Updated Successfully!!"}) 
    } catch (error) {
        return res.status(500).json({success:false,error:"Servor Error in Updating Employee"})
    }
}

const fetchEmployeeByDeptId=async (req,res)=>{
    const {id}=req.params;
    try {
        const employees=await Employee.find({department:id});
        return res.status(200).json({success:true,employees})
     } catch (error) {
        return res.status(500).json({success:false,error:"Servor Error in Getting EmployeesByDeptId"})
     }
     
}


 const deleteEmployee=async(req,res)=>{
    try {
        const {id}=req.params;
        const deleteEmp=await Employee.findById({_id:id});
        await deleteEmp.deleteOne();
        return res.status(200).json({success:true,deleteEmp})
     } catch (error) {
        return res.status(500).json({success:false,error:"Servor Error in Deleting Dept"})
     }
}

export { addEmployee, upload ,getEmployees,getEmployee,updateEmployee,fetchEmployeeByDeptId,deleteEmployee}
