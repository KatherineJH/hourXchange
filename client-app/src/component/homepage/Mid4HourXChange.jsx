import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getList, getListWithKeyword } from "../../api/productApi.js";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("ko");

function Mid4HourXChange({ category = "", keyword = "" }) {
  // 1) 날짜 선택 상태
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // 2) “팝니다(SELLER)” 또는 “삽니다(BUYER)” 상태
  const [providerType, setProviderType] = useState("SELLER");

  // 3) API 로 받아온 전체 게시글
  const [allPosts, setAllPosts] = useState([]);

  // 4) 로딩 상태
  const [loading, setLoading] = useState(false);

  // 5) 네비게이트 훅
  const navigate = useNavigate();

  // 6) 컴포넌트 마운트 또는 providerType/keyword/category 변경 시 전체 게시글 불러오기
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // keyword가 비어 있으면 전체, 그렇지 않으면 키워드 검색
        const response =
          keyword.trim() === ""
            ? await getList(0, 1000)
            : await getListWithKeyword(keyword, 0, 1000);

        let full = response.data.content;

        // providerType에 맞춰 필터
        if (providerType !== "") {
          full = full.filter((p) => p.providerType === providerType);
        }

        // category가 있으면 category 필터
        if (category) {
          full = full.filter((p) => p.category?.categoryName === category);
        }

        setAllPosts(full);
      } catch (err) {
        console.error("Mid4: 전체 게시글 불러오기 실패", err);
        setAllPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [providerType, category, keyword]);

  // 7) 달력에서 선택한 날짜 범위에 속하는 게시글만 걸러내기
  const filteredList = allPosts.filter((item) => {
    const start = dayjs(item.startedAt);
    const end = dayjs(item.endAt);
    return (
      selectedDate.isSameOrAfter(start, "day") &&
      selectedDate.isSameOrBefore(end, "day")
    );
  });

  return (
    <Box
      sx={{
        width: "100%",
        // maxWidth: 1200,
        mx: "auto",
        bgcolor: "#91f1e0",
        p: { xs: 1, md: 2 },
        // borderRadius: 4,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontFamily: "'Gmarket Sans Round', sans-serif",
          fontWeight: 700,
          letterSpacing: 1,
          mb: 3,
        }}
      >
        게시글 날짜 조회
      </Typography>

      {/* 상단: 팝니다/삽니다 토글 버튼 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Button
          variant={providerType === " " ? "contained" : "outlined"}
          color="primary"
          onClick={() => setProviderType("")}
          sx={{ px: 4, py: 1.5, borderRadius: 8, fontSize: 16 }}
        >
          전체 글
        </Button>
        <Button
          variant={providerType === "SELLER" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setProviderType("SELLER")}
          sx={{ px: 4, py: 1.5, borderRadius: 8, fontSize: 16 }}
        >
          팝니다
        </Button>
        <Button
          variant={providerType === "BUYER" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setProviderType("BUYER")}
          sx={{ px: 4, py: 1.5, borderRadius: 8, fontSize: 16 }}
        >
          삽니다
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          width: "100%",
        }}
      >
        {/* 왼쪽: 달력 */}
        <Box
          sx={{
            flex: 1,
            border: "1px solid #E0E0E0",
            borderRadius: 3,
            p: 3,
            bgcolor: "#FFFFFF",
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            {selectedDate.format("YYYY년 MM월")}
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              sx={{
                "& .Mui-selected": {
                  bgcolor: "#FFCDD2 !important",
                  color: "#fff",
                },
                "& .MuiCalendarPicker-root": {
                  typography: "body2",
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* 오른쪽: 예약 현황 테이블 */}
        <Box
          sx={{
            flex: 2,
            border: "1px solid #E0E0E0",
            borderRadius: 3,
            p: 3,
            bgcolor: "#F5F5F5",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            {selectedDate.format("YYYY년 MM월 DD일")} 게시글
          </Typography>

          {loading ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : filteredList.length > 0 ? (
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table size="medium" aria-label="reservation-table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        bgcolor: "#FFFFFF",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      제목
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "#FFFFFF",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      내용
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        bgcolor: "#FFFFFF",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      시간
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        bgcolor: "#FFFFFF",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      시작일
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        bgcolor: "#FFFFFF",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      종료일
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "#FFFFFF",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      작성자
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredList.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "#FFFFFF" },
                        "&:nth-of-type(even)": { bgcolor: "#FAFAFA" },
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#FFEDE6" },
                      }}
                      onClick={() => navigate(`/product/read/${item.id}`)}
                    >
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.description || item.content}</TableCell>
                      <TableCell align="center">{item.hours ?? "-"}</TableCell>
                      <TableCell align="center">{item.startedAt}</TableCell>
                      <TableCell align="center">{item.endAt}</TableCell>
                      <TableCell>{item.owner?.name || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              선택한 날짜에 해당하는 게시글이 없습니다.
            </Typography>
          )}

          {/* 전체 글 보기 버튼 */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
              fontSize: 18,
              fontWeight: "bold",
            }}
            onClick={() =>
              navigate("/full-list-by-date", {
                state: {
                  date: selectedDate.format("YYYY-MM-DD"),
                  items: filteredList,
                },
              })
            }
          >
            전체 글 보기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
export default Mid4HourXChange;
