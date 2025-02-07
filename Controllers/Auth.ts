import { FastifyRequest, FastifyReply } from "fastify";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
import User, { IUser } from "../model/User.js";


require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signup = async (req: FastifyRequest, reply: FastifyReply) => {
  try {

    //getting the data to verify 
    const { name, email, password, role } = req.body as IUser;

    // if user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return reply.status(400).send({
         success: false,
          message: "User already exists"
         });
    }

    // securing password by hashing 
  let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch {
      return reply.status(500).send({
        success: false,
        message: "error in hashing password",
      });
    }

    // Create user entry in database
    const user = await User.create({
         name,
          email,
           password: hashedPassword,
            role });

    reply.status(201).send({
         success: true,
          data: user, 
          message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    reply.status(500).send({ success: false, message: "User can't be registered, try again" });
  }
};



export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = req.body as {
         email: string; 
         password: string };

    if (!email || !password) {
      return reply.status(400).send({ 
        success: false,
         message: "PLease fill all the details carefully" });
    }

    const user = await User.findOne({ email });

    // if not entry found while entruing
    if (!user) {
      return reply.status(401).send({ 
        success: false,
         message: "User not found. Please sign up" });
    }

    
 const payload =
 {
    email:user.email,
    id: user._id,
    role:user.role,
 }

//verifying and genrating JWT token

if(await bcrypt.compare(password,user.password))
{// means password match
    
    let token = jwt.sign(payload,process.env.JWT_SECRET,
        {  
            expiresIn:"2h",
        })  //created token
   
        return reply.status(200).send({
            success:true,
            token,
            message:"Logged in Successfully"
        })
}
else
{
    //password do not match
    return reply.status(403).send({
        success:false,
        message:"password do not match"
    })
}
    } catch (error) {
        console.log(error);
        return reply.status(500).send({
            success:false,
            message:"Login Failed"
        })
    }
};
