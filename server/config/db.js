import { log } from "console";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/quickblog`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;