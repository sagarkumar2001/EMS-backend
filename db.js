import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectToDatabase = async ()=>{
    const uri=process.env.MONGO_URI;
    try {
        mongoose.connect(uri);
        console.log("Db connected");
    } catch (error) {
        console.log(error);
    }
}
export default connectToDatabase;