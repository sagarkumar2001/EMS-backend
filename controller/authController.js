import User from '../models/User.js';  
import bcrypt from 'bcrypt';  
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';
dotenv.config(); 

const jwtKey = process.env.JWT;  

const login = async (req, res, next) => {  
    try {  
        const { email, password } = req.body;  

        // Validate the presence of email and password  
        if (!email || !password) {  
            return res.status(400).json({ success: false, error: 'Email and password are required.' });  
        }  

        // Find the user by email  
        const user = await User.findOne({ email });  
        if (!user) {  
            return res.status(404).json({ success: false, error: 'User not found!' });  
        }  

        // Compare the password with the hashed password  
        const check = await bcrypt.compare(password, user.password);  
        if (!check) {  
            return res.status(401).json({ success: false, error: 'Wrong password!' });  
        }  

        // Generate token if everything is ok  
        const token = jwt.sign({ _id: user._id, role: user.role }, jwtKey, { expiresIn: "10d" });  
        return res.status(200).json({ success: true, token, user: { _id: user._id, role: user.role, name: user.name } });  

    } catch (error) {  
        console.error(error); // Log the error for debugging purposes  
        return res.status(500).json({ success: false, error: error.message });  
    }  
};  

const verify=(req,res)=>{
    return res.status(200).json({success:true,user:req.user})
}
export { login,verify };