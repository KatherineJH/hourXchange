import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getWalletHistory } from "../../api/walletApi";
import { getMyTransactionList } from "../../api/transactionApi";
import { getFavoriteList } from "../../api/productApi";
import { getMyInfo, getUserById } from "../../api/userApi";
import { getReviewTagsByReceiverId } from "../../api/transactionApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MyAccount() {
  const [credit, setCredit] = useState(null);
  const [transactionCount, setTransactionCount] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(null);
  const [reviewCount, setReviewCount] = useState(null);
  const [reviewAvg, setReviewAvg] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, transactionRes, favoriteRes, reviewTagRes, userRes] =
          await Promise.all([
            getWalletHistory(),
            getMyTransactionList(),
            getFavoriteList(),
            getReviewTagsByReceiverId(user.id),
            getUserById(user.id),
          ]);

        // console.log("Wallet:", walletRes);
        // console.log("Transactions:", transactionRes);
        // console.log("Favorites:", favoriteRes);
        // console.log("Review Tags:", reviewTagRes);
        // console.log("User Info:", userRes);

        setCredit(walletRes.length > 0 ? walletRes[0].balance : 0);
        setTransactionCount(transactionRes.data.length);
        setFavoriteCount(favoriteRes.data.length);
        setReviewCount(reviewTagRes.count);
        setReviewAvg(reviewTagRes.average);
        setUserInfo(userRes);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getMyInfo();
        console.log("User Info:", info);
        setUserInfo(info);
      } catch (err) {
        console.error("유저 정보 조회 실패:", err);
      }
    };
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        나의 대시보드 📊
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">💰 현재 크레딧</Typography>
              <Typography variant="h4" color="primary">
                {credit} 시간
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">📦 총 거래 내역</Typography>
              <Typography variant="h4" color="secondary">
                {transactionCount} 건
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">💖 찜한 상품 수</Typography>
              <Typography variant="h4" color="error">
                {favoriteCount} 개
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">🌟 리뷰 요약</Typography>
              <Typography variant="body1">
                {reviewCount}개 / 평균 ⭐ {reviewAvg?.toFixed(1) || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ my: 4 }}>
        <CardContent>
          <Typography variant="subtitle1">
            이메일: {userInfo?.email || user.email}
          </Typography>
          <Typography variant="subtitle1">
            이름: {userInfo?.name || user.name}
          </Typography>
          <Typography variant="subtitle1">
            닉네임: {userInfo?.username || user.username}
          </Typography>
          <Typography variant="subtitle1">
            생일:{" "}
            {userInfo?.birthdate
              ? new Date(userInfo.birthdate).toLocaleDateString("ko-KR")
              : "-"}
          </Typography>
          <Typography variant="subtitle1">
            가입일:{" "}
            {userInfo?.createdAt
              ? new Date(userInfo.createdAt).toLocaleDateString("ko-KR")
              : "-"}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">주소 정보</Typography>

            {userInfo?.address ? (
              <>
                <Typography>
                  도로명 주소: {userInfo.address.roadAddress}
                </Typography>
                <Typography>
                  지번 주소: {userInfo.address.jibunAddress}
                </Typography>
                {userInfo.address.detailAddress && (
                  <Typography>
                    상세 주소: {userInfo.address.detailAddress}
                  </Typography>
                )}
                <Typography>우편번호: {userInfo.address.zonecode}</Typography>
              </>
            ) : (
              <Typography color="text.secondary">
                주소 정보가 없습니다.
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/myPage/edit")}
          >
            내 정보 수정
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
