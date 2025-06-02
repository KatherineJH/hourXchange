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
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getWalletHistory } from "../../api/walletApi";
import {
  getMyTransactionList,
  getReviewListByReceiverId,
  getReviewTagsByReceiverId,
} from "../../api/transactionApi";
import { getFavoriteList } from "../../api/productApi";
import { getMyInfo, getUserById } from "../../api/userApi";
import { getDaily, getWeekly, getMyWeekdayVisits } from "../../api/visitLogApi";

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
  const [transactionStatusData, setTransactionStatusData] = useState([]);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [myWeekdayVisits, setMyWeekdayVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          walletRes,
          transactionRes,
          favoriteRes,
          reviewTagRes,
          userRes,
          reviewRes,
          dailyRes,
          weekdayRes,
        ] = await Promise.all([
          getWalletHistory(),
          getMyTransactionList(),
          getFavoriteList(),
          getReviewTagsByReceiverId(user.id),
          getUserById(user.id),
          getReviewListByReceiverId(user.id),
          getDaily(),
          getMyWeekdayVisits(),
        ]);

        setReviewCount(reviewRes.length);
        setReviewAvg(
          reviewRes.length === 0
            ? 0
            : reviewRes.reduce((sum, r) => sum + r.stars, 0) / reviewRes.length
        );

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
          .map((s) => ({ status: s, count: statusMap[s] }))
          .filter((d) => d.count > 0);
        setTransactionStatusData(chartData);

        setTransactionCount(transactionRes.data.length);
        setCredit(walletRes.length > 0 ? walletRes[0].balance : 0);
        setFavoriteCount(favoriteRes.data.length);
        setUserInfo(userRes);
        setDailyVisits(dailyRes);
        setMyWeekdayVisits(weekdayRes);
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

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
        {[
          { title: "💰 현재 크레딧", value: `${credit} 시간` },
          { title: "📦 총 거래 내역", value: `${transactionCount} 건` },
          { title: "💖 찜한 상품 수", value: `${favoriteCount} 개` },
          {
            title: "🌟 나의 리뷰 평점",
            value: `총 ${reviewCount}개 / 평균 ⭐ ${reviewAvg?.toFixed(1) || 0}`,
          },
        ].map((item, i) => (
          <Grid item xs={12} md={3} key={i}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h5">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 요일별 방문 현황 & 거래 상태 분포 */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 4 }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🙋 내 요일별 방문 기록
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={myWeekdayVisits}>
                  <XAxis
                    dataKey="weekday"
                    tickFormatter={(value) => {
                      const map = {
                        Monday: "월",
                        Tuesday: "화",
                        Wednesday: "수",
                        Thursday: "목",
                        Friday: "금",
                        Saturday: "토",
                        Sunday: "일",
                      };
                      return map[value] || value;
                    }}
                  />
                  <YAxis />
                  <Tooltip formatter={(v) => `${v}회`} />
                  <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
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
                  >
                    {transactionStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" />
                  <Tooltip formatter={(value) => `${value}건`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 내 정보 및 주소 */}
      <Card sx={{ my: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Typography variant="h6">내 정보</Typography>
              <Typography>이메일: {userInfo?.email}</Typography>
              <Typography>이름: {userInfo?.name}</Typography>
              <Typography>닉네임: {userInfo?.username}</Typography>
              <Typography>
                생일:{" "}
                {new Date(userInfo?.birthdate).toLocaleDateString("ko-KR")}
              </Typography>
              <Typography>
                가입일:{" "}
                {new Date(userInfo?.createdAt).toLocaleDateString("ko-KR")}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Typography variant="h6">주소 정보</Typography>
              {userInfo?.address ? (
                <>
                  <Typography>
                    도로명 주소: {userInfo.address.roadAddress}
                  </Typography>
                  <Typography>
                    지번 주소: {userInfo.address.jibunAddress}
                  </Typography>
                  <Typography>
                    상세 주소: {userInfo.address.detailAddress}
                  </Typography>
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
              onClick={() => navigate("/myPage/edit")}
            >
              내 정보 수정
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
