import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
    console.log(process.env.DATABASE_URL);
  try {
    const response = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`)
    console.log(response);
    
  } catch (error) {
    console.log("Error in connection : ",error);
    process.exit(1)    
  }
}

export default connectDb