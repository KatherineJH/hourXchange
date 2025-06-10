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
import {
    getAllReviews,
    getMyTransactionList,
    getReviewById,
} from "../../api/transactionApi.js";
import { getAllBoards } from "../../api/boardApi.js";

function Mid5HourXChange() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 탭 상태: 0 → 리뷰 보기, 1 → 최근 커뮤니티 게시글
  const [tabValue, setTabValue] = useState(0);

  // 리뷰 상태
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // 게시글 상태 (최신 3개)
  const [recentBoards, setRecentBoards] = useState([]);
  const [boardsLoading, setBoardsLoading] = useState(true);

  // 카드 고정 높이 (필요 시 px/%, rem 등으로 조정)
  const CARD_HEIGHT = "240px";

  useEffect(() => {
    // ─── 리뷰 가져오기 ───
    const fetchReviews = async () => {
      try {
        const response = await getAllReviews(0, 3);
        console.log(response.content)
        setReviews(response.content);
      } catch (error) {
        console.error("리뷰 목록 불러오기 실패:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    // ─── 최신 게시글 3개 가져오기 ───
    const fetchRecentBoards = async () => {
      try {
        const pageResponse = await getAllBoards(0, 3);
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

  // 로딩 중이면 스피너
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

  // 카드 클릭 → 상세 페이지 이동
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
      {/* ★ 헤더 (중앙 정렬) */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          리뷰 & 최근 커뮤니티
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          HourXChange의 새로운 소식을 알려드립니다.
        </Typography>
      </Box>

      {/* ★ 탭 버튼 */}
      <Box
        sx={{
          display: "inline-flex",
          borderBottom: 2,
          borderColor: "divider",
          mb: 4,
          ml: "auto", // 우측 정렬
          px: { xs: 2, md: 8 }, // 화면 끝에 너무 붙지 않도록 패딩
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

      {/* ★ 탭 콘텐츠 + 오른쪽 이미지 */}
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={2}
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 2, md: 4 },
        }}
      >
        {/* ── 왼쪽: 탭별 카드 그리드 ── */}
        <Box sx={{ flexGrow: 1 }}>
          {/* 탭 0: 리뷰 보기 */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {reviews.map((rev) => (
                <Grid item key={rev.reviewId} xs={12} sm={4} md={4}>
                  <Card
                    sx={{
                      width: "100%",
                      height: CARD_HEIGHT,
                      borderRadius: 2,
                      boxShadow: 1,
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "#FFF",
                      p: 2,
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      참여후기
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 1,
                      }}
                    >
                      {rev.content}
                    </Typography>
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
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* 탭 1: 최근 커뮤니티 게시글 */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              {recentBoards.map((board) => (
                <Grid item key={board.id} xs={12} sm={4} md={4}>
                  <Card
                    sx={{
                      width: "100%",
                      height: CARD_HEIGHT,
                      borderRadius: 2,
                      boxShadow: 1,
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "#FFF",
                      p: 2,
                      cursor: "pointer",
                      "&:hover": { boxShadow: 3 },
                    }}
                    onClick={() => goToDetail(board.id)}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      커뮤니티 게시글
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 1,
                      }}
                    >
                      {board.title}
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
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* ── 오른쪽: 이미지 ── */}
        <Box sx={{ flexShrink: 0 }}>
          <img
            src="/deer.png"
            alt="deer"
            style={{ width: 450, display: "block" }}
          />
        </Box>
      </Stack>
    </Box>
  );
}

export default Mid5HourXChange;
