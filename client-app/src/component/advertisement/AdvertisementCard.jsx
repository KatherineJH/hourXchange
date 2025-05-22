import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";

export default function ActionAreaCard({ ad }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/donationAd1.png"
          alt={ad.imgUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {" "}
            {ad.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {ad.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
