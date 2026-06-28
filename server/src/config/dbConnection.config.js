import mongoose from "mongoose";

const connectDB=async()=>{
    try{

        const conn=await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("mongo db connected successfully");
        console.log("DB host",conn.connection.host);
        console.log("DB name",conn.connection.name);
       }
    catch(error)
    {
      console.log(error.message)
      process.exit(1);
      
    }
    
};
export default connectDB;