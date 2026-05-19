import { useState, useEffect } from "react";

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
          background: "#0f172a",
          color: "white",
          borderRight: "1px solid #1e293b",
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
                  background: "#1e293b",
                },

                "&:hover": {
                  background: "#1e293b",
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
            <Avatar sx={{ bgcolor: "#7c3aed" }}>
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

function JobCard({ job, onSave, onView }) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await onSave(job);
      setSaved((prev) => !prev);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Card
      sx={{
        background: "#1e293b",
        color: "white",
        borderRadius: 4,
        transition: "0.3s",

        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {job.title}
            </Typography>

            <Typography color="gray">
              {job.company_name}
            </Typography>
          </Box>

          <Chip
            icon={<WorkIcon />}
            label={job.location}
            color="primary"
            sx={{ width: "fit-content" }}
          />

          <Stack direction="row" spacing={1}>
            <Chip
              label={job.job_type}
              color="secondary"
              size="small"
            />

            <Chip
              label={job.work_type}
              size="small"
            />
          </Stack>

          <Typography variant="body2" color="#cbd5e1">
            {job.about}
          </Typography>

          <Typography
            fontWeight="bold"
            color="#38bdf8"
          >
            ${job.salary?.toLocaleString()}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            {job.skills?.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => onView(job)}
            >
              View
            </Button>

            <Button
              variant={saved ? "contained" : "outlined"}
              color="secondary"
              onClick={handleSave}
            >
              {saved ? "Saved" : "Save"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
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
    <Box p={4}>
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
        mb={5}
      >
        Discover the latest opportunities for you
      </Typography>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={job.offer_id}
          >
            <JobCard
              job={job}
              onSave={handleSave}
              onView={handleView}
            />
          </Grid>
        ))}
      </Grid>

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
        background: "#020617",
      }}
    >
      <Sidebar
        user={user}
        active={page}
        setActive={setPage}
      />

      <Box flex={1}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: "#0f172a",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <div
              className="topnav"
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <a
                href="#"
                style={{ color: "white" }}
              >
                <NotificationsNoneOutlinedIcon
                  sx={{ fontSize: 28 }}
                />
              </a>

              <a
                href="#"
                style={{ color: "white" }}
              >
                <DarkModeOutlinedIcon
                  sx={{ fontSize: 28 }}
                />
              </a>

              <a
                href="#"
                style={{ color: "white" }}
              >
                <ExitToAppOutlinedIcon
                  sx={{ fontSize: 28 }}
                />
              </a>
            </div>
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
          <Box p={4}>
            <Typography
              variant="h4"
              color="white"
            >
              Settings
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}