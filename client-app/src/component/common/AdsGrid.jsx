import React from "react";
import { Grid, Box } from "@mui/material";
import AdvertisementCard from "../advertisement/AdvertisementCard";

export default function AdsGrid({ ads }) {
  return (
    <Grid container spacing={2} sx={{ padding: 2, justifyContent: "center" }}>
      {ads.map((ad) => (
        <Grid key={ad.id} xs={12} sm={6} md={4} lg={3}>
          <AdvertisementCard ad={ad} />
        </Grid>
      ))}
    </Grid>
  );
}