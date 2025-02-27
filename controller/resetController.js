import jwt from "jsonwebtoken";
import User from '../models/User.js'
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const sendEmail=async (req,res)=>{

    try{
    
    const {email}=req.body;
   
    const mail=await User.findOne({email});
     
    if(!mail){
        return res.status(404).json({success:false,error:"User Not Exists"})
    }
    const JWT_SECRET=process.env.JWT;
    const secret=mail.password+JWT_SECRET;
    const token=jwt.sign({email:mail.email,id:mail._id},secret,{
        expiresIn:"5m"
    })
    const link=`https://ems-backend-dun.vercel.app/api/reset/${mail._id}/${token}`;


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:process.env.EMAIL ,
          pass:process.env.EMAIL_PASS 
        }
      });
      
      var mailOptions = {
        from: process.env.EMAIL,
        to: mail.email,
        subject: 'Password Reset Request',
        html: `<p>Click <a href="${link}">here</a> to reset your password</p>`,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


     res.status(200).json({success:true})
    }
    catch(error){
      res.status(500).json({success:false,error:"Error in verify Email"})
    }
}

export const setPassword=async(req,res)=>{
    try{
    const {id,token}=req.params;
    const {newPassword}=req.body;
    const hashPassword=await bcrypt.hash(newPassword,10);
    await User.findByIdAndUpdate({_id:id},{password:hashPassword});
    return res.status(200).json({success:true});
    
 }
 catch(error){
    return res.status(500).json({success:false,error:"Server Error!!! Try After Sometimes....."});
 }

}


export const  verifyEmail=async(req,res)=>{
   try {
    const {id,token}=req.params;
    const user=await User.findById(id);
    if(!user){
        return res.status(404).json({success:false,error:"User Not Exists"});
    }
    const JWT_SECRET=process.env.JWT;
    const secret=user.password+JWT_SECRET;
    const verify= jwt.verify(token,secret);
    if(!verify){
        return res.status(404).json({success:false,error:"Try Again..."});
    }
    res.redirect(`https://ems-frontend-rho-blush.vercel.app/reset/verify/${id}/${token}`)
    return;
    
   } catch (error) {
    return res.status(500).json({success:false,error:"Try Again..."});
   }
}