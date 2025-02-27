import mongoose from "mongoose";
import Employee from "./Employee.js";
import Leave from "./Leave.js";
import Salary from "./Salary.js";
import User from "./User.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const DepartmentSchema=new mongoose.Schema({
    dep_name:{type:String,required:true},
    description:{type:String},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deleteProfileImages(users) {
    try {
        const deletePromises = users.map(async (user) => {
            const filename = user.profileImage;
            if (!filename) {
                console.log("Filename is missing for user:", user);
                return;
            }
            const filePath = path.join(__dirname, "../public/uploads", filename);
            console.log("Deleting file:", filePath);
            try {
                await fs.promises.unlink(filePath);
                console.log(`File deleted successfully: ${filename}`);
            } catch (err) {
                if (err.code === "ENOENT") {
                    console.log(`File not found: ${filename}`);
                } else {
                    console.error(`Error deleting ${filename}:`, err);
                }
            }
        });
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Unexpected error:", error);
    }
}

DepartmentSchema.pre("deleteOne",{document:true,query:false},async function (next) {
    try{
        const employees=await Employee.find({department:this._id});
        const empIds=employees.map(emp=>emp._id)
         const userIds=employees.map(user=>user.userId);
         const users=await User.find({_id:{$in:userIds}});
         await deleteProfileImages(users);
        await Employee.deleteMany({department:this._id});
        await Leave.deleteMany({employeeId:{$in:empIds}})
        await Salary.deleteMany({employeeId:{$in:empIds}})
        await User.deleteMany({_id:{$in:userIds}});
        next();
    }
    catch(error){
        next(error);
    }
})


const Department=new mongoose.model("Department",DepartmentSchema);
export default Department

