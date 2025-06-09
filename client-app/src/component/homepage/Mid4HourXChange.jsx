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
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  // 2) “팝니다(SELLER)”, “삽니다(BUYER)”, 또는 “전체(ALL)” 상태
  const [providerType, setProviderType] = useState("ALL");

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

        // providerType에 맞춰 필터 (ALL이면 필터하지 않음)
        if (providerType !== "ALL") {
          full = full.filter((p) => p.providerType === providerType);
        }

        // category가 있으면 category 필터
        if (category) {
          full = full.filter(
            (p) => p.category && p.category.categoryName === category
          );
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

    if (rangeStart && rangeEnd) {
      return (
        end.isSameOrAfter(rangeStart, "day") &&
        start.isSameOrBefore(rangeEnd, "day")
      );
    } else if (rangeStart && !rangeEnd) {
      return start.isSame(rangeStart, "day") || end.isSame(rangeStart, "day");
    } else {
      return true; // 아무 날짜도 안 골랐을 때 전체
    }
  });

  // “전체 글 보기” 버튼 클릭 시 이동할 경로를 providerType에 따라 결정
  const handleViewAllClick = () => {
    let path = "/product/all"; // 기본값: ALL
    if (providerType === "SELLER") {
      path = "/product/sell";
    } else if (providerType === "BUYER") {
      path = "/product/buy";
    }
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        bgcolor: "#91f1e0",
        p: { xs: 1, md: 2 },
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
        HourXChange 날짜 조회
      </Typography>

      {/* 상단: 전체/팝니다/삽니다 토글 버튼 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 4,
        }}
      >
        {["ALL", "SELLER", "BUYER"].map((type) => (
          <Button
            key={type}
            variant={providerType === type ? "contained" : "outlined"}
            color="primary"
            onClick={() => setProviderType(type)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 8,
              fontSize: 16,
              color: providerType === type ? "white" : "black",
              borderColor: providerType === type ? "primary.main" : "black",
            }}
          >
            {type === "ALL"
              ? "전체 글"
              : type === "SELLER"
                ? "팝니다"
                : "삽니다"}
          </Button>
        ))}
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
            maxHeight: 450,
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
              onChange={(newDate) => {
                setSelectedDate(newDate);
                if (!rangeStart || (rangeStart && rangeEnd)) {
                  setRangeStart(newDate);
                  setRangeEnd(null);
                } else if (newDate.isBefore(rangeStart)) {
                  setRangeStart(newDate);
                } else {
                  setRangeEnd(newDate);
                }
              }}
              sx={{
                "& .Mui-selected": {
                  bgcolor: "#FFCDD2 !important",
                  color: "#fff",
                },
                "& .MuiCalendarPicker-root": {
                  typography: "body2",
                },
              }}
              slotProps={{
                day: (ownerState) => {
                  const day = dayjs(ownerState.day);
                  const isInRange =
                    rangeStart &&
                    rangeEnd &&
                    day.isSameOrAfter(rangeStart, "day") &&
                    day.isSameOrBefore(rangeEnd, "day");

                  return {
                    sx: {
                      bgcolor: isInRange ? "#ffe0b2" : undefined,
                      borderRadius: isInRange ? "50%" : undefined,
                    },
                  };
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
            {rangeStart && rangeEnd
              ? `${rangeStart.format("YYYY년 MM월 DD일")} ~ ${rangeEnd.format("YYYY년 MM월 DD일")} 게시글`
              : rangeStart
                ? `${rangeStart.format("YYYY년 MM월 DD일")} 게시글`
                : "날짜를 선택해주세요"}
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
                      작성자
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "#FFFFFF",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      카테고리
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* filteredList에서 상위 7개 항목만 보여주도록 slice(0, 7) 적용 */}
                  {filteredList.slice(0, 7).map((item) => (
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
                      <TableCell align="center">
                        {item.startedAt?.substring(0, 10)}
                      </TableCell>
                      <TableCell>{item.owner.name || "-"}</TableCell>
                      <TableCell>{item.category.categoryName}</TableCell>
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

          {/* 전체 글 보기 버튼: providerType에 따라 경로 분기 */}
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
            onClick={handleViewAllClick}
          >
            전체 글 보기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Mid4HourXChange;
