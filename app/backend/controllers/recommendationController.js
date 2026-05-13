import db from '../config/db.js';
import { getSimilarOffers, getPersonalizedRecommendations } from '../services/recommender.js';
import { ingestWelovedevsOffers } from '../services/welovedevsIngestion.js';

/**
 - loads all active offers with their skills
 - same SQL query as getAllOffers in offersController.js
 */
async function loadAllOffersWithSkills() {
  const [offers] = await db.query(`
    SELECT offer.*, companies.name AS company_name, GROUP_CONCAT(DISTINCT skills.name SEPARATOR ', ') AS skills
    FROM job_offers offer
    LEFT JOIN job_offer_skills jos ON jos.offer_id = offer.offer_id
    LEFT JOIN skills ON skills.skill_id = jos.skill_id
    LEFT JOIN companies ON companies.company_id = offer.company_id
    GROUP BY offer.offer_id
  `);

  return offers.map(offer => ({
    ...offer,
    skills: offer.skills?.split(', ') ?? [],
  }));
}

/**
 - returns offers similar to a given offer
 - used on the offer detail page: "similar offers"
 */
export const similarOffers = async (req, res) => {
  try {
    const offerId = req.params.offerId;
    const topK    = Math.min(parseInt(req.query.top_k) || 5, 20);

    //verifies that the offer exists
    const [offerCheck] = await db.query(
      'SELECT offer_id FROM job_offers WHERE offer_id = ?',
      [offerId]
    );
    if (offerCheck.length === 0) return res.status(404).json({ message: 'offer not found' });

    const allOffers = await loadAllOffersWithSkills();
    const recommendations = getSimilarOffers(offerId, allOffers, topK);

    res.status(200).json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//returns custom recommendations based on view history
export const personalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const topK   = Math.min(parseInt(req.body.top_k) || 5, 20);

    //retrieves the offer_ids that the user has already seen (job_views table)
    const [views] = await db.query(
      'SELECT offer_id FROM job_views WHERE user_id = ?',
      [userId]
    );

    if (views.length === 0) {
      //returns the most recent offers
      const [recent] = await db.query(`
        SELECT offer.*, companies.name AS company_name, GROUP_CONCAT(DISTINCT skills.name SEPARATOR ', ') AS skills
        FROM job_offers offer
        LEFT JOIN job_offer_skills jos ON jos.offer_id = offer.offer_id
        LEFT JOIN skills ON skills.skill_id = jos.skill_id
        LEFT JOIN companies ON companies.company_id = offer.company_id
        GROUP BY offer.offer_id
        ORDER BY offer.created_at DESC
        LIMIT ?
      `, [topK]);

      const listOffers = recent.map(offer => ({
        ...offer,
        skills: offer.skills?.split(', ') ?? [],
        similarity_score: null,
      }));
      return res.status(200).json(listOffers);
    }

    const viewedIds = views.map(v => v.offer_id);
    const allOffers = await loadAllOffersWithSkills();
    const recommendations = getPersonalizedRecommendations(viewedIds, allOffers, topK);

    res.status(200).json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const triggerIngestion = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (!userRole || userRole !== 'admin') {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const maxOffers = Math.min(parseInt(req.query.limit) || 100, 500);

    res.status(202).json({ message: `Ingestion démarrée (max ${maxOffers} offres)` });

    ingestWelovedevsOffers(maxOffers)
      .then(result => console.log('[Ingestion] Terminée :', result))
      .catch(err   => console.error('[Ingestion] Erreur :', err.message));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
