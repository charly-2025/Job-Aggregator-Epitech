import bcrypt from "bcrypt"

import db from "../config/db.js"

export const getUserInfo = async (req,res) => {
    try {
        const userId = req.user.id

        const [userInfo] = await db.query("SELECT email,first_name,last_name,created_at FROM users WHERE user_id = ?",[userId])
        if (userInfo.length === 0) return res.status(404).json({message:"user not found"})

        res.status(200).json(userInfo[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getOffersUserLikes = async (req,res) => {
    try {
        const userId = req.user.id

        const [userInfo] = await db.query("SELECT created_at FROM users WHERE user_id = ?",[userId])
        if (userInfo.length === 0) return res.status(404).json({message:"user not found"})

        const [OffersUserLikes] = await db.query(
            `
            SELECT offer.*, GROUP_CONCAT(DISTINCT skills.name SEPARATOR ', ') AS skills
            FROM job_offers offer
            LEFT JOIN job_offer_skills jos ON jos.offer_id = offer.offer_id
            LEFT JOIN skills ON skills.skill_id = jos.skill_id
            JOIN job_likes jl ON jl.offer_id = offer.offer_id
            WHERE jl.user_id = ?
            GROUP BY offer.offer_id
            `
            ,[userId])

        const listOffers = OffersUserLikes.map(offer => ({...offer,skills: offer.skills?.split(', ') ?? [],}));

        res.status(200).json(listOffers)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const getOffersUserViews = async (req,res) => {
    try {
        const userId = req.user.id
        if (!userId) return res.status(400).json({ message: "bad parameter" });

        const [userInfo] = await db.query("SELECT created_at FROM users WHERE user_id = ?",[userId])
        if (userInfo.length === 0) return res.status(404).json({message:"user not found"})

        const [OffersUserViews] = await db.query(
             `
            SELECT offer.*, GROUP_CONCAT(DISTINCT skills.name SEPARATOR ', ') AS skills
            FROM job_offers offer
            LEFT JOIN job_offer_skills jos ON jos.offer_id = offer.offer_id
            LEFT JOIN skills ON skills.skill_id = jos.skill_id
            JOIN job_views jv ON jv.offer_id = offer.offer_id
            WHERE jv.user_id = ?
            GROUP BY offer.offer_id
            `
            ,[userId])

        const listOffers = OffersUserViews.map(offer => ({...offer,skills: offer.skills?.split(', ') ?? [],}));
        
        res.status(200).json(listOffers)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const updateUserInfo = async (req,res) => {
    try {
        const userId = req.user.id
        const {email, password, last_name, first_name } = req.body;
        if(!userId || !email || !password || !last_name || !first_name) return res.status(400).json({message:"bad parameter"});

        let [user] = await db.query("SELECT * FROM users WHERE user_id = ?",[userId]);
        if (user.length <= 0) return res.status(404).json({message:"user not found"});
        user = user[0]

        const same = await bcrypt.compare(password,user.password_hash);
        if(!same) return res.status(401).json({message:"Invalid Credentials"});

        await db.query("UPDATE users SET email=?,last_name=?,first_name=? WHERE user_id = ?",[email,last_name,first_name,userId])
        res.status(200).json({ message: "user info update" })

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const updateUserPassword = async (req,res) => {
    try {
        const userId = req.user.id
        const {password, newPassword} = req.body;
        if(!userId || !password || !newPassword) return res.status(400).json({message:"bad parameter"});

        let [user] = await db.query("SELECT * FROM users WHERE user_id = ?",[userId]);
        if (user.length <= 0) return res.status(404).json({message:"user not found"});
        user = user[0]

        const same = await bcrypt.compare(password,user.password_hash);
        if(!same) return res.status(401).json({message:"Invalid Credentials"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query("UPDATE users SET password_hash = ? WHERE user_id = ?",[hashedPassword,userId])
        res.status(200).json({ message: "password update" })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const deleteUser = async (req,res) => {
    try {
        const userId = req.user.id
        const {password} = req.body;
        if(!userId ||!password) return res.status(400).json({message:"bad parameter"});

        let [user] = await db.query("SELECT * FROM users WHERE user_id = ?",[userId]);
        if (user.length <= 0) return res.status(404).json({message:"user not found"});
        user = user[0]

        const same = await bcrypt.compare(password,user.password_hash);
        if(!same) return res.status(401).json({message:"Invalid Credentials"});

        await db.query("DELETE FROM users WHERE user_id = ?",[userId])
        res.status(200).json({ message: "user delete" })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}