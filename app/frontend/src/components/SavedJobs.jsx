import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import "../pages/SearchJobs/SearchJobs.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WorkOutlineIcon from "@mui/icons-material/WorkOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

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

const BASE_URL = "http://localhost:3001";

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

function JobModal({ job, open, onClose, onUnsave }) {}

function JobCard({ job, onSave, initialLiked = false, onRemove }) {
  const [saved, setSaved] = useState(initialLiked);
  const cardRef = useRef(null);

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

  const handleSave = async () => {
    try {
      await fetch(`${BASE_URL}/api/offers/handleOfferLike/${job.offer_id}`, {
        method: "PUT",
        credentials: "include",
      });

      const newSaved = !saved;

      setSaved(newSaved);

      if (!newSaved && onRemove) {
        onRemove(job.offer_id);
      }

      if (onSave) onSave(job);
    } catch (err) {
      console.error(err);
    }
  };

  const displayedSkills = (job.skills || []).slice(0, 5);
  const extraCount = (job.skills || []).length - 5;

  return (
    <div className="job-card" ref={cardRef} onMouseMove={handleMouseMove}>
      <div className="job-card-header">
        <div className="job-card-info">
          <div className="job-title-row">
            <h3 className="job-title">{job.title}</h3>
          </div>

          <p className="job-company">{job.company_name}</p>
        </div>

        <button
          className={`save-btn${saved ? " saved" : ""}`}
          onClick={handleSave}
          aria-label={saved ? "Retirer" : "Sauvegarder"}
        >
          {saved ? (
            <FavoriteIcon style={{ fontSize: 18, color: "red" }} />
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
        <button className="btn-details">View Details</button>

        <a
          href={job.source_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="btn-apply"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}

function EmptyState({ onBrowse }) {
  return (
    <Fade in timeout={400}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 100,
            height: 100,
            mb: 4,
            "&::before": {
              content: '""',
              position: "absolute",
              inset: -12,
              borderRadius: "50%",
              border: "1px solid #1e1e1e",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: -24,
              borderRadius: "50%",
              border: "1px solid #161616",
            },
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              bgcolor: "#111",
              border: "1px solid #2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FavoriteBorderIcon sx={{ fontSize: 42, color: "#333" }} />
          </Box>
        </Box>

        <Typography
          variant="h5"
          fontWeight={700}
          color="white"
          mb={1}
          letterSpacing={-0.5}
        >
          No saved jobs yet
        </Typography>
        <Typography
          color="#555"
          mb={4}
          maxWidth={340}
          lineHeight={1.6}
          fontSize={14}
        >
          Start exploring opportunities and save the ones that catch your eyes,
          they'll all appear here.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<DashboardIcon />}
          onClick={onBrowse}
          sx={{
            marginTop: 5,
            bgcolor: "white",
            color: "black",
            fontWeight: 700,
            px: 4,
            py: 1.3,
            borderRadius: 3,
            fontSize: 14,
            textTransform: "none",
            letterSpacing: -0.2,
            boxShadow: "0 0 40px rgba(255,255,255,0.1)",
            "&:hover": {
              bgcolor: "#e8e8e8",
              boxShadow: "0 0 60px rgba(255,255,255,0.15)",
            },
          }}
        >
          Browse Jobs
        </Button>
      </Box>
    </Fade>
  );
}

const JobsLiked = ({ setActive }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    apiFetch(`${BASE_URL}/api/users/offersUserLikes`)
      .then((data) => setJobs(Array.isArray(data) ? data : data.jobs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (job) => {
    try {
      await apiFetch(`${BASE_URL}/api/offers/handleOfferLike/${job.offer_id}`, {
        method: "PUT",
      });
      setJobs((prev) => prev.filter((j) => j.offer_id !== job.offer_id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "85.9vw",
        bgcolor: "#0a0a0a",
        color: "white",
        p: { xs: 2, sm: 3, md: 4 },
        marginTop: 6,
      }}
    >
      <Box mb={5}>
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography
              variant="h1"
              fontWeight="Bold"
              letterSpacing={-0.8}
              lineHeight={1.1}
              sx={{ fontSize: { xs: 26, sm: 32 } }}
            >
              Saved Jobs
            </Typography>
            {!loading && (
              <Typography variant="body2" color="#555" mt={0.75}>
                {jobs.length === 0
                  ? ""
                  : `${jobs.length} job${jobs.length > 1 ? "s" : ""} saved`}
              </Typography>
            )}
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 3,
            height: 1,
            background: "linear-gradient(90deg, #1e1e1e 0%, transparent 100%)",
          }}
        />
      </Box>

      {!loading && jobs.length === 0 && (
        <EmptyState onBrowse={() => setActive?.("dashboard")} />
      )}

      {!loading && jobs.length > 0 && (
        <Grid container spacing={3}>
          {jobs.map((job, index) => (
            <Grid item xs={12} sm={6} lg={4} key={job.offer_id ?? index}>
              <JobCard
                job={job}
                initialLiked={true}
                onRemove={(offerId) => {
                  setJobs((prev) => prev.filter((j) => j.offer_id !== offerId));
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <JobModal
        job={selectedJob}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUnsave={handleUnsave}
      />
    </Box>
  );
};

export default JobsLiked;
