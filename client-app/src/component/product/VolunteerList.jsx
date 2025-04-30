import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getList } from "../../api/volunteerApi.js";

const areaOptions = [
  { name: "서울", code: "0101" },
  { name: "부산", code: "0102" },
  { name: "대구", code: "0103" },
  { name: "인천", code: "0104" },
  { name: "광주", code: "0105" },
  { name: "대전", code: "0106" },
  { name: "울산", code: "0107" },
  { name: "세종", code: "0117" },
  { name: "경기", code: "0108" },
  { name: "강원", code: "0109" },
  { name: "충북", code: "0110" },
  { name: "충남", code: "0111" },
  { name: "전북", code: "0112" },
  { name: "전남", code: "0113" },
  { name: "경북", code: "0114" },
  { name: "경남", code: "0115" },
  { name: "제주", code: "0116" },
];

// 오늘 날짜
const today = new Date();
// 한 달 전 날짜
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
// 날짜를 "YYYY-MM-DD" 문자열로 포맷팅하는 헬퍼
const formatDate = (date) => date.toISOString().split("T")[0];

const initState = {
  serviceKey: import.meta.env.VITE_OPENAPI_KEY,
  numOfRows: 10, // 페이지 크기
  pageNo: 1, // 현재 페이지 (1부터)
  strDate: formatDate(oneMonthAgo), // 조회 시작일
  endDate: formatDate(today), // 조회 끝일
  areaCode: "0101", // 지역 코드
  TermType: 2, // 1: 정기, 2: 비정기
};

export default function VolunteerList() {
  const [options, setOptions] = useState(initState);
  const [serverData, setServerData] = useState([]);

  // 값이 바뀔 때, 숫자형 필드는 Number로 변환
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (["numOfRows", "TermType"].includes(name)) {
      value = Number(value);
    }
    setOptions((prev) => ({
      ...prev,
      [name]: value,
      // 필터가 바뀌면 페이지는 1로 리셋
      ...(name !== "pageNo" && { pageNo: 1 }),
    }));
  };

  // 실제 API 호출
  const fetchData = async (opts) => {
    try {
      const response = await getList(opts);
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data, "application/xml");
      const items = Array.from(xml.getElementsByTagName("item")).map(
        (node) => ({
          seq: node.getElementsByTagName("seq")[0]?.textContent,
          title: node.getElementsByTagName("title")[0]?.textContent,
          centName: node.getElementsByTagName("centName")[0]?.textContent,
          areaName: node.getElementsByTagName("areaName")[0]?.textContent,
          regDate: node.getElementsByTagName("regDate")[0]?.textContent,
          termType: node.getElementsByTagName("termTypeName")[0]?.textContent,
          statusName: node.getElementsByTagName("statusName")[0]?.textContent,
        }),
      );
      setServerData(items);
    } catch (err) {
      console.error(err);
    }
  };

  // 조회 버튼
  const handleFetch = () => {
    fetchData(options);
  };

  // 이전/다음 버튼
  const handlePrev = () => {
    if (options.pageNo > 1) {
      const next = options.pageNo - 1;
      const nextOpts = { ...options, pageNo: next };
      setOptions(nextOpts);
      fetchData(nextOpts);
    }
  };
  const handleNext = () => {
    if (serverData.length >= options.numOfRows) {
      const next = options.pageNo + 1;
      const nextOpts = { ...options, pageNo: next };
      setOptions(nextOpts);
      fetchData(nextOpts);
    }
  };

  // 1) 새 창으로 외부 링크 열기
  const openInNewTab = (seq) => {
    window.open(
      "https://www.vms.or.kr/partspace/recruitView.do?seq=" + seq,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Box p={2}>
      {/* 지역 선택 */}
      <FormControl
        component="fieldset"
        sx={{
          mb: 2,
          border: "1px solid",
          borderColor: "grey.400",
          borderRadius: 1,
          p: 2,
        }}
      >
        <FormLabel component="legend">지역</FormLabel>
        <RadioGroup
          row
          name="areaCode"
          value={options.areaCode}
          onChange={handleChange}
        >
          {areaOptions.map(({ name, code }) => (
            <FormControlLabel
              key={code}
              value={code}
              control={<Radio />}
              label={name}
            />
          ))}
        </RadioGroup>
      </FormControl>

      {/* 정기/비정기 모집 */}
      <FormControl
        component="fieldset"
        sx={{
          mb: 2,
          border: "1px solid",
          borderColor: "grey.400",
          borderRadius: 1,
          p: 2,
        }}
      >
        <FormLabel component="legend">모집 유형</FormLabel>
        <RadioGroup
          row
          name="TermType"
          value={options.TermType}
          onChange={handleChange}
        >
          <FormControlLabel value={2} control={<Radio />} label="비정기" />
          <FormControlLabel value={1} control={<Radio />} label="정기" />
        </RadioGroup>
      </FormControl>

      {/* 날짜 입력 */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="조회 시작일"
          name="strDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={options.strDate}
          onChange={handleChange}
        />
        <TextField
          label="조회 종료일"
          name="endDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={options.endDate}
          onChange={handleChange}
        />
      </Stack>

      {/* 조회 / 페이지 이동 버튼 */}
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={handleFetch}>
          조회
        </Button>
        <Button
          variant="outlined"
          disabled={options.pageNo === 1}
          onClick={handlePrev}
        >
          이전
        </Button>
        <Button
          variant="outlined"
          disabled={serverData.length < options.numOfRows}
          onClick={handleNext}
        >
          다음
        </Button>
      </Stack>

      {/* 결과 테이블 */}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>시퀀스</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>업체명</TableCell>
              <TableCell>지역</TableCell>
              <TableCell>날짜</TableCell>
              <TableCell>상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serverData.map((row) => (
              <TableRow
                key={row.seq}
                hover
                onClick={() => openInNewTab(row.seq)}
              >
                <TableCell>{row.seq}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.centName}</TableCell>
                <TableCell>{row.areaName}</TableCell>
                <TableCell>{row.regDate}</TableCell>
                <TableCell>{row.statusName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
