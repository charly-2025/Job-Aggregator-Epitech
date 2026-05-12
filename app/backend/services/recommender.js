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
