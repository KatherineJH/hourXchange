// src/component/board/BoardTable.jsx
import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useLocation } from "react-router-dom";

function BoardTable({ boards, navigate }) {
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
              <TableCell sx={{ bgcolor: "secondary.main" }}> 제목 </TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}> 작성자 </TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}> 작성일 </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boards?.length > 0 ? (
              boards.map((board) => (
                <TableRow
                  hover
                  key={board.id}
                  onClick={() => goToDetail(board.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{board.id}</TableCell>
                  <TableCell>{board.title}</TableCell>
                  {/* <TableCell>{board.author.name}</TableCell> */}
                  <TableCell>
                    {board.authorName || board.author?.name || "알 수 없음"}
                  </TableCell>
                  <TableCell>
                    {new Date(board.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  검색 결과가 없습니다.
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
