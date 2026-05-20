import db from "../config/db.js";

export const getAllSkills = async (req, res) => {
  try {
    const [skills] = await db.query("SELECT * FROM skills");
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
