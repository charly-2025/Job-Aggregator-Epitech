import db from "../config/db.js";

export const getCompanyInfo = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    if (!companyId) return res.status(400).json({ message: "bad parameter" });

    const [company] = await db.query(
      "SELECT company_id,name,description,website FROM companies WHERE company_id = ?",
      [companyId],
    );
    if (company.length === 0)
      return res.status(404).json({ message: "companies not found" });

    res.status(200).json({ ...company[0] });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const getCompanyReview = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    if (!companyId) return res.status(400).json({ message: "bad parameter" });

    const [company] = await db.query(
      "SELECT * FROM companies WHERE company_id = ?",
      [companyId],
    );
    if (company.length === 0)
      return res.status(404).json({ message: "companies not found" });

    const [companyReviews] = await db.query(
      "SELECT cr.* FROM company_reviews cr JOIN companies c ON cr.company_id = c.company_id WHERE c.company_id = ?",
      [companyId],
    );

    res.status(200).json({ ...company[0], companyReviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const postCompanyReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.companyId;

    const { comment, rating } = req.body;
    if ((!userId, !companyId, !comment, !rating))
      return res.status(400).json({ message: "bad parameter" });

    const [userReview] = await db.query(
      "SELECT * FROM company_reviews WHERE user_id = ? AND company_id = ?",
      [userId, companyId],
    );
    if (userReview.length > 0)
      return res.status(409).json({ message: "user already make a reviews" });

    await db.query(
      "INSERT INTO company_reviews (user_id,company_id,comment,rating) VALUES (?,?,?,?)",
      [userId, companyId, comment, rating],
    );

    res.status(200).json({ message: "reviews posted successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const deleteCompanyReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.companyId;

    if ((!userId, !companyId))
      return res.status(400).json({ message: "bad parameter" });

    const [userReview] = await db.query(
      "SELECT * FROM company_reviews WHERE user_id = ? AND company_id = ?",
      [userId, companyId],
    );
    if (userReview.length === 0)
      return res.status(404).json({ message: "reviews not found" });

    const userReviewId = userReview[0].user_id;
    if (userId !== userReviewId)
      return res.status(401).json({ message: "Unauthorized" });
    else if (req.user.role && req.user.role === "admin") {
    }

    await db.query(
      "DELETE FROM company_reviews WHERE user_id = ? AND company_id = ?",
      [userId, companyId],
    );

    res.status(200).json({ message: "reviews deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
