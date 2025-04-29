// src/component/board/CommentTable.jsx
import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import { createComment, updateComment } from "../../api/commentApi"; // deleteCommentById 불필요

function CommentTable({ comments, setComments, boardId, user }) {
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // 댓글 작성
  const handleCreate = async () => {
    if (!newContent.trim()) return;
    try {
      const newComment = await createComment({
        boardId,
        authorId: user.id,
        content: newContent,
      });
      setComments((prev) => [...prev, newComment]);
      setNewContent("");
    } catch (error) {
      console.error("댓글 작성 실패", error);
    }
  };

  // 댓글 수정 시작
  const startEditing = (id, content) => {
    setEditingId(id);
    setEditingContent(content);
  };

  // 댓글 수정 취소
  const cancelEditing = () => {
    setEditingId(null);
    setEditingContent("");
  };

  // 댓글 수정 저장
  const saveEditing = async (id) => {
    if (!editingContent.trim()) return;
    try {
      const updated = await updateComment(id, { content: editingContent });
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content: updated.content } : c))
      );
      setEditingId(null);
      setEditingContent("");
    } catch (error) {
      console.error("댓글 수정 실패", error);
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        marginTop: "2rem",
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">💬 댓글 목록</Typography>
      </Box>

      {/* 댓글 작성 창 */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="댓글을 입력하세요"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <Button variant="contained" onClick={handleCreate}>
          작성
        </Button>
      </Box>

      <TableContainer>
        <Table stickyHeader aria-label="comment table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "secondary.main" }}>작성자</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>내용</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>작성일</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <TableRow key={comment.id} hover>
                  <TableCell>
                    {comment.author ? comment.author.name : "알 수 없음"}
                  </TableCell>

                  {/* 수정 모드일 때와 아닐 때 */}
                  <TableCell>
                    {editingId === comment.id ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />
                    ) : (
                      comment.content
                    )}
                  </TableCell>

                  <TableCell>
                    {new Date(comment.createdAt).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    {editingId === comment.id ? (
                      <>
                        <IconButton onClick={() => saveEditing(comment.id)}>
                          <Save />
                        </IconButton>
                        <IconButton onClick={cancelEditing}>
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={() =>
                          startEditing(comment.id, comment.content)
                        }
                      >
                        <Edit />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  댓글이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default CommentTable;
