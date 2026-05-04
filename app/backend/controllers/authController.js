import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

import db from "../config/db.js"

export const Register = async (req,res) => {
    try {
        const { email, password, last_name, first_name } = req.body;
        if(!email || !password || !last_name || !first_name) return res.status(400).json({msg:"bad parameter"});

        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?",[email]);
        if (existingUser.length>0) return res.status(409).json({msg:"Account already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const [result] = await db.query("INSERT INTO users (email,password_hash,last_name,first_name) VALUES (?,?,?,?)",[email,hashedPassword,last_name,first_name]);
        const token = jwt.sign({id:result.insertId},process.env.JWT_SECRET,{expiresIn:"360h"});
        res.status(200).json({token});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export const Login = async (req,res)=>{
    try {
        const { email, password} = req.body;
        if(!email || !password) return res.status(400).json({msg:"bad parameter"});

        let [user] = await db.query("SELECT * FROM users WHERE email = ?",[email]);
        if (user.length <= 0) return res.status(401).json({msg:"Invalid Credentials"});
        user = user[0]
        
        const same = await bcrypt.compare(password,user.password_hash);
        if(!same) return res.status(401).json({msg:"Invalid Credentials"});

        const token = jwt.sign({id:user.user_id,role:user.role},process.env.JWT_SECRET,{expiresIn:"360h"});
        res.status(200).json({token});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
