import db from "../config/db.js";

export const getAllOffers = async (req, res) => {
  try {
    const [offers] = await db.query(`
            SELECT offer.*, GROUP_CONCAT(DISTINCT skills.name SEPARATOR ', ') AS skills
            FROM job_offers offer
            LEFT JOIN job_offer_skills jos ON jos.offer_id = offer.offer_id
            LEFT JOIN skills ON skills.skill_id = jos.skill_id`);
    const listOffers = offers.map((offer) => ({
      ...offer,
      skills: offer.skills?.split(", ") ?? [],
    }));
    res.status(200).json(listOffers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOffer = async (req, res) => {
  try {
    const offerId = req.params.offerId;
    let [offer] = await db.query(
      `
            SELECT offer.*, GROUP_CONCAT(DISTINCT skills.name SEPARATOR ', ') AS skills
            FROM job_offers offer
            LEFT JOIN job_offer_skills jos ON jos.offer_id = offer.offer_id
            LEFT JOIN skills ON skills.skill_id = jos.skill_id WHERE offer.offer_id=?`,
      [offerId],
    );
    if (offer.length === 0)
      return res.status(404).json({ message: "offer not found" });

    offer = { ...offer[0], skills: offer[0].skills?.split(", ") ?? [] };

    res.status(200).json(offer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOfferLike = async (req, res) => {
  try {
    const offerId = req.params.offerId;
    let [offer] = await db.query(
      "SELECT user_id FROM job_likes WHERE offer_id=?",
      [offerId],
    );

    if (offer.length === 0)
      return res.status(404).json({ message: "offer not found" });

    let listLike = [];
    offer.forEach((like) => {
      listLike.push(like.user_id);
    });

    res.status(200).json(listLike);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const newOfferView = async (req, res) => {
  try {
    const userId = req.user.id;
    const offerId = req.params.offerId;

    if (!userId || !offerId)
      return res.status(400).json({ message: "bad parameter" });

    const [offer] = await db.query(
      "SELECT * FROM job_offers WHERE offer_id = ?",
      [offerId],
    );
    if (offer.length === 0)
      return res.status(404).json({ message: "offer not found" });

    const [userView] = await db.query(
      "SELECT * FROM job_views WHERE user_id = ? AND offer_id=?",
      [userId, offerId],
    );

    if (userView.length === 0) {
      await db.query("INSERT INTO job_views (user_id,offer_id) VALUES (?,?)", [
        userId,
        offerId,
      ]);
      res.status(200).json({ message: "view added successully" });
    } else {
      res.status(409).json({ message: "view already added" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleOfferLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const offerId = req.params.offerId;

    if (!userId || !offerId)
      return res.status(400).json({ message: "bad parameter" });

    const [offer] = await db.query(
      "SELECT title FROM job_offers WHERE offer_id = ?",
      [offerId],
    );
    if (offer.length === 0)
      return res.status(404).json({ message: "offer not found" });

    const [userLike] = await db.query(
      "SELECT * FROM job_likes WHERE user_id = ? AND offer_id=?",
      [userId, offerId],
    );

    if (userLike.length === 0) {
      await db.query("INSERT INTO job_likes (user_id,offer_id) VALUES (?,?)", [
        userId,
        offerId,
      ]);
      res.status(200).json({ message: "offer liked successfully" });
    } else {
      await db.query("DELETE FROM job_likes WHERE user_id=? and offer_id=?", [
        userId,
        offerId,
      ]);
      res.status(200).json({ message: "offer unliked successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function searchOffers(req, res) {
  try {
    const text = req.params.searchText;
    if (!text?.trim())
      return res.status(400).json({ message: "bad parameter" });

    const searchText = `%${text.trim()}%`;
    const searchParams = [
      searchText,
      searchText,
      searchText,
      searchText,
      searchText,
      searchText,
      searchText,
      searchText,
      searchText,
    ];

    const [offers] = await db.query(
      `
        SELECT offer.*, GROUP_CONCAT(DISTINCT skills.name SEPARATOR ', ') AS skills
        FROM job_offers offer
        LEFT JOIN job_offer_skills jos ON jos.offer_id = offer.offer_id
        LEFT JOIN skills ON skills.skill_id = jos.skill_id
        WHERE offer.title LIKE ? OR offer.location LIKE ?
            OR offer.job_type LIKE ? OR offer.work_type LIKE ? OR offer.about LIKE ? OR offer.salary LIKE ?
            OR offer.requirements LIKE ? OR skills.name LIKE ?
        GROUP BY offer.offer_id
        `,
      searchParams,
    );

    const listOffers = offers
      .slice(0, 15)
      .map((offer) => ({ ...offer, skills: offer.skills?.split(", ") ?? [] }));
    res.status(200).json({ listOffers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const createOffer = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (!userRole || userRole != "admin")
      return res.status(401).json({ message: "unauthorized" });

        const {title,company,location,job_type,work_type,about,requirements,salary,skills} = req.body
        if (!title || !company || !location || !job_type || !work_type || !about || !requirements || !salary || !skills) return res.status(400).json({ message:'bad parameter'});

        const [result] = await db.query("INSERT INTO job_offers (title,company,location,job_type,work_type,about,requirements,salary) VALUES (?,?,?,?,?,?,?,?)",[title,company,location,job_type,work_type,about,requirements,salary])
        const insertId = result.insertId

        skills.forEach( async skill =>{
            const [searchSkill] = await db.query("SELECT * FROM skills WHERE REPLACE(LOWER(name),' ','') = ?",[skill.toLowerCase().replace(/\s/g, '')])
            if (searchSkill.length === 0) {
                const [insertSkill] = await db.query("INSERT INTO skills (name) VALUES (?)",[skill])
                await db.query("INSERT INTO job_offer_skills (offer_id,skill_id) VALUES (?,?)",[insertId,insertSkill.insertId])
            } else {
                await db.query("INSERT INTO job_offer_skills (offer_id,skill_id) VALUES (?,?)",[insertId,searchSkill[0].skill_id])
            }
        })

    res
      .status(200)
      .json({ message: `offer created successfully with id ${insertId}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (!userRole || userRole != "admin")
      return res.status(401).json({ message: "unauthorized" });

    const offerId = req.params.offerId;
    if (!offerId) return res.status(400).json({ message: "bad parameter" });

        const [offer] = await db.query("SELECT * FROM job_offers WHERE offer_id = ?",[offerId])
        if (offer.length === 0) return res.status(404).json({message:"offer not found"})

        const {title,company,location,job_type,work_type,about,requirements,salary,skills} = req.body
        if (!title || !company || !location || !job_type || !work_type || !about || !requirements || !salary || !skills) return res.status(400).json({ message:'bad parameter'});

        await db.query("UPDATE job_offers SET title=?,company=?,location=?,job_type=?,work_type=?,about=?,requirements=?,salary=? WHERE offer_id = ?",[title,company,location,job_type,work_type,about,requirements,salary,offerId])

        await db.query("DELETE jos FROM job_offer_skills jos JOIN job_offers o ON o.offer_id = jos.offer_id WHERE o.offer_id = ?",[offerId])
        
        // if offer doesn't have any skills we start the skill insert function
        skills.forEach( async skill =>{
            const [searchSkill] = await db.query("SELECT * FROM skills WHERE REPLACE(LOWER(name),' ','') = ?",[skill.toLowerCase().replace(/\s/g, '')]) // we search if skill is already in skills table
            if (searchSkill.length === 0) {
                // if not in skills table we insert it
                const [insertSkill] = await db.query("INSERT INTO skills (name) VALUES (?)",[skill])
                await db.query("INSERT INTO job_offer_skills (offer_id,skill_id) VALUES (?,?)",[offerId,insertSkill.insertId])
            } else {
                // else we just get id in skills tables and we make link with job_offer_skills tables
                await db.query("INSERT INTO job_offer_skills (offer_id,skill_id) VALUES (?,?)",[offerId,searchSkill[0].skill_id])
            }
        })

    res.status(200).json({ message: "offer update successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (!userRole || userRole != "admin")
      return res.status(401).json({ message: "unauthorized" });

    const offerId = req.params.offerId;
    if (!offerId) return res.status(400).json({ message: "bad parameter" });

    const [offer] = await db.query(
      "SELECT * FROM job_offers WHERE offer_id = ?",
      [offerId],
    );
    if (offer.length === 0)
      return res.status(404).json({ message: "offer not found" });

    await db.query("DELETE FROM job_offers WHERE offer_id = ?", [offerId]);
    await db.query(
      "DELETE jos FROM job_offer_skills jos JOIN job_offers o ON o.offer_id = jos.offer_id WHERE o.offer_id = ?",
      [offerId],
    );
    await db.query(
      "DELETE job_likes FROM job_likes JOIN job_offers o ON o.offer_id = job_likes.offer_id WHERE o.offer_id =?",
      [offerId],
    );
    await db.query(
      "DELETE job_views FROM job_views JOIN job_offers o ON o.offer_id = job_views.offer_id WHERE o.offer_id =?",
      [offerId],
    );

    res.status(200).json({ message: "offer delete successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
