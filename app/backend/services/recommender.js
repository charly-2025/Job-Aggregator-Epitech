import natural from "natural";

const { TfIdf } = natural;
/**
 - builds the weighted text of an offer for the TF-IDF
 - title repeated 3 times more, skills doubled to boost
 - fields = table job_offers + skills (table)
 */
function buildOfferText(offer) {
  const title = (offer.title || "").toLowerCase();
  const about = (offer.about || "").toLowerCase();
  const requirements = (offer.requirements || "").toLowerCase();
  const company = (offer.company || "").toLowerCase();
  const location = (offer.location || "").toLowerCase();
  const jobType = (offer.job_type || "").toLowerCase();
  const workType = (offer.work_type || "").toLowerCase();
  const skills = Array.isArray(offer.skills)
    ? offer.skills.map((s) => s.toLowerCase()).join(" ")
    : "";

  return `${title} ${title} ${title} ${skills} ${skills} ${jobType} ${workType} ${location} ${company} ${about} ${requirements}`;
}

function cosineSimilarity(vecA, vecB) {
  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0,
    normA = 0,
    normB = 0;

  for (const key of keys) {
    const a = vecA[key] || 0;
    const b = vecB[key] || 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function buildVectors(offers) {
  const tfidf = new TfIdf();
  offers.forEach((o) => tfidf.addDocument(buildOfferText(o)));

  const vectors = {};
  offers.forEach((offer, idx) => {
    const vec = {};
    tfidf.listTerms(idx).forEach(({ term, tfidf: score }) => {
      vec[term] = score;
    });
    vectors[offer.offer_id] = vec;
  });

  return vectors;
}

export function getSimilarOffers(targetOfferId, allOffers, topK = 5) {
  const target = allOffers.find(
    (o) => String(o.offer_id) === String(targetOfferId),
  );
  if (!target) throw new Error(`Offer ${targetOfferId} not found`);

  const candidates = allOffers.filter(
    (o) => String(o.offer_id) !== String(targetOfferId),
  );
  if (candidates.length === 0) return [];

  const vectors = buildVectors([target, ...candidates]);
  const targetVec = vectors[target.offer_id];

  return candidates
    .map((offer) => ({
      ...offer,
      similarity_score: parseFloat(
        cosineSimilarity(targetVec, vectors[offer.offer_id]).toFixed(4),
      ),
    }))
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, topK);
}

export function getPersonalizedRecommendations(viewedIds, allOffers, topK = 5) {
  if (!viewedIds || viewedIds.length === 0) return [];

  const viewedSet = new Set(viewedIds.map(String));
  const viewed = allOffers.filter((o) => viewedSet.has(String(o.offer_id)));
  const candidates = allOffers.filter(
    (o) => !viewedSet.has(String(o.offer_id)),
  );

  if (viewed.length === 0 || candidates.length === 0) return [];

  const vectors = buildVectors([...viewed, ...candidates]);

  // User profile = average of the vectors of viewed offers
  const allTerms = new Set(
    viewed.flatMap((o) => Object.keys(vectors[o.offer_id] || {})),
  );
  const userProfile = {};
  for (const term of allTerms) {
    const avg =
      viewed.reduce((sum, o) => sum + (vectors[o.offer_id]?.[term] || 0), 0) /
      viewed.length;
    if (avg > 0) userProfile[term] = avg;
  }

  return candidates
    .map((offer) => ({
      ...offer,
      similarity_score: parseFloat(
        cosineSimilarity(userProfile, vectors[offer.offer_id]).toFixed(4),
      ),
    }))
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, topK);
}
export function getRecommendationsBySkills(userSkills, allOffers, topK = 5) {
  if (!userSkills || userSkills.length === 0) return [];

  const tfidf = new TfIdf();

  tfidf.addDocument(userSkills.join(' ').repeat(3).toLowerCase());
  allOffers.forEach(o => tfidf.addDocument(buildOfferText(o)));

  const profileVec = {};
  tfidf.listTerms(0).forEach(({ term, tfidf: score }) => {
    profileVec[term] = score;
  });

  const offerVectors = {};
  allOffers.forEach((offer, idx) => {
    const vec = {};
    tfidf.listTerms(idx + 1).forEach(({ term, tfidf: score }) => {
      vec[term] = score;
    });
    offerVectors[offer.offer_id] = vec;
  });

  return allOffers
    .map(offer => ({
      ...offer,
      similarity_score: parseFloat(
        cosineSimilarity(profileVec, offerVectors[offer.offer_id]).toFixed(4)
      ),
    }))
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, topK);
}