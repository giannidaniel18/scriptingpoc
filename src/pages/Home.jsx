import { Stack, Typography } from "@mui/material";
import React from "react";

export default function Home() {
  return (
    <Stack alignItems={"center"} justifyContent={"center"} height="80vh">
      <Typography variant="h1" color="primary">
        Scripting CAC
        <Typography variant="h2" color="white">
          Demo
        </Typography>
      </Typography>
    </Stack>
  );
}
