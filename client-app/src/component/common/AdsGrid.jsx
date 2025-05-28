import React from "react";
import { Grid, Box, Container } from "@mui/material";
import AdvertisementCard from "../advertisement/AdvertisementCard";

export default function AdsGrid({ ads }) {
  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 2 }}>
      <Grid container spacing={2}>
        {ads.map((ad) => (
          <Grid item key={ad.id} xs={12} sm={6} md={4} lg={3}>
            <AdvertisementCard ad={ad} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
