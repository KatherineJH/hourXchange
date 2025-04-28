// // src/component/board/BoardTable.jsx
// import React from "react";

// function BoardTable({ boards, navigate }) {
//   const goToDetail = (id) => {
//     navigate(`/board/${id}`);
//   };

//   return (
//     <table border="1" width="100%" style={{ marginTop: "1rem" }}>
//       <thead>
//         <tr>
//           <th>ID</th>
//           <th>제목</th>
//           <th>작성자</th>
//           <th>작성일</th>
//         </tr>
//       </thead>
//       <tbody>
//         {boards.length > 0 ? (
//           boards.map((board) => (
//             <tr
//               key={board.id}
//               onClick={() => goToDetail(board.id)}
//               style={{ cursor: "pointer" }}
//             >
//               <td>{board.id}</td>
//               <td>{board.title}</td>
//               <td>{board.authorName}</td>
//               <td>{new Date(board.createdAt).toLocaleString()}</td>
//             </tr>
//           ))
//         ) : (
//           <tr>
//             <td colSpan="4" style={{ textAlign: "center" }}>
//               검색 결과가 없습니다.
//             </td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   );
// }

// export default BoardTable;

// src/component/board/BoardTable.jsx
import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function BoardTable({ boards, navigate }) {
  const goToDetail = (id) => {
    navigate(`/board/${id}`);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "1rem" }}>
      <TableContainer>
        <Table stickyHeader aria-label="board table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>작성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boards.length > 0 ? (
              boards.map((board) => (
                <TableRow
                  hover
                  key={board.id}
                  onClick={() => goToDetail(board.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{board.id}</TableCell>
                  <TableCell>{board.title}</TableCell>
                  <TableCell>{board.authorName}</TableCell>
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
