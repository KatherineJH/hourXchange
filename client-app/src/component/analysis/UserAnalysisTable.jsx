// src/component/analysis/UserAnalysisTable.jsx
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const UserAnalysisTable = ({ users }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToUserDetail = (id) => {
    let basePath = "/admin/user";
    navigate(`${basePath}/${id}`);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "1rem" }}>
      <TableContainer>
        <Table stickyHeader aria-label="user analysis table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: "secondary.main" }}>ID</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>이름</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>이메일</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>가입일</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>등급</TableCell>
              <TableCell sx={{ bgcolor: "secondary.main" }}>네임</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  hover
                  key={user.id}
                  onClick={() => goToUserDetail(user.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{user.grade ?? "에러"}</TableCell>
                  <TableCell>{user.gradeValue}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserAnalysisTable;
