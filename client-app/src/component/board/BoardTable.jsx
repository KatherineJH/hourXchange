// src/component/board/BoardTable.jsx
import React from "react";
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
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { deleteBoard } from "../../api/boardApi";
import { useSelector } from "react-redux";

function BoardTable({ boards, navigate }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation(); // 현재 경로 확인
  const goToDetail = (id) => {
    let basePath = "/board"; // 기본 경로는 board
    if (location.pathname.startsWith("/myPage")) {
      basePath = "/myPage/board"; // /myPage에서 board로 가는 경우
    } else if (location.pathname.startsWith("/admin")) {
      basePath = "/admin/board"; // /admin에서 board로 가는 경우
    }
    navigate(`${basePath}/${id}`);
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "1rem" }}>
      <TableContainer>
        <Table stickyHeader aria-label="board table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "secondary.main" }}> ID </TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}> 이미지 </TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}> 제목 </TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>
                {" "}
                카테고리{" "}
              </TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}> 작성자 </TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}> 작성일 </TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}> 삭제 </TableCell>
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
                    onClick={() => goToDetail(board.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{board.id}</TableCell>
                    <TableCell>
                      <CardMedia
                        component="img"
                        image={board.images?.[0] || "/default.png"}
                        sx={{ width: 100, height: 100 }}
                      />
                    </TableCell>
                    <TableCell>{board.title}</TableCell>
                    <TableCell>{board.category?.categoryName || "-"}</TableCell>
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

                          const isMine =
                            board.authorId === user?.id ||
                            board.author?.id === user?.id;

                          if (!isMine) {
                            alert("본인이 작성한 게시글만 삭제할 수 있습니다.");
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
                <TableCell colSpan={6} align="center">
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default BoardTable;
