import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config();

const startServer = async ()=>{
    try{
        await connectDB();
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running at port ${process.env.PORT}`)
        });
    }
    catch(err){
        console.log("Connection failed",err);
        process.exit(1);
    }
}

startServer();