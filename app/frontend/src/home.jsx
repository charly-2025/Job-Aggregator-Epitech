import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";


import Settings from "./pages/settings/settings";
import JobsLiked from "./components/SavedJobs";
import SearchJobs from "./pages/SearchJobs/SearchJobs";

import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

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
  IconButton,
  useMediaQuery
} from "@mui/material";

import "./home.css";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
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
  UserViews: `${BASE_URL}/api/users/offersUserViews`,
  recommendations: `${BASE_URL}/api/recommendations/by-skills`,
};

async function refreshAccessToken() {
  const res = await fetch(API.refresh, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Session expired");
  } else {
    console.log("Token refreshed");
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();

  const isMobile = useMediaQuery("(max-width:700px)");

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "search", label: "Search Jobs", icon: <SearchIcon /> },
    { id: "saved", label: "Saved Jobs", icon: <FavoriteIcon /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box
      sx={{
        padding:0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#141414",
      }}
    >
      <Box
        sx={{
          padding:"0 20px",
          paddingLeft: 3.5,
          margin: 0,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <img src="/logo.png" alt="logo" className="navbar-logo" />

        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{ color: "white",}}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <List
        sx={{
          flexGrow: 1,
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {nav.map((item) => (
          <ListItemButton
            key={item.id}
            selected={active === item.id}
            onClick={() => {
              setActive(item.id);

              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            sx={{
              maxHeight: 48,
              borderRadius: "16px",
              px: 2,
              py: 0.25,

              transition: "all 0.2s ease",

              "& .MuiListItemIcon-root": {
                minWidth: "42px",
                color: "#bdbdbd",
              },

              "& .MuiTypography-root": {
                fontSize: "0.96rem",
                fontWeight: 500,
                color: "#d7d7d7",
              },

              "&.Mui-selected": {
                background:
                  "linear-gradient(90deg, rgba(173,70,255,0.18) 0%, rgba(246,51,154,0.18) 50%, rgba(255,105,0,0.18) 100%)",

                border: "1px solid rgba(255,255,255,0.08)",

                "& .MuiListItemIcon-root": {
                  color: "white",
                },

                "& .MuiTypography-root": {
                  color: "white",
                  fontWeight: 600,
                },
              },

              "&:hover": {
                background:
                  "linear-gradient(90deg, rgba(173,70,255,0.12) 0%, rgba(246,51,154,0.12) 50%, rgba(255,105,0,0.12) 100%)",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box
        sx={{
          p: 2.5,
          borderTop: "1px solid #2a2a2a",
          background: "#111111",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "#262626",
              width: 46,
              height: 46,
              fontWeight: "bold",
            }}
          >
            {user?.first_name?.[0]}
          </Avatar>

          <Box
            sx={{
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                color: "white",
                fontSize: "0.95rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.first_name} {user?.last_name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#9e9e9e",
                fontSize: "0.82rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile && !mobileOpen && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 2000,
            color: "white",
            fontSize: 28,
            "&:hover": {
              background: "#2a2a2a",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: 270,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: 270,
              boxSizing: "border-box",
              borderRight: "1px solid #2a2a2a",
              background: "#141414",
              padding: "0",
              left: 0,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 270,
              background: "#141414",
              borderRight: "1px solid #2a2a2a",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
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

function JobCard({ job, onSave, initialLiked = false, similarityScore }) {
  const [saved, setSaved] = useState(initialLiked);
  const [open, setOpen] = useState(false);
  const scorePercent = similarityScore ? Math.round(similarityScore * 100) : null;

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
            {scorePercent !== null && (
              <Chip
                label={`${scorePercent}% match`}
                size="small"
                sx={{
                  width: "fit-content",
                  background: scorePercent >= 85
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(245,158,11,0.15)",
                  color: scorePercent >= 85 ? "#22c55e" : "#f59e0b",
                  border: `1px solid ${scorePercent >= 85 ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
                }}
              />
            )}
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

function InfoCard({ title, value, color }) {
  return (
      <Card
        sx={{
          background: color,
          backdropFilter: "blur(10px)",
          color: "white",
          border: "3px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          flex: 1,
          height: "200px",
        }}
      >
      <CardContent sx={{ padding: "25px" }}>
        <Typography variant="body2" color="gray" sx={{ fontSize: "35px", mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="h5" fontWeight="bold" sx={{ fontSize: "65px", mb: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Dashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [offersViewed, setOffersViewed] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingReco, setLoadingReco] = useState(true);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const limit = 15;

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await apiFetch(`${API.recommendations}?top_k=6`);
        setRecommendations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Reco error:", err.message);
      } finally {
        setLoadingReco(false);
      }
    };
    loadRecommendations();
  }, []);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);

    const [response, likedRes, viewedRes] = await Promise.all([
      apiFetch(`${API.offers}?page=${page}&limit=${limit}`),
      apiFetch(API.likedOffers),
      apiFetch(API.UserViews).catch(() => []),  
    ]);

setOffersViewed(Array.isArray(viewedRes) ? viewedRes : []);

        


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

  const cards = [
          {title: "New Jobs Today", value: jobs.length, color: "rgba(139, 92, 246, 0.15)" },
          {title: "Saved Jobs", value: likedIds.size, color: "rgba(6, 182, 212, 0.15)"  },
          {title: "Offers Viewed", value: offersViewed.length, color: "rgba(34, 197, 94, 0.15)" }];
          

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
        <Box sx={{ pl: 4, pr: 4, pt: 6, maxWidth: 1100 }}>
        <Typography variant="h5" fontWeight="bold" color="white" mb={1}>
          Recommended for you
        </Typography>
        <Typography variant="body2" color="gray" mb={3}>
          {user?.skills?.length > 0
            ? `Based on your skills: ${user.skills.join(", ")}`
            : "Add skills in Settings to get personalized recommendations"}
        </Typography>

        {loadingReco ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : recommendations.length > 0 ? (
          <Grid container spacing={2}>
            {recommendations.map((job) => (
              <Grid item xs={12} md={6} lg={4} key={job.offer_id}>
                <JobCard
                  job={job}
                  onSave={handleSave}
                  initialLiked={likedIds.has(job.offer_id)}
                  similarityScore={job.similarity_score}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="gray">No recommendations yet.</Typography>
        )}
      </Box>
      <Typography
        variant="body1"
        color="gray"
      >
        <h3><span style={{ paddingLeft : "15px", color: "grey" }}>Discover the latest job opportunities</span></h3>
      </Typography>
    </Box>

      <Stack direction="row" spacing={2} mb={4} sx={{ pl: 4, pr: 4, pt: 10, flex: 1 }}>
      {cards.map((c) => (
        <InfoCard key={c.title} title={c.title} value={c.value} color={c.color} />
      ))}
      </Stack>

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



  const handleSave = async (job) => {
    console.log("save job", job.id);
  };





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

      <Box flex={1} sx={{ minWidth: 0, width: "100%" }}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            height: 60,
            background: "#000000",
            borderBottom: "1px solid #3a3939",
            width: {xs: "100%", md: "calc(100% - 270px)"},
            ml: { md: "270px"},
          }}
        >
          <Toolbar disableGutters sx={{ px: 2 }}>
          <Box sx={{ display: "flex", gap: "18px", alignItems: "center", width: "100%",justifyContent:"flex-end"}}>
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
              {page === "search" && <SearchJobs onSave={handleSave} />}
            </Typography>
          </Box>
        )}

        {page === "saved" && <JobsLiked setActive={setPage} />}

        {page === "settings" && (
          <>
            <Settings user={user} refreshAccessToken={refreshAccessToken} />
          </>
        )}
      </Box>
    </Box>
  );
}
