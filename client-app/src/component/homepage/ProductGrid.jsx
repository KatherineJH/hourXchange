// src/component/common/ProductGrid.jsx
import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function ProductGrid({
  products,
  favorite,
  onToggleFavorite,
  expandedId,
  onToggleExpand,
}) {
  return (
    <Grid container spacing={2} sx={{ padding: 2, justifyContent: "center" }}>
      {products.map((product) => (
        <Grid key={product.id} xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ maxWidth: 345 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {product.owner?.name?.[0] || "?"}
                </Avatar>
              }
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              title={product.title}
              subheader={new Date(product.startedAt).toLocaleDateString()}
            />
            <CardMedia
              component="img"
              height="194"
              image={product.images?.[0] || "/static/images/cards/paella.jpg"}
              alt={product.title}
            />
            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {product.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton onClick={() => onToggleFavorite(product.id)}>
                {favorite.some((f) => f.product.id === product.id) ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
              <IconButton
                onClick={() => onToggleExpand(product.id)}
                aria-expanded={expandedId === product.id}
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse
              in={expandedId === product.id}
              timeout="auto"
              unmountOnExit
            >
              <CardContent>
                <Typography sx={{ marginBottom: 1 }}>
                  카테고리: {product.category?.categoryName}
                </Typography>
                <Typography sx={{ marginBottom: 1 }}>
                  시작 시간: {new Date(product.startedAt).toLocaleString()}
                </Typography>
                <Typography sx={{ marginBottom: 1 }}>
                  종료 시간: {new Date(product.endAt).toLocaleString()}
                </Typography>
                <Typography sx={{ marginBottom: 1 }}>
                  제공자: {product.owner?.name || "알 수 없음"}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
