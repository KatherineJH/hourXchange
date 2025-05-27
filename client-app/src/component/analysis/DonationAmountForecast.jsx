// src/component/analysis/DonationAmountForecast.jsx
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getForecast } from "../../api/analysisApi.js";
import { getDonationAmountByRange } from "../../api/donationHistoryApi.js";
import { getRowFromTable } from "../../api/commonApi.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import dayjs from "dayjs";

const DonationAmountForecast = () => {
  const [combined, setCombined] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(7);

  useEffect(() => {
    const fetchDateRange = async () => {
      try {
        const firstRow = await getRowFromTable("donationhistory", "first");
        const lastRow = await getRowFromTable("donationhistory", "last");

        const extractDate = (row) =>
          row.createdAt || row.created_at || row.period || row.date;

        const startDate = extractDate(firstRow);
        const endDate = extractDate(lastRow);

        if (startDate && endDate) {
          const min = dayjs(startDate);
          const max = dayjs(endDate);
          const today = dayjs();

          setMinDate(min);
          setMaxDate(max);
        }
      } catch (err) {
        console.error("Failed to fetch valid date range:", err);
      }
    };

    fetchDateRange();
  }, [selectedPeriod]);

  useEffect(() => {
    if (minDate && maxDate) {
      const today = dayjs(); // 현재 날짜 기준으로
      const estimatedTo = today.isAfter(maxDate) ? maxDate : today;
      const estimatedFrom = calculateStartDate(
        selectedPeriod,
        estimatedTo,
        minDate
      );
      // console.log("▶️ 기간 자동 설정됨:", {
      //   from: estimatedFrom.format("YYYY-MM-DD"),
      //   to: estimatedTo.format("YYYY-MM-DD"),
      // });
      setFrom(estimatedFrom);
      setTo(estimatedTo);
    }
  }, [minDate, maxDate, selectedPeriod]);

  const calculateStartDate = (period, to, minDate) => {
    let lookback;
    if (period === 7) lookback = to.subtract(2, "month");
    else if (period === 30) lookback = to.subtract(6, "month");
    else lookback = to.subtract(1, "year");

    const result = lookback.isBefore(minDate) ? minDate : lookback;

    // from과 to가 같아지는 걸 방지
    return result.isSame(to, "day") ? result.subtract(1, "day") : result;
  };

  useEffect(() => {
    if (!from || !to) return;

    const fetchAndForecast = async () => {
      try {
        const response = await getDonationAmountByRange(
          from.format("YYYY-MM-DD"),
          to.format("YYYY-MM-DD")
        );

        const historyData = response.data.map((item) => ({
          ds: item.period,
          actual: item.sum,
          type: "actual",
        }));

        const lastDate = new Date(historyData[historyData.length - 1].ds);

        const forecastResult = await getForecast(
          historyData.map((item) => ({ ds: item.ds, y: item.actual })),
          selectedPeriod
        );
        // console.log("forecastResult:", forecastResult);

        const forecastData = forecastResult
          .map((item) => {
            const date = new Date(item.ds);
            if (isNaN(date)) return null; // 유효하지 않은 날짜 방지
            return {
              ds: date.toISOString().split("T")[0],
              forecast: item.yhat,
              type: "forecast",
            };
          })
          .filter((item) => item !== null && new Date(item.ds) > lastDate);

        setCombined([...historyData, ...forecastData]);
      } catch (error) {
        console.error("예측 실패:", error);
      }
    };

    fetchAndForecast();
  }, [from, to, selectedPeriod]);

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" gap={2} mb={2}>
          <DatePicker
            label="From"
            value={from}
            onChange={setFrom}
            minDate={minDate}
            maxDate={maxDate}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="To"
            value={to}
            onChange={setTo}
            minDate={minDate}
            maxDate={maxDate}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>예측 기간</InputLabel>
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              label="예측 기간"
            >
              <MenuItem value={7}>7일</MenuItem>
              <MenuItem value={30}>30일</MenuItem>
              <MenuItem value={90}>1분기 (90일)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </LocalizationProvider>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={combined}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ds" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#82ca9d"
            dot={false}
            name="Actual Amount"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#ff7300"
            strokeDasharray="5 5"
            dot={false}
            name="Forecast Amount"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DonationAmountForecast;
