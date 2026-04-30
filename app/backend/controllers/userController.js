import bcrypt from "bcrypt"

import db from "../config/db.js"

export const getUserInfo = async (req,res) => {
    try {
        const user_id = req.user.id

        const [[userInfo]] = await db.query("SELECT email,first_name,last_name,created_at FROM users WHERE user_id = ?",[user_id])

        res.status(200).json(userInfo)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getOffersUserLikes = async (req,res) => {
    try {
        const user_id = req.user.id
        const [OffersUserLikes] = await db.query("SELECT * FROM job_offers JOIN job_likes ON job_offers.offer_id = job_likes.offer_id WHERE job_likes.user_id = ?",[user_id])
        res.status(200).json(OffersUserLikes)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const getOffersUserViews = async (req,res) => {
    try {
        const user_id = req.user.id
        const [OffersUserViews] = await db.query("SELECT * FROM job_offers JOIN job_views ON job_offers.offer_id = job_views.offer_id WHERE job_views.user_id = ?",[user_id])
        res.status(200).json(OffersUserViews)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const updateUserInfo = async (req,res) => {
    try {
        const user_id = req.user.id
        const {email, password, last_name, first_name } = req.body;
        if(!email || !password || !last_name || !first_name) return res.status(400).json({message:"bad parameter"});

        let [user] = await db.query("SELECT * FROM users WHERE user_id = ?",[user_id]);
        if (user.length <= 0) return res.status(401).json({msg:"Invalid Credentials"});
        user = user[0]

        const same = await bcrypt.compare(password,user.password_hash);
        if(!same) return res.status(401).json({message:"Invalid Password"});

        await db.query("UPDATE users SET email=?,last_name=?,first_name=? WHERE user_id = ?",[email,last_name,first_name,user_id])
        res.status(200).json({ message: "user info update" })

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const updateUserPassword = async (req,res) => {
    try {
        const user_id = req.user.id
        const {password, newPassword} = req.body;
        if(!password || !newPassword) return res.status(400).json({message:"bad parameter"});

        let [user] = await db.query("SELECT * FROM users WHERE user_id = ?",[user_id]);
        if (user.length <= 0) return res.status(401).json({msg:"Invalid Credentials"});
        user = user[0]

        const same = await bcrypt.compare(password,user.password_hash);
        if(!same) return res.status(401).json({message:"Invalid Password"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query("UPDATE users SET password_hash = ? WHERE user_id = ?",[hashedPassword,user_id])
        res.status(200).json({ message: "password update" })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}