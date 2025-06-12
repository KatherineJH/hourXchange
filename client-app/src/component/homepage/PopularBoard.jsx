import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getAllBoards } from "../../api/boardApi";

export default function PopularBoard() {
  const [topBoards, setTopBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await getAllBoards(0, 50);
        const allBoards = response.content || [];

        const sorted = [...allBoards]
          .sort((a, b) => b.likeCount - a.likeCount)
          .slice(0, 5); // 상위 5개만
        // console.log("가장 많이 조회된 게시글 TOP 5:", sorted);
        setTopBoards(sorted);
      } catch (err) {
        console.error("게시글 가져오기 실패:", err);
      }
    };

    fetchBoards();
  }, []);

  return (
    <Box sx={{ padding: "1rem" }}>
      <Typography variant="h6" gutterBottom>
        🔥 가장 많이 조회된 게시글 TOP 5
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          mt: 2,
          width: "100%",
          justifyItems: "start",
          justifyContent: "flex-start",
        }}
      >
        {topBoards.map((board) => (
          <Card
            key={board.id}
            sx={{
              maxWidth: 345,
              width: "100%",
              height: 350,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={
                board.images && board.images.length > 0
                  ? board.images[0]
                  : "/default.png"
              }
              alt={board.title}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom noWrap>
                {board.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {board.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton disabled>
                <FavoriteIcon color={board.likedByMe ? "error" : "disabled"} />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {board.likeCount}개
              </Typography>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
