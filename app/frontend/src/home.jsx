import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Settings from "./pages/settings/settings";
import JobsLiked from "./pages/Jobsliked/SavedJobs";
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
  useMediaQuery,
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
import NewJobCard from "./components/NewJobcard";
import Sidebar from "./components/sidebar";

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
        <Typography
          variant="body2"
          color="gray"
          sx={{ fontSize: "35px", mb: 1 }}
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ fontSize: "65px", mb: 1 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function Dashboard({ user, onSave }) {
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
    {
      title: "New Jobs Today",
      value: jobs.length,
      color: "rgba(139, 92, 246, 0.15)",
    },
    {
      title: "Saved Jobs",
      value: likedIds.size,
      color: "rgba(6, 182, 212, 0.15)",
    },
    {
      title: "Offers Viewed",
      value: offersViewed.length,
      color: "rgba(34, 197, 94, 0.15)",
    },
  ];

  return (
    <Box sx={{ pl: 4, pr: 4, pt: 10, flex: 1 }}>
      <Box mb={6}>
        <Typography variant="h4" fontWeight="bold" color="white">
          Welcome back{" "}
          <span style={{ color: "purple" }}>{user?.first_name}</span> 👋
        </Typography>

        <Typography variant="body1" color="gray">
          <h3>
            <span style={{ paddingLeft: "15px", color: "grey" }}>
              Discover the latest job opportunities
            </span>
          </h3>
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        mb={4}
        sx={{ pl: 4, pr: 4, pt: 10, flex: 1 }}
      >
        {cards.map((c) => (
          <InfoCard
            key={c.title}
            title={c.title}
            value={c.value}
            color={c.color}
          />
        ))}
      </Stack>
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
          <Stack spacing={3}>
            {recommendations.map((job) => (
              <NewJobCard
                key={job.offer_id}
                job={job}
                onSave={onSave}
                initialLiked={likedIds.has(job.offer_id)}
                similarityScore={job.similarity_score}
              />
            ))}
          </Stack>
        ) : (
          <Typography color="gray" mb={4}>No recommendations yet.</Typography>
        )}
      </Box>

      <Box sx={{ pl: 4, pr: 4, pt: 4, maxWidth: 1100 }}>
        <Typography variant="h5" fontWeight="bold" color="white" mb={3}>
          All offers
        </Typography>
        <Stack spacing={3}>
          {jobs.map((job) => (
            <NewJobCard
              key={job.offer_id}
              job={job}
              onSave={onSave}
              initialLiked={likedIds.has(job.offer_id)}
            />
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
            width: { xs: "100%", md: "calc(100% - 270px)" },
            ml: { md: "270px" },
          }}
        >
          <Toolbar disableGutters sx={{ px: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: "18px",
                alignItems: "center",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
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
