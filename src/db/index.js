import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected successfully");
    }
    catch(err)
    {
        console.log("DB connection failed", err);
        process.exit(1);
    }
}

export default connectDB;