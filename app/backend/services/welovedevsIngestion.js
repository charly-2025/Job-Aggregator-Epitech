import axios from 'axios';
import db from '../config/db.js';

const WLD_BASE_URL = process.env.WELOVEDEVS_API_URL || 'https://epi-api.welovedevs.com';
const WLD_API_KEY  = process.env.WELOVEDEVS_API_KEY || '';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export function normalizeOffer(raw) {
  //skills:table of strings or d'object { name }
  const skills = (raw.skills || raw.technologies || [])
    .map(s => (typeof s === 'string' ? s : s?.name || ''))
    .filter(Boolean);

  //salary:number, object range, ou string
  let salary = null;
  if (raw.salary != null) {
    salary = typeof raw.salary === 'object'
      ? ((raw.salary.min || 0) + (raw.salary.max || 0)) / 2
      : parseFloat(raw.salary) || null;
  } else if (raw.remuneration != null) {
    salary = parseFloat(raw.remuneration) || null;
  }

  return {
    title:        raw.title || raw.name || '',
    company:      raw.company?.name || raw.companyName || '',
    location:     raw.location || raw.city || raw.place || '',
    job_type:     raw.contract || raw.contractType || raw.type || '',
    work_type:    raw.remote ? 'Remote' : (raw.workType || raw.work_type || 'On-site'),
    about:        raw.description || raw.content || raw.about || '',
    requirements: raw.requirements || raw.skills_description || '',
    salary,
    published_at: raw.publishedAt || raw.createdAt || null,
    source_url:   raw.url || raw.applyUrl || null,
    skills,
  };
}

async function upsertOffer(normalized) {
  const { title, company, location, job_type, work_type, about, requirements, salary, published_at, source_url, skills } = normalized;

  if (!title || !company) return null; // skip the offers incompletes

  const [result] = await db.query(
    `INSERT INTO job_offers (title, company, location, job_type, work_type, about, requirements, salary, published_at, source_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       location = VALUES(location),
       job_type = VALUES(job_type),
       work_type = VALUES(work_type),
       about = VALUES(about),
       requirements = VALUES(requirements),
       salary = VALUES(salary),
       source_url = VALUES(source_url)`,
    [title, company, location, job_type, work_type, about, requirements, salary, published_at, source_url]
  );

  const offerId = result.insertId || null;

  //retires skills only on an INSERT (not on an UPDATE)
  if (offerId && skills.length > 0) {
    for (const skill of skills) {
      const [existingSkill] = await db.query(
        "SELECT * FROM skills WHERE REPLACE(LOWER(name), ' ', '') = ?",
        [skill.toLowerCase().replace(/\s/g, '')]
      );

      let skillId;
      if (existingSkill.length === 0) {
        const [insertSkill] = await db.query('INSERT INTO skills (name) VALUES (?)', [skill]);
        skillId = insertSkill.insertId;
      } else {
        skillId = existingSkill[0].skill_id;
      }

      // Ignore the twins
      await db.query(
        'INSERT IGNORE INTO job_offer_skills (offer_id, skill_id) VALUES (?, ?)',
        [offerId, skillId]
      );
    }
  }

  return offerId;
}


export async function ingestWelovedevsOffers(maxOffers = 100) {
  let page = 1, ingested = 0, skipped = 0, errors = 0;
  const pageSize = 20;

  console.log(`[Ingestion] Démarrage (max: ${maxOffers})`);

  while (ingested + skipped < maxOffers) {
    let rawOffers;
    let totalCount = 0;

    try {
      const response = await axios.get(`${WLD_BASE_URL}/v1`, {
        headers: {
          Authorization: `Bearer ${WLD_API_KEY}`,
          Accept: 'application/json',
        },
        params: { page, limit: pageSize },
        timeout: 10000,
      });

      const data = response.data;
      rawOffers = data?.data || data?.jobs || data?.results || (Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`[Ingestion] Erreur page ${page}:`, err.message);
      break;
    }

    if (!rawOffers || rawOffers.length === 0) {
      console.log(`[Ingestion] Plus d'offres à la page ${page}. Arrêt.`);
      break;
    }

    for (const raw of rawOffers) {
      if (ingested + skipped >= maxOffers) break;
      try {
        const normalized = normalizeOffer(raw);
        const id = await upsertOffer(normalized);
        id ? ingested++ : skipped++;
      } catch (err) {
        console.error(`[Ingestion] Erreur offre ${raw?.id}:`, err.message);
        errors++;
      }
    }

    console.log(`[Ingestion] Page ${page} - ingested: ${ingested}, skipped: ${skipped}`);
    page++;
    
    if (ingested + skipped >= totalCount) break;

    await sleep(1100); //respect rate limit 1 req/s
  }

  console.log(`[Ingestion] Terminé - ingested: ${ingested}, skipped: ${skipped}, errors: ${errors}`);
  return { ingested, skipped, errors };
}