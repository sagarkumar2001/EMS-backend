import connectToDatabase from './db.js';
import user from './models/User.js';
import bcrypt from 'bcrypt';

const userRegister= async ()=>{
    try {
        connectToDatabase();
        const hashPassword=await bcrypt.hash("admin",10);
        const newUser= new user({
           name:'Admin',
           email:'admin@gmail.com',
           role:'admin',
           password:hashPassword
        })
        await newUser.save();
        
    } catch (error) {
        // alert(`${error} found`);
    }
}

userRegister();