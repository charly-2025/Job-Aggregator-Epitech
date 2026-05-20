import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Chip,
} from "@mui/material";

export default function JobCard({ job, onSave, onView }) {
  return (
    <Card
      sx={{
        background: "#000000",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <div>
            <Typography variant="h6" fontWeight="bold">
              {job.title}
            </Typography>

            <Typography color="text.secondary">{job.company}</Typography>
          </div>

          <Chip
            label={job.location}
            color="primary"
            sx={{ width: "fit-content" }}
          />

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => onView(job)}>
              View
            </Button>

            <Button variant="outlined" onClick={() => onSave(job)}>
              Save
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
