import { createFileRoute } from "@tanstack/react-router";
import Link from "@mui/material/Link";
import { Typography } from "@mui/material";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Link href="/sort">
      <Typography variant="h5">Sorting Algorithms</Typography>
    </Link>
  );
}
