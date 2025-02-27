import Department from "../models/Department.js";


const getDepartment=async(req,res)=>{
     try {
        const departments=await Department.find();
        return res.status(200).json({success:true,departments})
     } catch (error) {
        return res.status(500).json({success:false,error:"Servor Error in Getting Dept"})
     }
}

const editDepartment=async(req,res)=>{
    try {
        const {id}=req.params;
        const department=await Department.findById({_id:id});
        return res.status(200).json({success:true,department})
     } catch (error) {
        return res.status(500).json({success:false,error:"Servor Error in Getting Dept"})
     }
}
const addDepartment=async(req,res)=>{
    try {
        const {dep_name,description} = req.body;
        const newDept=new Department({
            dep_name,
            description
        });

        await newDept.save();
        return res.status(200).json({success:true,department:newDept})
        
    } catch (error) {
        return res.status(500).json({success:false,error:"Servor Error in Adding Dept"})
    }
}


const updateDepartment=async(req,res)=>{
  try {
    const {id}=req.params;
    const {dep_name,description}=req.body;
    const updateDep=await Department.findByIdAndUpdate({_id:id},{
        dep_name,
        description
    })
    return res.status(200).json({success:true,updateDep})
  } catch (error) {
    return res.status(500).json({success:false,error:"Servor Error in Updating Dept"})
  }
}



const deleteDepartment = async(req,res)=>{
    try {
        const {id}=req.params;
        const deletedep=await Department.findById({_id:id});
        await deletedep.deleteOne();
        return res.status(200).json({success:true,deletedep})
     } catch (error) {
        return res.status(500).json({success:false,error:"Servor Error in Deleting Dept"})
     }
}

export {addDepartment,getDepartment,editDepartment,updateDepartment,deleteDepartment}