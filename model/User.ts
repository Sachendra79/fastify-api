import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Visitor";
}

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true, 
    },
    email:{
        type:String,
        required:true,
        trim:true,
    
    },
    password:
    {
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Admin","Visitor"]
    }
});

export default mongoose.model("User", UserSchema);
