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
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getWalletHistory } from "../../api/walletApi";
import {
  getMyTransactionList,
  getReviewListByReceiverId,
} from "../../api/transactionApi";
import { getDaily, getWeekly } from "../../api/visitLogApi";
import { getFavoriteList } from "../../api/productApi";
import { getMyInfo, getUserById } from "../../api/userApi";
import { getReviewTagsByReceiverId } from "../../api/transactionApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// 차트 색상 상수 정의
const COLORS = [
  "#ff6384",
  "#36a2eb",
  "#ffcd56",
  "#4bc0c0",
  "#9966ff",
  "#c9cbcf",
];

export default function MyAccount() {
  const [credit, setCredit] = useState(null);
  const [transactionCount, setTransactionCount] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(null);
  const [reviewCount, setReviewCount] = useState(null);
  const [reviewAvg, setReviewAvg] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [weeklyVisits, setWeeklyVisits] = useState([]);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [transactionStatusData, setTransactionStatusData] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const [weeklyRes, dailyRes] = await Promise.all([
          getWeekly(),
          getDaily(),
        ]);
        setWeeklyVisits(weeklyRes.data);
        setDailyVisits(dailyRes.data);
      } catch (err) {
        console.error("방문 데이터 로딩 실패", err);
      }
    };
    fetchVisits();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        console.warn("user.id is not ready yet");
        return;
      }
      try {
        const [walletRes, transactionRes, favoriteRes, reviewTagRes, userRes] =
          await Promise.all([
            getWalletHistory(),
            getMyTransactionList(),
            getFavoriteList(),
            getReviewTagsByReceiverId(user.id),
            getUserById(user.id),
          ]);

        const reviewRes = await getReviewListByReceiverId(user.id);
        setReviewCount(reviewRes.length);
        setReviewAvg(
          reviewRes.length === 0
            ? 0
            : reviewRes.reduce((sum, r) => sum + r.stars, 0) / reviewRes.length
        );

        // 거래 상태별 도넛 차트 데이터 계산
        const allStatuses = [
          "PENDING",
          "REQUESTED",
          "ACCEPTED",
          "COMPLETED",
          "FAILED",
          "REFUNDED",
        ];
        const statusMap = {};
        allStatuses.forEach((s) => (statusMap[s] = 0));
        transactionRes.data.forEach((t) => {
          statusMap[t.status] = (statusMap[t.status] || 0) + 1;
        });
        const chartData = allStatuses
          .map((s) => ({
            status: s,
            count: statusMap[s],
          }))
          .filter((d) => d.count > 0); // 0인 데이터 제외
        setTransactionStatusData(chartData);

        setTransactionCount(transactionRes.data.length);
        setCredit(walletRes.length > 0 ? walletRes[0].balance : 0);
        setFavoriteCount(favoriteRes.data.length);
        setUserInfo(userRes);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getMyInfo();
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

      {/* 사용자 정보 카드 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">💰 현재 크레딧</Typography>
              <Typography variant="h5">{credit} 시간</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">📦 총 거래 내역</Typography>
              <Typography variant="h5">{transactionCount} 건</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">💖 찜한 상품 수</Typography>
              <Typography variant="h5">{favoriteCount} 개</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">🌟 나의 리뷰 평점</Typography>
              <Typography variant="h5">
                총 {reviewCount}개 / 평균 ⭐ {reviewAvg?.toFixed(1) || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 내 정보 및 주소 정보 카드 */}
      <Card sx={{ my: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Typography variant="h6" gutterBottom>
                내 정보
              </Typography>
              <Typography>이메일: {userInfo?.email || user.email}</Typography>
              <Typography>이름: {userInfo?.name || user.name}</Typography>
              <Typography>
                닉네임: {userInfo?.username || user.username}
              </Typography>
              <Typography>
                생일:{" "}
                {userInfo?.birthdate
                  ? new Date(userInfo.birthdate).toLocaleDateString("ko-KR")
                  : "-"}
              </Typography>
              <Typography>
                가입일:{" "}
                {userInfo?.createdAt
                  ? new Date(userInfo.createdAt).toLocaleDateString("ko-KR")
                  : "-"}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Typography variant="h6" gutterBottom>
                주소 정보
              </Typography>
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
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/myPage/edit")}
            >
              내 정보 수정
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 차트 섹션 */}
      {/* 차트 상단 2개: 요일별 방문 현황 & 거래 상태 분포 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: 3,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        {/* 요일별 방문 현황 */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 요일별 방문 현황
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={weeklyVisits}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const dayMap = ["일", "월", "화", "수", "목", "금", "토"];
                      try {
                        const parsed = dayjs(value);
                        const day = parsed.day();
                        return dayMap[day];
                      } catch {
                        return value;
                      }
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${v}회`} />
                  <Bar dataKey="count" fill="#f57c00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* 거래 상태 분포 */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🧾 거래 상태 분포
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={transactionStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={true}
                  >
                    {transactionStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  />
                  <Tooltip formatter={(value) => `${value}건`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 하단 전체 가로 차트 */}
      <Box sx={{ width: "100%" }}>
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📈 일자별 누적 방문수
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={dailyVisits}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value + "T00:00:00").toLocaleDateString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                    })
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => `${value}회`}
                  labelFormatter={(value) =>
                    new Date(value + "T00:00:00").toLocaleDateString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#42a5f5"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#42a5f5", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
