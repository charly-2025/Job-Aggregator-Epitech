import { useState, useEffect } from "react";

import Settings from "./pages/settings/settings";
import JobsLiked from "./components/SavedJobs";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Pagination,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";

const BASE_URL = "http://localhost:3001";

const API = {
  profile: `${BASE_URL}/api/users/userInfo`,
  offers: `${BASE_URL}/api/offers/allOffers`,
  likeOffer: (offerId) => `${BASE_URL}/api/offers/handleOfferLike/${offerId}`,
  likedOffers: `${BASE_URL}/api/users/offersUserLikes`,
  refresh: `${BASE_URL}/api/auth/refresh`,
  logout: `${BASE_URL}/api/auth/logout`,
};

async function refreshAccessToken() {
  const res = await fetch(API.refresh, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Session expired");
  }
}

async function apiFetch(url, options = {}) {
  const makeRequest = async () => {
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  };

  try {
    let res = await makeRequest();
    console.log("STATUS:", res.status);
    if (res.status === 401) {
      await refreshAccessToken();

      res = await makeRequest();
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || `HTTP ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(err);

    if (err.message === "Session expired") {
      window.location.href = "/login";
    }

    throw new Error(err.message || "Network error");
  }
}

function ErrorMessage({ message }) {
  return (
    <Box p={3}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}

function Sidebar({ active, setActive, user }) {
  const nav = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      id: "search",
      label: "Search Jobs",
      icon: <SearchIcon />,
    },
    {
      id: "saved",
      label: "Saved Jobs",
      icon: <FavoriteIcon />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <SettingsIcon />,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: 260,
          background: "#141414",
          color: "white",
          borderRight: "1px solid #3b3c3d",
          pt: 12,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box p={3}>
          <div className="logo-holder">
            <img src="/logo.png" alt="logo" className="logo" />
          </div>
        </Box>

        <List sx={{ flexGrow: 1 }}>
          {nav.map((item) => (
            <ListItemButton
              key={item.id}
              selected={active === item.id}
              onClick={() => setActive(item.id)}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 3,

                "&.Mui-selected": {
                  background: "#000000",
                },

                "&:hover": {
                  background:
                    "linear-gradient(90deg, rgba(173,70,255,0.15) 0%, rgba(246,51,154,0.15) 50%, rgba(255,105,0,0.15) 100%)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>

        <Box mt="auto" p={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "#000000" }}>{user?.first_name?.[0]}</Avatar>

            <Box>
              <Typography fontWeight="bold">
                {user?.first_name} {user?.last_name}
              </Typography>

              <Typography variant="body2">{user?.email}</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}

function JobModal({ job, open, onClose, saved, onSaveToggle }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="job-modal-title"
      aria-describedby="job-modal-description"
      PaperProps={{
        sx: {
          background: "#111010",
          color: "white",
          border: "1px solid rgba(187, 37, 167, 0.4)",
          borderRadius: 3,
          boxShadow: "0 0 40px rgba(150, 28, 144, 0.2)",
          minWidth: { xs: "90%", md: 500 },
        },
      }}
    >
      <DialogTitle id="job-modal-title">
        <Typography variant="h6" fontWeight="bold">
          {job.title}
        </Typography>

        <Typography variant="body2" color="gray">
          {job.company_name}
        </Typography>
      </DialogTitle>

      <Divider sx={{ borderColor: "#2a2a2a" }} />

      <DialogContent id="job-modal-description">
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={job.location} size="small" color="primary" />
            <Chip label={job.job_type} size="small" color="secondary" />
            <Chip label={job.work_type} size="small" />
          </Stack>

          <Typography fontWeight="bold" color="#38bdf8">
            ${job.salary?.toLocaleString()}
          </Typography>

          <Typography variant="body2" color="#aaa">
            {job.about}
          </Typography>

          <Divider sx={{ borderColor: "#2a2a2a" }} />

          <Typography variant="body2" color="gray">
            Skills
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {job.skills?.map((skill) => (
              <Chip key={skill} label={skill} size="small" />
            ))}
          </Stack>
        </Stack>
      </DialogContent>

      <Divider sx={{ borderColor: "#2a2a2a" }} />

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "#2a2a2a",
          }}
        >
          Close
        </Button>

        <Button
          variant={saved ? "contained" : "outlined"}
          color="secondary"
          onClick={onSaveToggle}
        >
          {saved ? "Saved" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function JobCard({ job, onSave, initialLiked = false }) {
  const [saved, setSaved] = useState(initialLiked);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSaved(initialLiked);
  }, [initialLiked]);

  const handleSaveToggle = async () => {
    try {
      await onSave(job);

      setSaved((prev) => !prev);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Card
        sx={{
          background: "#111010",
          color: "white",
          borderRadius: 3,
          border: "1px solid #2a2a2a",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",

          "&:hover": {
            boxShadow: "0 0 30px rgba(148, 28, 138, 0.2)",
            borderColor: "rgba(219, 35, 173, 0.4)",
          },
        }}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {job.title}
              </Typography>

              <Typography variant="body2" color="gray">
                {job.company_name}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={job.location} size="small" color="primary" />
              <Chip label={job.job_type} size="small" color="secondary" />
              <Chip label={job.work_type} size="small" />
            </Stack>

            <Typography fontWeight="bold" color="#38bdf8" variant="body2">
              ${job.salary?.toLocaleString()}
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                View
              </Button>

              <Button
                variant={saved ? "contained" : "outlined"}
                color="secondary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveToggle();
                }}
              >
                {saved ? "Saved" : "Save"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {open && (
        <JobModal
          job={job}
          open={open}
          onClose={() => setOpen(false)}
          saved={saved}
          onSaveToggle={handleSaveToggle}
        />
      )}
    </>
  );
}

function Dashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const limit = 15;

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);

        const [response, likedRes] = await Promise.all([
          apiFetch(`${API.offers}?page=${page}&limit=${limit}`),
          apiFetch(API.likedOffers),
        ]);

        setJobs(Array.isArray(response.data) ? response.data : []);

        setLikedIds(
          new Set(
            Array.isArray(likedRes) ? likedRes.map((job) => job.offer_id) : [],
          ),
        );

        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, [page]);

  const handleSave = async (job) => {
    await apiFetch(API.likeOffer(job.offer_id), {
      method: "PUT",
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
  <Box sx={{ pl: 4, pr: 4, pt: 10, flex: 1 }}>
    <Box mb={6}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="white"
      >
        Welcome back <span style={{ color: "purple" }}>{user?.first_name}</span> 👋
      </Typography>

      <Typography
        variant="body1"
        color="gray"
      >
        <h3>Discover the latest job opportunities</h3>
      </Typography>
    </Box>

    <Box sx={{ pl: 4, pr: 4, pt: 10, maxWidth: 1100 }}>       {/* CONTROL PADDING BETWEEN TEXT AND CARDS HERE */}
    
      <Stack spacing={3}>
        {jobs.map((job) => (
          <JobCard key={job.offer_id} job={job} onSave={handleSave} />
        ))}
      </Stack>
    </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={6}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "white",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const [page, setPage] = useState("dashboard");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const data = await apiFetch(API.profile);

        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(API.logout, {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!user) {
    return <ErrorMessage message="Not authenticated" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#000000",
      }}
    >
      <Sidebar user={user} active={page} setActive={setPage} />

      <Box flex={1} sx={{ minWidth: 0, width: "100%"  }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: "#000000",
            borderBottom: "1px solid #3a3939",
            width: "100%",
          }}
        >
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <Box display="flex" gap={2} alignItems="center">
              <NotificationsNoneOutlinedIcon
                sx={{
                  fontSize: 28,
                  color: "white",
                }}
              />

              <DarkModeOutlinedIcon
                sx={{
                  fontSize: 28,
                  color: "white",
                }}
              />

              <ExitToAppOutlinedIcon
                onClick={handleLogout}
                sx={{
                  fontSize: 28,
                  color: "white",
                  cursor: "pointer",
                }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {page === "dashboard" && <Dashboard user={user} />}

        {page === "search" && (
          <Box p={4}>
            <Typography variant="h4" color="white">
              Search Jobs
            </Typography>
          </Box>
        )}

        {page === "saved" && <JobsLiked setActive={setPage} />}

        {page === "settings" && (
          <>
            <Settings user={user} />
          </>
        )}
      </Box>
    </Box>
  );
}
