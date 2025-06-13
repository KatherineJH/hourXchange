// src/component/board/BoardTable.jsx
import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteBoard } from "../../api/boardApi";
import { useSelector } from "react-redux";

function BoardTable({ boards }) {
  const { user } = useSelector((state) => state.auth);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    if (!user?.email) {
      setShowLoginDialog(true);
    } else {
      goToDetail(id);
    }
  };

  const goToDetail = (id) => {
    let basePath = "/board";
    if (location.pathname.startsWith("/myPage")) {
      basePath = "/myPage/board";
    } else if (location.pathname.startsWith("/admin")) {
      basePath = "/admin/board";
    }
    navigate(`${basePath}/${id}`);
  };

  // 모달 닫기
  const handleCloseDialog = () => {
    setShowLoginDialog(false);
  };
  // 로그인 페이지로 이동
  const handleLoginDialog = () => {
    setShowLoginDialog(false);
    navigate("/login");
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "1rem" }}>
        <TableContainer>
          <Table stickyHeader aria-label="board table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: "secondary.main" }}>ID</TableCell>
                <TableCell sx={{ bgcolor: "secondary.main" }}>이미지</TableCell>
                <TableCell sx={{ bgcolor: "secondary.main" }}>제목</TableCell>
                <TableCell sx={{ bgcolor: "secondary.main" }}>
                  카테고리
                </TableCell>
                <TableCell sx={{ bgcolor: "secondary.main" }}>작성자</TableCell>
                <TableCell sx={{ bgcolor: "secondary.main" }}>작성일</TableCell>
                <TableCell sx={{ bgcolor: "secondary.main" }}>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boards?.length > 0 ? (
                boards.map((board) => {
                  const isMine = board.author?.id === user?.id;
                  return (
                    <TableRow
                      hover
                      key={board.id}
                      onClick={() => handleRowClick(board.id)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{board.id}</TableCell>
                      <TableCell>
                        <CardMedia
                          component="img"
                          src={board.images?.[0] || "/default.png"}
                          onError={(e) => {
                            e.currentTarget.src = "/default.png";
                          }}
                          sx={{ width: 100, height: 100 }}
                        />
                      </TableCell>
                      <TableCell>{board.title}</TableCell>
                      <TableCell>
                        {board.category?.categoryName || "-"}
                      </TableCell>
                      <TableCell>
                        {board.authorName || board.author?.name}
                      </TableCell>
                      <TableCell>{board.createdAt.slice(0, 10)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ borderRadius: 1, px: 2, py: 0.5 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isMine) {
                              alert(
                                "본인이 작성한 게시글만 삭제할 수 있습니다."
                              );
                              return;
                            }
                            if (window.confirm("정말 삭제하시겠습니까?")) {
                              deleteBoard(board.id)
                                .then(() => {
                                  alert("삭제 완료");
                                  window.location.reload();
                                })
                                .catch((err) => {
                                  alert("삭제 실패: " + err.message);
                                });
                            }
                          }}
                        >
                          삭제
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    게시글이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 로그인 유도 모달 */}
      <Dialog open={showLoginDialog} onClose={handleCloseDialog}>
        <DialogTitle>로그인이 필요합니다</DialogTitle>
        <DialogContent>게시글을 보려면 로그인이 필요해요.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button variant="contained" onClick={handleLoginDialog}>
            로그인 하러가기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BoardTable;
