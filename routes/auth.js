import express from 'express';
import {signup, login, contact, logout} from '../controllers/auth.js';
import {validateToken} from './userAuth.js'; 

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/contact",contact);
router.post("/logout",validateToken,logout);

export default router;

