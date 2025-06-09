import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Pagination,
} from "@mui/material";
import { getAllUsers } from "../../api/userApi";
import { getAllUserGrades } from "../../api/analysisApi";
import UserAnalysisTable from "./UserAnalysisTable";

const gradeMap = {
  0: { label: "이탈 고객", value: "이탈 고객" },
  1: { label: "재활성 가능 고객", value: "재활성 가능" },
  2: { label: "신규 일반", value: "신규 일반" },
  3: { label: "신규 중 VIP 후보", value: "VIP 후보" },
  4: { label: "일반 고객", value: "일반 고객" },
  5: { label: "VIP", value: "VIP" },
};

const UserAnalysisPage = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState("");

  const [page, setPage] = useState(0);
  const size = 10;

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        const [users, grades] = await Promise.all([
          getAllUsers(),
          getAllUserGrades(),
        ]);

        const merged = users.map((user, index) => {
          const gradeNumber = grades[index]?.grade;
          return {
            ...user,
            grade: gradeNumber,
            gradeName: gradeMap[gradeNumber]?.label || "에러",
            gradeValue: gradeMap[gradeNumber]?.value || "Unknown",
          };
        });

        setUserData(merged);
        setFilteredData(merged);
      } catch (error) {
        console.error("유저 정보 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedData();
  }, []);

  useEffect(() => {
    if (!gradeFilter) {
      setFilteredData(userData);
    } else {
      const filtered = userData.filter(
        (user) => user.gradeValue === gradeFilter
      );
      setFilteredData(filtered);
    }
    setPage(0);
  }, [gradeFilter, userData]);

  const totalPages = Math.ceil(filteredData.length / size);
  const paginatedData = filteredData.slice(page * size, (page + 1) * size);

  return (
    <Box sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          🧑‍💼 회원 분석 테이블
        </Typography>

        <FormControl size="small" sx={{ minWidth: 180, mb: 2 }}>
          <InputLabel>등급 필터</InputLabel>
          <Select
            value={gradeFilter}
            label="등급 필터"
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <MenuItem value="">전체</MenuItem>
            {Object.entries(gradeMap).map(([key, { label, value }]) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <UserAnalysisTable users={paginatedData} />

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(e, value) => setPage(value - 1)}
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </Stack>
        </Box>
      </CardContent>
    </Box>
  );
};

export default UserAnalysisPage;
