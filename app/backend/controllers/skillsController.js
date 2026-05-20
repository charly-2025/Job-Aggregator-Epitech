import db from "../config/db.js";

export const getAllSkills = async (req, res) => {
  try {
    const [skills] = await db.query("SELECT * FROM skills");
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTop10Skills = async (req, res) => {
  try {
    const [skills] = await db.query(
      `SELECT 
            s.skill_id,
            s.name,
            COUNT(jos.offer_id) AS nb_offers,
            (
                SELECT COUNT(*) 
                FROM job_offers
            ) AS total_offers
        FROM job_offer_skills jos
        JOIN skills s 
            ON s.skill_id = jos.skill_id
        GROUP BY s.skill_id, s.name
        ORDER BY nb_offers DESC
        LIMIT 10`,
    );
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
