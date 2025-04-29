// src/page/board/BoardDetail.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getBoardDetail, updateBoardLike } from "../../api/boardApi";
import { getCommentsByBoardId } from "../../api/commentApi";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentTable from "../../component/board/CommentTable";

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await getBoardDetail(id);
        setBoard(data);
      } catch (error) {
        console.error("게시판 상세 조회 실패", error);
      }
    };

    const fetchComments = async () => {
      try {
        const data = await getCommentsByBoardId(id);
        setComments(data);
      } catch (error) {
        console.error("댓글 조회 실패", error);
      }
    };

    fetchBoard();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    try {
      const updatedBoard = await updateBoardLike(id); // 좋아요 토글
      setBoard(updatedBoard); // 서버 응답 반영
    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

  if (!board) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">로딩 중...</Typography>
      </Box>
    );
  }
  const isAuthor = user && user.id === board.author.id;

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              📄 게시글 상세 페이지
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {isAuthor ? (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/board/update/${board.id}`)}
                >
                  수정
                </Button>
              ) : (
                <Button onClick={handleLike} sx={{ minWidth: 0, p: 1 }}>
                  좋아요
                  {board.likedByMe ? (
                    <ThumbUpIcon color="primary" />
                  ) : (
                    <ThumbUpOffAltIcon color="action" />
                  )}
                </Button>
              )}
              <Button variant="contained" color="primary" href="/board/list">
                목록으로
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mb: 1 }}>
            {board.title}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            작성자: {board.author.name} | 작성일:{" "}
            {new Date(board.createdAt).toLocaleString()}
          </Typography>

          {/* 등록된 이미지 보여주기 */}
          {board.images && board.images.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
              }}
            >
              {board.images.map((url, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: "150px",
                    height: "150px",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                  }}
                >
                  <img
                    src={url}
                    alt={`게시글 이미지 ${idx}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {board.description}
          </Typography>
        </CardContent>
      </Card>

      {/* 댓글 테이블 */}
      <CommentTable
        comments={comments}
        setComments={setComments}
        boardId={id}
        user={user}
      />
    </Box>
  );
}

export default BoardDetail;
