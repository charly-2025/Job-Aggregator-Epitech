import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

import JobCard from "./JobCard";

export default function Dashboard({
  user,
  jobs,
  onSave,
  onView,
}) {
  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Welcome back {user?.first_name} 👋
      </Typography>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} lg={4} key={job.id}>
            <JobCard
              job={job}
              onSave={onSave}
              onView={onView}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}