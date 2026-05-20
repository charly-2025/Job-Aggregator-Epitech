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
  return (
    <Card
      sx={{
        bgcolor: "#111111",
        borderRadius: 4,
        border: "1px solid #1e1e1e",
        p: 1,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ bgcolor: "#1e1e1e" }}
            />
            <Box flex={1}>
              <Skeleton
                variant="text"
                width="60%"
                sx={{ bgcolor: "#1e1e1e" }}
              />
              <Skeleton
                variant="text"
                width="40%"
                sx={{ bgcolor: "#1e1e1e" }}
              />
            </Box>
          </Stack>
          <Skeleton variant="rounded" height={60} sx={{ bgcolor: "#1e1e1e" }} />
          <Stack direction="row" spacing={1}>
            {[80, 100, 70].map((w, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={w}
                height={28}
                sx={{ bgcolor: "#1e1e1e", borderRadius: 999 }}
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function JobModal({ job, open, onClose, onUnsave }) {
  if (!job) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "#0f0f0f",
          color: "white",
          border: "1px solid #2a2a2a",
          borderRadius: 4,
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
          minWidth: { xs: "90vw", sm: 520 },
          maxWidth: 600,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {job.company_name?.[0]}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="gray" mt={0.3}>
              {job.company_name}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider sx={{ borderColor: "#1e1e1e" }} />

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<LocationOnOutlinedIcon sx={{ fontSize: 14 }} />}
              label={job.location}
              size="small"
              sx={{
                bgcolor: "#1a1a1a",
                color: "#ccc",
                border: "1px solid #2a2a2a",
              }}
            />
            <Chip
              icon={<WorkOutlineIcon sx={{ fontSize: 14 }} />}
              label={job.job_type}
              size="small"
              sx={{
                bgcolor: "#1a1a1a",
                color: "#ccc",
                border: "1px solid #2a2a2a",
              }}
            />
            <Chip
              label={job.work_type}
              size="small"
              sx={{
                bgcolor: "#1a1a1a",
                color: "#ccc",
                border: "1px solid #2a2a2a",
              }}
            />
          </Stack>

          <Box
            sx={{
              bgcolor: "#111827",
              border: "1px solid #1e3a5f",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AttachMoneyIcon sx={{ color: "#38bdf8", fontSize: 20 }} />
            <Typography fontWeight={700} color="#38bdf8" fontSize={18}>
              ${job.salary?.toLocaleString()}
              <Typography
                component="span"
                color="gray"
                fontSize={13}
                fontWeight={400}
                ml={0.5}
              >
                / year
              </Typography>
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="overline"
              color="gray"
              letterSpacing={1.5}
              fontSize={10}
            >
              About the role
            </Typography>
            <Typography
              variant="body2"
              color="#c0c0c0"
              mt={0.5}
              lineHeight={1.7}
            >
              {job.about}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="overline"
              color="gray"
              letterSpacing={1.5}
              fontSize={10}
            >
              Skills required
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              mt={1}
            >
              {job.skills?.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  sx={{
                    bgcolor: "#1a1a1a",
                    color: "white",
                    border: "1px solid #333",
                    fontSize: 12,
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <Divider sx={{ borderColor: "#1e1e1e" }} />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "gray",
            "&:hover": { color: "white", bgcolor: "transparent" },
          }}
        >
          Close
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<FavoriteIcon />}
          onClick={() => {
            onUnsave(job);
            onClose();
          }}
          sx={{ borderRadius: 2 }}
        >
          Unsave
        </Button>
        <Button
          variant="contained"
          size="small"
          endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
          sx={{
            bgcolor: "white",
            color: "black",
            fontWeight: 700,
            borderRadius: 2,
            "&:hover": { bgcolor: "#e0e0e0" },
          }}
        >
          Apply Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function JobCard({ job, onUnsave, onView, index }) {
  return (
    <Fade in timeout={300 + index * 60}>
      <Card
        sx={{
          bgcolor: "#0f0f0f",
          color: "white",
          border: "1px solid #1e1e1e",
          borderRadius: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition:
            "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease",
          "&:hover": {
            borderColor: "#333",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent
          sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {job.company_name?.[0]}
            </Avatar>

            <Box flex={1} minWidth={0}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                noWrap
                title={job.title}
                sx={{ letterSpacing: -0.3 }}
              >
                {job.title}
              </Typography>
              <Typography variant="body2" color="gray" noWrap>
                {job.company_name}
              </Typography>
            </Box>

            <Tooltip title="Unsave">
              <IconButton
                size="small"
                onClick={() => onUnsave(job)}
                sx={{
                  color: "#ff4081",
                  bgcolor: "rgba(255,64,129,0.08)",
                  "&:hover": { bgcolor: "rgba(255,64,129,0.18)" },
                  flexShrink: 0,
                }}
              >
                <FavoriteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack spacing={0.75} mb={2.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnOutlinedIcon sx={{ fontSize: 15, color: "#555" }} />
              <Typography variant="body2" color="#888" fontSize={13}>
                {job.location}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <WorkOutlineIcon sx={{ fontSize: 15, color: "#555" }} />
              <Typography variant="body2" color="#888" fontSize={13}>
                {job.job_type} · {job.work_type}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            color="#777"
            fontSize={13}
            lineHeight={1.6}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 2.5,
              flex: 1,
            }}
          >
            {job.about}
          </Typography>

          <Typography
            variant="body1"
            fontWeight={700}
            color="#38bdf8"
            mb={2}
            fontSize={15}
          >
            ${job.salary?.toLocaleString()}
            <Typography
              component="span"
              color="#555"
              fontSize={12}
              fontWeight={400}
              ml={0.5}
            >
              / yr
            </Typography>
          </Typography>

          <Stack
            direction="row"
            spacing={0.75}
            flexWrap="wrap"
            useFlexGap
            mb={3}
          >
            {job.skills?.slice(0, 3).map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                sx={{
                  bgcolor: "#161616",
                  color: "#aaa",
                  border: "1px solid #2a2a2a",
                  fontSize: 11,
                  height: 24,
                }}
              />
            ))}
            {job.skills?.length > 3 && (
              <Chip
                label={`+${job.skills.length - 3}`}
                size="small"
                sx={{
                  bgcolor: "#161616",
                  color: "#666",
                  border: "1px solid #222",
                  fontSize: 11,
                  height: 24,
                }}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={1} mt="auto">
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => onView(job)}
              sx={{
                color: "white",
                borderColor: "#2a2a2a",
                borderRadius: 2,
                fontSize: 13,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { borderColor: "#555", bgcolor: "#161616" },
              }}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              size="small"
              fullWidth
              endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
              sx={{
                bgcolor: "white",
                color: "black",
                borderRadius: 2,
                fontSize: 13,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              Apply
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
