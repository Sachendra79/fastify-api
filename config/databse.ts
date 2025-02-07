import mongoose from "mongoose";


require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Failed");
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
