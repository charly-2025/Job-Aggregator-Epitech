import { useState, useEffect, useRef } from "react";

import Settings from "./pages/settings/settings";

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
  Modal,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkIcon from "@mui/icons-material/Work";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";


const BASE_URL = "http://localhost:3001";

const API = {
  profile: `${BASE_URL}/api/users/userInfo`,
  offers: `${BASE_URL}/api/offers/allOffers`,
};

async function apiFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || `HTTP ${res.status}`);
    }

    return data;
  } catch (err) {
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
      icon: <BookmarkIcon />,
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
                  background: "#fafafa",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>

        <Box mt="auto" p={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "#000000" }}>
              {user?.first_name?.[0]}
            </Avatar>

            <Box>
              <Typography fontWeight="bold">
                {user?.first_name} {user?.last_name}
              </Typography>

              <Typography variant="body2">
                {user?.email}
              </Typography>
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
          border: "1px solid rgba(132,0,255,0.4)",
          borderRadius: 3,
          boxShadow: "0 0 40px rgba(132,0,255,0.2)",
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

          <Typography variant="body2" color="gray">Skills</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {job.skills?.map((skill) => (
              <Chip key={skill} label={skill} size="small" />
            ))}
          </Stack>
        </Stack>
      </DialogContent>

      <Divider sx={{ borderColor: "#2a2a2a" }} />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: "white", borderColor: "#2a2a2a" }}>
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

function JobCard({ job, onSave }) {
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);

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
      <Card sx={{
        background: "#111010",
        color: "white",
        borderRadius: 3,
        border: "1px solid #2a2a2a",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
          boxShadow: "0 0 30px rgba(132,0,255,0.2)",
          borderColor: "rgba(132,0,255,0.4)",
        },
      }}>
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

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const limit = 15;

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);

        const response = await apiFetch(
          `${API.offers}?page=${page}&limit=${limit}`
        );

        setJobs(
          Array.isArray(response.data)
            ? response.data
            : []
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
    console.log("save", job.offer_id);
  };

  const handleView = (job) => {
    console.log("view", job);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={10}
      >
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
        Welcome back {user?.first_name} 👋
      </Typography>

      <Typography
        variant="body1"
        color="gray"
      >
        Discover the latest opportunities for you
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
        <Box
          display="flex"
          justifyContent="center"
          mt={6}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) =>
              setPage(value)
            }
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
    return (
      <ErrorMessage message="Not authenticated" />
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "#000000",
      }}
    >
      <Sidebar
        user={user}
        active={page}
        setActive={setPage}
    />

    <Box flex={1} sx={{ minWidth: 0}}>

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
        <Box display="absolute" gap={2} alignItems="center">
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 28, color: "white" }} />
          <DarkModeOutlinedIcon sx={{ fontSize: 28, color: "white" }} />
          <ExitToAppOutlinedIcon sx={{ fontSize: 28, color: "white" }} />
        </Box>
      </Toolbar>
    </AppBar>

        {page === "dashboard" && (
          <Dashboard user={user} />
        )}

        {page === "search" && (
          <Box p={4}>
            <Typography
              variant="h4"
              color="white"
            >
              Search Jobs
            </Typography>
          </Box>
        )}

        {page === "saved" && (
          <Box p={4}>
            <Typography
              variant="h4"
              color="white"
            >
              Saved Jobs
            </Typography>
          </Box>
        )}

        {page === "settings" && (
          <>
            <Settings user={user} />
          </>
        )}
      </Box>
    </Box>
  );
}