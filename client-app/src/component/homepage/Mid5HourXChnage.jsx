// src/component/yourPath/Mid5HourXChange.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllReviews } from "../../api/transactionApi.js";
import { getAllBoards } from "../../api/boardApi.js";

function Mid5HourXChange() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux auth slice에서 user 정보 추출
  const { user } = useSelector((state) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [recentBoards, setRecentBoards] = useState([]);
  const [boardsLoading, setBoardsLoading] = useState(true);

  // 로그인 모달 오픈 상태
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const CARD_HEIGHT = "200px";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getAllReviews(0, 5);
        setReviews(response.content);
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

  // ③ 게시글 클릭 시 로그인 체크
  const goToDetail = (boardId) => {
    if (!user?.email) {
      setOpenLoginModal(true);
      return;
    }
    let basePath = "/board";
    if (location.pathname.startsWith("/myPage")) {
      basePath = "/myPage/board";
    } else if (location.pathname.startsWith("/admin")) {
      basePath = "/admin/board";
    }
    navigate(`${basePath}/${boardId}`);
  };

  // 모달 닫기
  const handleClose = () => {
    setOpenLoginModal(false);
  };
  // 로그인 페이지로 이동
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Box sx={{ backgroundColor: "#F7F7F7", py: 6 }}>
      {/* 헤더 */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          리뷰 & 최근 커뮤니티
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          HourXChange의 새로운 소식을 알려드립니다.
        </Typography>
      </Box>

      {/* 탭 버튼 */}
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

      {/* 콘텐츠 */}
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={2}
        sx={{ maxWidth: "5000px", px: { xs: 2, md: 4 } }}
      >
        <Box sx={{ flexGrow: 1, margin: 0 }}>
          {/* 리뷰 탭 */}
          {tabValue === 0 && (
            <Grid container spacing={3} sx={{ ml: 1 }}>
              {reviews.map((rev) => (
                <Grid item key={rev.reviewId} xs={12} sm={6} md={4} lg={2}>
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
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                      >
                        참여후기
                      </Typography>
                      <Typography>
                        {rev.content.length > 20
                          ? rev.content.slice(0, 20) + "..."
                          : rev.content}
                      </Typography>
                      <Typography>{"★".repeat(rev.stars)}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {new Date(rev.createdAt).toLocaleDateString("ko-KR")}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* 게시글 탭 */}
          {tabValue === 1 && (
            <Grid container spacing={3} sx={{ ml: 1 }}>
              {recentBoards.map((board) => (
                <Grid item key={board.id} xs={12} sm={6} md={4} lg={2}>
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
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                      >
                        커뮤니티
                      </Typography>
                      <Typography>
                        {board.title.length > 10
                          ? board.title.slice(0, 10) + "..."
                          : board.title}
                      </Typography>
                      <Typography>
                        {board.description.length > 20
                          ? board.description.slice(0, 20) + "..."
                          : board.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {new Date(board.createdAt).toLocaleDateString("ko-KR")}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>

      {/* ④ 로그인 유도 모달 */}
      <Dialog open={openLoginModal} onClose={handleClose}>
        <DialogTitle>로그인이 필요합니다</DialogTitle>
        <DialogContent>
          커뮤니티 게시글을 보려면 로그인이 필요해요.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button variant="contained" onClick={handleLogin}>
            로그인 하러가기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Mid5HourXChange;
