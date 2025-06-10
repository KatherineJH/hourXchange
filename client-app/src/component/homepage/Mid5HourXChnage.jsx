import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getAllReviews } from "../../api/transactionApi.js";
import { getAllBoards } from "../../api/boardApi.js";

function Mid5HourXChange() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [tabValue, setTabValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [recentBoards, setRecentBoards] = useState([]);
  const [boardsLoading, setBoardsLoading] = useState(true);

  const CARD_HEIGHT = "200px";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewList = await getAllReviews(0, 5);
        const mapped = reviewList.map((r) => ({
          id: r.id,
          content: r.content,
          date: r.createdAt || new Date(),
          stars: r.stars,
        }));
        setReviews(mapped);
      } catch (error) {
        console.error("리뷰 목록 불러오기 실패:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    const fetchRecentBoards = async () => {
      try {
        const pageResponse = await getAllBoards(0, 5);
        const items = Array.isArray(pageResponse)
          ? pageResponse
          : pageResponse.content || [];
        setRecentBoards(items);
      } catch (error) {
        console.error("게시글 목록 조회 실패:", error);
        setRecentBoards([]);
      } finally {
        setBoardsLoading(false);
      }
    };

    fetchReviews();
    fetchRecentBoards();
  }, [id]);

  if (reviewsLoading || boardsLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: 6,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const goToDetail = (boardId) => {
    let basePath = "/board";
    if (location.pathname.startsWith("/myPage")) {
      basePath = "/myPage/board";
    } else if (location.pathname.startsWith("/admin")) {
      basePath = "/admin/board";
    }
    navigate(`${basePath}/${boardId}`);
  };

  return (
    <Box sx={{ backgroundColor: "#F7F7F7", py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          리뷰 & 최근 커뮤니티
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          HourXChange의 새로운 소식을 알려드립니다.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "inline-flex",
          borderBottom: 2,
          borderColor: "divider",
          mb: 4,
          ml: "auto",
          px: { xs: 2, md: 8 },
        }}
      >
        <Button
          onClick={() => setTabValue(0)}
          sx={{
            px: 2,
            py: 1,
            color: tabValue === 0 ? "error.main" : "text.secondary",
            fontWeight: tabValue === 0 ? 700 : 500,
            borderBottom: tabValue === 0 ? 2 : "transparent",
            borderColor: tabValue === 0 ? "error.main" : "transparent",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          리뷰 보기
        </Button>
        <Button
          onClick={() => setTabValue(1)}
          sx={{
            px: 2,
            py: 1,
            ml: 2,
            color: tabValue === 1 ? "error.main" : "text.secondary",
            fontWeight: tabValue === 1 ? 700 : 500,
            borderBottom: tabValue === 1 ? 2 : "transparent",
            borderColor: tabValue === 1 ? "error.main" : "transparent",
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          최근 커뮤니티 게시글
        </Button>
      </Box>

      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={2}
        sx={{
          maxWidth: "5000px",
          px: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ flexGrow: 1, margin: 0 }}>
          {tabValue === 0 && (
            <Grid
              container
              spacing={3}
              justifyContent="flex-start"
              sx={{ ml: 1 }}
            >
              {reviews.map((rev) => (
                <Grid item key={rev.id} xs={2} sm={2} md={2}>
                  <Card
                    sx={{
                      width: "270px",
                      height: CARD_HEIGHT,
                      borderRadius: 2,
                      boxShadow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      bgcolor: "#FFF",
                      p: 2,
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          참여후기
                        </Typography>
                        <img
                          src="/deer.png"
                          alt="deer"
                          style={{ width: 60, opacity: 0.6 }}
                        />
                      </Box>
                      <Typography>
                        {rev.content.length > 10
                          ? rev.content.slice(0, 10) + "..."
                          : rev.content}
                      </Typography>
                      <Typography>{"★".repeat(rev.stars)}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {new Date(rev.date).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid
              container
              spacing={3}
              justifyContent="flex-start"
              sx={{ ml: 1 }}
            >
              {recentBoards.map((board) => (
                <Grid item key={board.id} xs={2} sm={2} md={2}>
                  <Card
                    sx={{
                      width: "270px",
                      height: CARD_HEIGHT,
                      borderRadius: 2,
                      boxShadow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      bgcolor: "#FFF",
                      p: 2,
                      cursor: "pointer",
                      "&:hover": { boxShadow: 3 },
                    }}
                    onClick={() => goToDetail(board.id)}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          커뮤니티
                        </Typography>
                        <img
                          src="/deer.png"
                          alt="deer"
                          style={{ width: 60, opacity: 0.6 }}
                        />
                      </Box>
                      <Typography>
                        {board.title.length > 10
                          ? board.title.slice(0, 10) + "..."
                          : board.title}
                      </Typography>
                      <Typography>
                        {board.description.length > 10
                          ? board.description.slice(0, 20) + "..."
                          : board.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {new Date(board.createdAt).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default Mid5HourXChange;
