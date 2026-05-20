import React, { useEffect, useState } from "react";
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

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WorkOutlineIcon from "@mui/icons-material/WorkOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloseIcon              from "@mui/icons-material/Close";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";


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

function CardSkeleton() {
  const sk = (w, h, radius = "4px") => (
    <Skeleton variant="rounded" width={w} height={h} sx={{ bgcolor: "#141414", borderRadius: radius }} />
  );
  return (
    <Card sx={{ bgcolor: "#0d0d0d", border: "1px solid #141414", borderRadius: "14px" }}>
      <CardContent sx={{ p: "22px !important" }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              {sk("42%", 20)} <Box mt={0.75}>{sk("22%", 14)}</Box>
            </Box>
            <Skeleton variant="circular" width={26} height={26} sx={{ bgcolor: "#141414" }} />
          </Stack>
          {sk("65%", 14)}
          <Stack direction="row" spacing={1}>
            {[58, 70, 62, 75].map((w, i) => sk(w, 22, "5px"))}
          </Stack>
          <Stack direction="row" spacing={1}>
            {sk("100%", 34, "8px")} {sk(90, 34, "8px")}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
 
function JobModal({ job, open, onClose, onUnsave }) {

}

function JobCard({ job, onUnsave, onView, index }) {
  const postedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;
 
  const metaItems = [
    { icon: <LocationOnOutlinedIcon sx={{ fontSize: 14, color: "#f7f7f7ff" }} />, label: job.location },
    { icon: <WorkOutlineIcon       sx={{ fontSize: 14, color: "#f7f7f7ff" }} />, label: job.job_type },
    { icon: <AttachMoneyIcon       sx={{ fontSize: 14, color: "#f7f7f7ff" }} />, label: `$${job.salary?.toLocaleString()}` },
    ...(postedDate ? [{ icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: "#f7f7f7ff" }} />, label: postedDate }] : []),
  ];
 
  return (
    <Fade in timeout={200 + index * 50}>
      <Card sx={{
        bgcolor: "#0d0d0d", color: "white", border: "1px solid #141414", borderRadius: "14px",
        transition: "border-color 0.2s, transform 0.2s",
        "&:hover": { borderColor: "#252525", transform: "translateY(-1px)" },
      }}>
        <CardContent sx={{ p: "22px !important" }}>
 
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={0.5}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.4, color: "#ececec", lineHeight: 1.3, pr: 2 }}>
              {job.title}
            </Typography>
            <Tooltip title="Unsave">
              <IconButton size="small" onClick={() => onUnsave(job)} sx={{
                width: 28, height: 28, flexShrink: 0, color: "#ff0000ff",
                transition: "color 0.15s",
                "&:hover": { color: "#f8f8f8ff", bgcolor: "rgba(255,77,109,0.08)" },
              }}>
                <FavoriteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
 
          <Typography sx={{ fontSize: 13, color: "#f7f7f7ff", mb: 1.75 }}>{job.company_name}</Typography>
 
          <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap alignItems="center" mb={2}>
            {metaItems.map(({ icon, label }, i) => (
              <Stack key={i} direction="row" spacing={0.6} alignItems="center">
                {icon}
                <Typography sx={{ fontSize: 13, color: "#a88c8cff" }}>{label}</Typography>
              </Stack>
            ))}
          </Stack>
 
          <Typography sx={{
            fontSize: 13, color: "#a88c8cff", lineHeight: 1.65, mb: 2,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {job.about}
          </Typography>
 
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap mb={2.5}>
            {job.skills?.slice(0, 5).map((s) => (
              <Chip key={s} label={s} size="small" sx={{
                bgcolor: "#111", color: "#f7f7f7ff", border: "1px solid #1c1c1c",
                fontSize: 11, height: 22, borderRadius: "5px",
              }} />
            ))}
            {job.skills?.length > 5 && (
              <Chip label={`+${job.skills.length - 5} more`} size="small" sx={{
                bgcolor: "transparent", color: "#f7f7f7ff", border: "1px solid #1a1a1a",
                fontSize: 11, height: 22, borderRadius: "5px",
              }} />
            )}
          </Stack>
 
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" fullWidth onClick={() => onView(job)} sx={{
              color: "#dcbdbdff", borderColor: "#1c1c1c", borderRadius: "8px", fontSize: 13,
              textTransform: "none", fontWeight: 500, py: 0.85,
              "&:hover": { borderColor: "#2a2a2a", color: "#ccc", bgcolor: "#0f0f0f" },
            }}>
              View Details
            </Button>
          </Stack>
 
        </CardContent>
      </Card>
    </Fade>
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
          Start exploring opportunities and save the ones that catch your eyes —
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
              variant="h4"
              fontWeight={800}
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

          {!loading && jobs.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DashboardIcon sx={{ fontSize: 16 }} />}
              onClick={() => setActive?.("dashboard")}
              sx={{
                color: "white",
                borderColor: "#2a2a2a",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 13,
                "&:hover": { borderColor: "#555", bgcolor: "#111" },
              }}
            >
              Browse more
            </Button>
          )}
        </Stack>

        <Box
          sx={{
            mt: 3,
            height: 1,
            background: "linear-gradient(90deg, #1e1e1e 0%, transparent 100%)",
          }}
        />
      </Box>

      {loading && (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <CardSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && jobs.length === 0 && (
        <EmptyState onBrowse={() => setActive?.("dashboard")} />
      )}

      {!loading && jobs.length > 0 && (
        <Grid container spacing={3}>
          {jobs.map((job, index) => (
            <Grid item xs={12} sm={6} lg={4} key={job.offer_id ?? index}>
              <JobCard
                job={job}
                index={index}
                onUnsave={handleUnsave}
                onView={handleView}
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
