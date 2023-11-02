import express from 'express';
import jwt, { verify } from 'jsonwebtoken';
import Token from "../models/token.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

export const validateToken = async (req,res,next) =>{
  try{
    
    const token = await req.cookies["token"];

    if(!token){
      return res.json({authorized: false, message: "User is not authenticated"});
    }
  
    const validToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await Token.findOne({ token: token });
    req.name=validToken.name;
    
    if(!validToken || !rootUser) {
      throw new Error("User not found");
    }
    return next();
  }
  catch(error){
    res.status(401).send("Unauthorised: NO token provided"); 
    console.log(error);
  }
}

router.post('/userAuth',validateToken ,async (req, res) => {
  res.json({authorized: true, message: "User is authenticated" , username: req.name});
});

export default router;