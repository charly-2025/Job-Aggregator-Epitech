import db from "../config/db.js";

export const getAllOffers = async (req,res)=>{ 
    try {
        const [offers] = await db.query("SELECT * FROM job_offers;")
        res.status(200).json(offers)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
} 


export const getOffer = async (req,res) => {
    try {
        const offerId = req.params.offerId
        let [offer] = await db.query("SELECT * FROM job_offers WHERE offer_id=?",[offerId])

        if (offer.length === 0) return res.status(404).json({message:"offer not found"})
        
        res.status(200).json(offer[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const getOfferLike = async (req,res) => {
    try {
        const offerId = req.params.offerId
        let [offer] = await db.query("SELECT user_id FROM job_likes WHERE offer_id=?",[offerId])

        if (offer.length === 0) return res.status(404).json({message:"offer not found"})
        
        let listLike = []
        offer.forEach(like =>{
            listLike.push(like.user_id)
        })

        res.status(200).json(listLike)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const newOfferView = async (req,res) => {
    try {
        const userId = req.user.id
        const offerId = req.params.offerId

        if (!userId || !offerId) return res.status(400).json({message:"bad parameter"});
        const [userView] = await db.query("SELECT * FROM job_views WHERE user_id = ? AND offer_id=?",[userId,offerId])

        if (userView.length === 0) {
            await db.query("INSERT INTO job_views (user_id,offer_id) VALUES (?,?)",[userId,offerId])
            res.status(200).json({message:"view added successully"})
        } else {
            res.status(409).json({message:"view already added"})
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const handleOfferLike = async (req,res) => {
    try {
        const userId = req.user.id
        const offerId = req.params.offerId

        if (!userId || !offerId) return res.status(400).json({message:"bad parameter"});
        
        const [userLike] = await db.query("SELECT * FROM job_likes WHERE user_id = ? AND offer_id=?",[userId,offerId])

        if (userLike.length === 0) {
            await db.query("INSERT INTO job_likes (user_id,offer_id) VALUES (?,?)",[userId,offerId])
            res.status(200).json({message:"offer liked successfully"})

        } else {
            await db.query("DELETE FROM job_likes WHERE user_id=? and offer_id=?",[userId,offerId])
            res.status(200).json({message:"offer unliked successfully"})

        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function searchOffers(req, res) {
  try {
        const text = req.params.searchText
        if (!text?.trim()) return res.status(400).json({ error: 'Paramètre q requis.' });

        const searchText = `%${text.trim()}%`;
        const searchParams = [searchText, searchText, searchText, searchText, searchText, searchText, searchText, searchText,searchText];

        const [offers] = await db.query(`
        SELECT offer.*, GROUP_CONCAT(DISTINCT skills.name SEPARATOR ', ') AS skills
        FROM job_offers offer
        LEFT JOIN job_offer_skills jos ON jos.offer_id = offer.offer_id
        LEFT JOIN skills ON skills.skill_id = jos.skill_id
        WHERE offer.title LIKE ? OR offer.company LIKE ? OR offer.location LIKE ?
            OR offer.job_type LIKE ? OR offer.work_type LIKE ? OR offer.about LIKE ? OR offer.salary LIKE ?
            OR offer.requirements LIKE ? OR skills.name LIKE ?
        GROUP BY offer.offer_id
        `, searchParams);

        const listOffers = offers.slice(0,15).map(offer => ({...offer,skills: offer.skills?.split(', ') ?? [],}));
        res.status(200).json({listOffers});
  } catch (err) {
    res.status(500).json({ message: err.message });
}
}