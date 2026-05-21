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
import "../SearchJobs/SearchJobs.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NewJobCard from "../../components/NewJobcard";
import JobModal from "../../components/Jobmodal";

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
              <NewJobCard
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
