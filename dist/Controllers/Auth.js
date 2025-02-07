"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User_js_1 = require("../model/User.js");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const signup = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //getting the data to verify 
        const { name, email, password, role } = req.body;
        // if user already exists or not
        const existingUser = yield User_js_1.default.findOne({ email });
        if (existingUser) {
            return reply.status(400).send({
                success: false,
                message: "User already exists"
            });
        }
        // securing password by hashing 
        let hashedPassword;
        try {
            hashedPassword = yield bcrypt.hash(password, 10);
        }
        catch (_a) {
            return reply.status(500).send({
                success: false,
                message: "error in hashing password",
            });
        }
        // Create user entry in database
        const user = yield User_js_1.default.create({
            name,
            email,
            password: hashedPassword,
            role
        });
        reply.status(201).send({
            success: true,
            data: user,
            message: "User created successfully"
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        reply.status(500).send({ success: false, message: "User can't be registered, try again" });
    }
});
exports.signup = signup;
const login = (req, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return reply.status(400).send({
                success: false,
                message: "PLease fill all the details carefully"
            });
        }
        const user = yield User_js_1.default.findOne({ email });
        // if not entry found while entruing
        if (!user) {
            return reply.status(401).send({
                success: false,
                message: "User not found. Please sign up"
            });
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };
        //verifying and genrating JWT token
        if (yield bcrypt.compare(password, user.password)) { // means password match
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            }); //created token
            return reply.status(200).send({
                success: true,
                token,
                message: "Logged in Successfully"
            });
        }
        else {
            //password do not match
            return reply.status(403).send({
                success: false,
                message: "password do not match"
            });
        }
    }
    catch (error) {
        console.log(error);
        return reply.status(500).send({
            success: false,
            message: "Login Failed"
        });
    }
});
exports.login = login;
