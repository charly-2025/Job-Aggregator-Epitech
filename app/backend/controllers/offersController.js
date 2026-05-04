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