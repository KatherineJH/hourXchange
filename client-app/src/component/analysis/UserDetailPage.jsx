// src/component/analysis/UserDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../api/userApi";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (error) {
        console.error("유저 상세 정보 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!user) return <Typography>유저를 찾을 수 없습니다.</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        🧑 유저 상세 정보
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box>
        <Typography>ID: {user.id}</Typography>
        <Typography>이름: {user.name}</Typography>
        <Typography>이메일: {user.email}</Typography>
        <Typography>유저명: {user.username}</Typography>
        <Typography>역할: {user.role}</Typography>
        <Typography>
          가입일: {new Date(user.createdAt).toLocaleDateString()}
        </Typography>
        <Typography>상태: {user.status}</Typography>
        <Typography>등급: {user.grade ?? "불명"}</Typography>
      </Box>
    </Paper>
  );
};

export default UserDetailPage;
