import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from "../models/user.js";
import Token from '../models/token.js';
import Query from "../models/query.js";
import dotenv from 'dotenv';
dotenv.config();

export const signup = async (req, res)=>{
    try{
        const {name, email, password} = req.body;
        if(!name) return res.status(400).send("Name is required");
        if(!email) return res.status(400).send("Email is required");
        if(!password || password.length < 8) {
        return res.status(400).send("Password is required and must be of 8 character");
        }
    let userExists= await User.findOne({email}).exec();
    if (userExists) return res.status(500).send("Email already exists");

const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user= new User({
        name,
        email,
        password:hashedPassword,
    });
    await user.save();
    return res.json({ok:true});
    }
    catch(err){
        console.log(err);
        return res.status(400).send("Error occurred! Please try again later")
    }
}
export const login = async (req, res) => {
    const {email, password}=req.body;
    const user=await User.findOne({email}).exec();
    if(!user) {return res.status(400).send("No user found");
}

    try {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '7d'});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            const token = createTokens(user);
            res.cookie("token",token,{
                maxAge: 1000*60*5,
                httpOnly: true,
                samesite: false,
            });
            const dbToken= new Token({token: token});
            const newToken = await dbToken.save();
            return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,email: user.email, password: user.password, name: user.name, _id: user._id });

        } else {
            return res.status(400).send('Password does not match')
        }
    } catch (error) {
        return res.status(500).send('Authentication Failed!')
    }
}

export const createTokens = (user) => {
    const token = jwt.sign(
        user.toJSON(),
        process.env.SECRET_KEY,
        {expiresIn: "300s", }, 
    );
    return token;
}

export const contact = async (req, res)=>{
    try{
        const {name, email, contact, message} = req.body;
        if(!name) return res.status(400).send("Name is required");
        if(!email) return res.status(400).send("Email is required");
        if(!contact) return res.status(400).send("Contact is required");
        if(!message) return res.status(400).send("Please mention your query");

        const query= new Query({
            name,
            email,
            contact,
            message,
        });
        await query.save();
        return res.json({ok:true});
        }
    catch(err){
        console.log(err);
        return res.status(400).send("Error occurred! Please try again later")
    }
}


export const logout = async (req, res) => {
    try{
        const token = req.cookies["token"];
        await Token.deleteOne({token: token});
        res.clearCookie("token");
        
        return res.status(204).json({message: "Logout successfull!"});
    }
    catch(err){
        return res.status(400).json({"Error": err});
    }
}