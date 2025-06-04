// src/component/analysis/UserDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById, getUserFeatures } from "../../api/userApi";
import { predictDonation } from "../../api/analysisApi";
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
  const [features, setFeatures] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserById(id);
        setUser(userData);

        const featureData = await getUserFeatures(id);
        setFeatures(featureData);

        const predictionData = await predictDonation(featureData);
        setPrediction(predictionData);
      } catch (error) {
        console.error("유저 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!user) return <Typography>유저를 찾을 수 없습니다.</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        🧑 유저 상세 정보
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mb: 3 }}>
        <Typography>ID: {user.id}</Typography>
        <Typography>이름: {user.name}</Typography>
        <Typography>이메일: {user.email}</Typography>
        <Typography>유저명: {user.username}</Typography>
        <Typography>역할: {user.role}</Typography>
        <Typography>
          가입일: {new Date(user.createdAt).toLocaleDateString()}
        </Typography>
        <Typography>상태: {user.status}</Typography>
      </Box>

      {features && (
        <>
          <Typography variant="h6" gutterBottom>
            📊 유저 특성
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 3 }}>
            {Object.entries(features).map(([key, value]) => (
              <Typography key={key}>
                {key}: {value}
              </Typography>
            ))}
          </Box>
        </>
      )}

      {prediction && (
        <>
          <Typography variant="h6" gutterBottom>
            💡 기부 행동 예측
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box>
            {Object.entries(prediction).map(([key, value]) => (
              <Typography key={key}>
                {key}: {value}
              </Typography>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default UserDetailPage;
