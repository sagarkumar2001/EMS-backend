import mongoose, { Schema } from 'mongoose';
const userScehma=new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String,enum:["admin","employee"],required:true},
    profileImage:{type:String},
    createAt:{type:Date,default:Date.now},
    updateAt:{type:Date,default:Date.now}
})

export default mongoose.model('user',userScehma);