import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SettingsIcon from "@mui/icons-material/Settings";

const menu = [
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

export default function Sidebar({ active, setActive, user }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          background: "#111827",
          borderRight: "1px solid #1f2937",
        },
      }}
    >
      <Box p={3}>
        <Typography variant="h5" fontWeight="bold">
          JobGetter
        </Typography>
      </Box>

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.id}
            selected={active === item.id}
            onClick={() => setActive(item.id)}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 3,
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box mt="auto" p={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar>
            {user?.first_name?.[0]}
          </Avatar>

          <Box>
            <Typography fontWeight="bold">
              {user?.first_name}
            </Typography>

            <Typography variant="body2">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}