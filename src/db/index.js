import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"

const connectDb = async ()=>{
     try {
           const connectionInstance = await mongoose.connect(`${process.env.MONGODBURL}/${DB_NAME}`)
           console.log(`db connnected  to the instance ${connectionInstance.connection.host}`);
           
     } catch (error) {
           console.log(`error in connectdb ${error}`);
            process.exit(1)
     }
}
export default connectDb;