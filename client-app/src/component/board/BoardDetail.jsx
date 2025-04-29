// src/page/board/BoardDetail.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBoardDetail } from "../../api/boardApi";
import { getCommentsByBoardId } from "../../api/commentApi";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import CommentTable from "../../component/board/CommentTable";

function BoardDetail() {
  const { id } = useParams();
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

  if (!board) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📄 게시글 상세 페이지
          </Typography>

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

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" href="/board/list">
              목록으로
            </Button>
          </Box>
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
