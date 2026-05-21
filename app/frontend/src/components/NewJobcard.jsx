import JobModal from "./Jobmodal";
import { useState, useEffect, useRef } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import "../pages/SearchJobs/SearchJobs.css";
const BASE_URL = "http://localhost:3001";

function formatSalary(salary) {
  if (!salary) return "Non précisé";
  return `$${Number(salary).toLocaleString()}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export default function NewJobCard({ job, onSave, initialLiked = false,similarityScore, isView = false,newViewedOffers, refreshAccessToken, offersLiked, setOffersLiked}) {
  const [saved, setSaved] = useState(initialLiked);
  const cardRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const scorePercent = similarityScore ? Math.round(similarityScore * 100) : null;

  useEffect(() => {
    setSaved(initialLiked);
  }, [initialLiked]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--mx", `${x}%`);
    cardRef.current.style.setProperty("--my", `${y}%`);
  };

  const handleSave = async (retry=false) => {
    try {
      const response = await fetch(`${BASE_URL}/api/offers/handleOfferLike/${job.offer_id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (response.ok) {
        setSaved((p) => !p);
        if (onSave) onSave(job);
        return
      }
      if (response.status === 401 && !retry) {
        refreshAccessToken();
        handleSave(true);
        return
      }

    } catch (err) {
      console.error(err);
    }
  };

  const displayedSkills = (job.skills || []).slice(0, 5);
  const extraCount = (job.skills || []).length - 5;

  return (
    <div className="job-card" ref={cardRef} onMouseMove={handleMouseMove}>
      <div className="job-card-header">
        <div className="job-card-header-in">{scorePercent !== null && (
          <span style={{
            display: "inline-block",
            marginBottom: "8px",
            padding: "2px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            background: scorePercent >= 85 ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
            color: scorePercent >= 85 ? "#22c55e" : "#f59e0b",
            border: `1px solid ${scorePercent >= 85 ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
          }}>
            {scorePercent}% match
          </span>
        )}
        <div className="job-card-info">
          <div className="job-title-row">
            <h3 className="job-title">{job.title}</h3>
          </div>
          <p className="job-company">{job.company_name}</p>
        </div>
        </div>
        <button
          className={`save-btn${saved ? " saved" : ""}`}
          onClick={handleSave}
          aria-label={saved ? "Retirer" : "Sauvegarder"}
        >
          {saved ? (
            <FavoriteIcon style={{ fontSize: 18 }} />
          ) : (
            <FavoriteBorderIcon style={{ fontSize: 18 }} />
          )}
        </button>
      </div>
          
      <div className="job-meta">
        {job.location && (
          <span className="meta-item">
            <LocationOnOutlinedIcon />
            {job.location}
          </span>
        )}
        {job.job_type && (
          <span className="meta-item">
            <BusinessCenterOutlinedIcon />
            {job.job_type}
          </span>
        )}
        {job.salary && (
          <span className="meta-item">
            <AttachMoneyOutlinedIcon />
            {formatSalary(job.salary)}
          </span>
        )}
        {job.published_at && (
          <span className="meta-item">
            <AccessTimeOutlinedIcon />
            {formatDate(job.published_at)}
          </span>
        )}
      </div>

      {job.about && <p className="job-description">{job.about}</p>}

      {displayedSkills.length > 0 && (
        <div className="skill-chips">
          {displayedSkills.map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="skill-chip skill-chip-extra">
              +{extraCount} more
            </span>
          )}
        </div>
      )}
      <div className="job-card-actions">
        <button className="btn-details" onClick={() => {setOpenModal(true);newViewedOffers(job);}}>
          View Details
        </button>

        <a
          href={job.source_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="btn-apply"
        >
          Apply Now
        </a>
      </div>

      <JobModal
        job={job}
        open={openModal}
        onClose={() => setOpenModal(false)}
        saved={saved}
        onSaveToggle={handleSave}
      />
    </div>
  );
}
