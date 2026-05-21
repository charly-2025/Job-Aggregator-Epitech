import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

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
  Stack,
  IconButton,
  useMediaQuery
} from "@mui/material";

import "../home.css";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Sidebar({ active, setActive, user }) {
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
