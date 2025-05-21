import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  ResponsiveContainer,
} from "recharts";
import { getForecast } from "../../api/analysisApi.js";
import { getPaymentCountByRange } from "../../api/paymentLogApi.js";

const PaymentForecast = () => {
  const [combined, setCombined] = useState([]);

  useEffect(() => {
    const fetchAndForecast = async () => {
      const from = "2024-05-01";
      const to = "2024-05-20";

      try {
        const response = await getPaymentCountByRange(from, to);
        const historyData = response.data.map((item) => ({
          ds: item.period,
          y: item.count,
        }));

        const lastDateStr = historyData[historyData.length - 1].ds;
        const lastDate = new Date(lastDateStr);

        const forecastResult = await getForecast(historyData);
        console.log(
          "📈 forecastResult:",
          forecastResult.map((f) => f.ds)
        );

        const forecastData = forecastResult.map((item) => {
          const dateStr = new Date(item.ds).toISOString().split("T")[0];
          return {
            ds: dateStr,
            y: item.yhat,
            yhat_lower: item.yhat_lower,
            yhat_upper: item.yhat_upper,
          };
        });

        const filteredForecast = forecastData.filter(
          (item) => new Date(item.ds) > lastDate
        );

        const merged = [
          ...historyData.map((h) => ({
            ds: h.ds,
            actual: h.y, // Use 'actual' for historical data
            yhat_lower: null,
            yhat_upper: null,
            type: "actual",
          })),
          ...filteredForecast.map((f) => ({
            ds: f.ds,
            forecast: f.y, // Use 'forecast' for predicted data
            yhat_lower: f.yhat_lower,
            yhat_upper: f.yhat_upper,
            type: "forecast",
          })),
        ];

        setCombined(merged);
      } catch (error) {
        console.error("예측 실패:", error);
      }
    };

    fetchAndForecast();
  }, []);
  console.log("Combined data:", combined);

  return (
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

        {/* Confidence Interval Area for Forecast */}
        <Area
          type="monotone"
          dataKey="yhat_upper"
          stackId="ci"
          stroke="none"
          fill="#8884d8"
          fillOpacity={0.2}
          name="Confidence Interval"
          data={combined.filter((d) => d.type === "forecast")}
        />
        <Area
          type="monotone"
          dataKey="yhat_lower"
          stackId="ci"
          stroke="none"
          fill="transparent"
          data={combined.filter((d) => d.type === "forecast")}
        />

        {/* Actual Data Line */}
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#82ca9d"
          dot={false}
          name="Actual"
          isAnimationActive={false}
        />

        {/* Forecast Data Line */}
        <Line
          type="monotone"
          dataKey="forecast"
          stroke="#ff7300"
          strokeDasharray="5 5"
          dot={false}
          name="Forecast"
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PaymentForecast;

// // const PaymentForecast = ({ forecastData = [] }) => {
// //   const [combined, setCombined] = useState([]);

// //   useEffect(() => {
// //     if (!forecastData || forecastData.length === 0) return;

// //     const actual = forecastData
// //       .filter((d) => d.type === "actual")
// //       .map((d) => ({
// //         ...d,
// //         actual: d.y,
// //         forecast: null,
// //       }));

// //     const forecast = forecastData
// //       .filter((d) => d.type === "forecast")
// //       .map((d) => ({
// //         ...d,
// //         actual: null,
// //         forecast: d.y,
// //       }));

// //     setCombined([...actual, ...forecast]);
// //   }, [forecastData]);

// //   return (
// //     <ResponsiveContainer width="100%" height={400}>
// //       <LineChart
// //         data={combined}
// //         margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
// //       >
// //         <CartesianGrid strokeDasharray="3 3" />
// //         <XAxis dataKey="ds" />
// //         <YAxis />
// //         <Tooltip />
// //         <Legend />
// //         <Area
// //           type="monotone"
// //           dataKey="yhat_upper"
// //           stroke="none"
// //           fill="#ccc"
// //           fillOpacity={0.3}
// //           name="신뢰 구간"
// //           baseLine={(point) => point.yhat_lower}
// //         />
// //         <Line
// //           type="monotone"
// //           dataKey="actual"
// //           stroke="#82ca9d"
// //           dot={false}
// //           name="실제"
// //         />
// //         <Line
// //           type="monotone"
// //           dataKey="forecast"
// //           stroke="#ff7300"
// //           strokeDasharray="5 5"
// //           dot={false}
// //           name="예측"
// //         />
// //       </LineChart>
// //     </ResponsiveContainer>
// //   );
// // };

// // export default PaymentForecast;

// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   Area,
//   ResponsiveContainer,
//   Box,
//   Button,
//   Stack,
//   Typography,
// } from "@mui/material";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { getForecast } from "../../api/analysisApi.js";
// import { getPaymentCountByRange } from "../../api/paymentLogApi.js";

// const PaymentForecast = () => {
//   const [combined, setCombined] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date("2024-05-01"));
//   const [toDate, setToDate] = useState(new Date("2024-05-20"));

//   const fetchAndForecast = async (from, to) => {
//     try {
//       const fromStr = from.toISOString().split("T")[0];
//       const toStr = to.toISOString().split("T")[0];

//       const response = await getPaymentCountByRange(fromStr, toStr);
//       const historyData = response.data.map((item) => ({
//         ds: item.period,
//         y: item.count,
//       }));

//       const lastDateStr = historyData[historyData.length - 1].ds;
//       const lastDate = new Date(lastDateStr);

//       const forecastResult = await getForecast(historyData);

//       const forecastData = forecastResult.map((item) => {
//         const dateStr = new Date(item.ds).toISOString().split("T")[0];
//         return {
//           ds: dateStr,
//           y: item.yhat,
//           yhat_lower: item.yhat_lower,
//           yhat_upper: item.yhat_upper,
//         };
//       });

//       const filteredForecast = forecastData.filter(
//         (item) => new Date(item.ds) > lastDate
//       );

//       const merged = [
//         ...historyData.map((h) => ({
//           ds: h.ds,
//           actual: h.y,
//           yhat_lower: null,
//           yhat_upper: null,
//           type: "actual",
//         })),
//         ...filteredForecast.map((f) => ({
//           ds: f.ds,
//           forecast: f.y,
//           yhat_lower: f.yhat_lower,
//           yhat_upper: f.yhat_upper,
//           type: "forecast",
//         })),
//       ];

//       setCombined(merged);
//     } catch (error) {
//       console.error("예측 실패:", error);
//     }
//   };

//   const handleSearch = () => {
//     if (fromDate && toDate) {
//       fetchAndForecast(fromDate, toDate);
//     }
//   };

//   return (
//     <Box sx={{ mt: 4 }}>
//       <Typography variant="h6" gutterBottom>
//         📈 결제 건수 예측 (신뢰 구간 포함)
//       </Typography>

//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <Stack direction="row" spacing={2} alignItems="center" mb={2}>
//           <DatePicker
//             label="시작일"
//             value={fromDate}
//             onChange={(newValue) => setFromDate(newValue)}
//           />
//           <DatePicker
//             label="종료일"
//             value={toDate}
//             onChange={(newValue) => setToDate(newValue)}
//           />
//           <Button variant="contained" onClick={handleSearch}>
//             조회
//           </Button>
//         </Stack>
//       </LocalizationProvider>

//       <ResponsiveContainer width="100%" height={400}>
//         <LineChart
//           data={combined}
//           margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="ds" />
//           <YAxis />
//           <Tooltip />
//           <Legend />

//           {/* 신뢰 구간 */}
//           <Area
//             type="monotone"
//             dataKey="yhat_upper"
//             stroke="none"
//             fill="#ccc"
//             fillOpacity={0.3}
//             name="신뢰 상한"
//             data={combined.filter((d) => d.type === "forecast")}
//           />
//           <Area
//             type="monotone"
//             dataKey="yhat_lower"
//             stroke="none"
//             fill="#fff"
//             fillOpacity={0}
//             name="신뢰 하한"
//             data={combined.filter((d) => d.type === "forecast")}
//           />

//           <Line
//             type="monotone"
//             dataKey="actual"
//             stroke="#82ca9d"
//             dot={false}
//             name="실제"
//             isAnimationActive={false}
//           />
//           <Line
//             type="monotone"
//             dataKey="forecast"
//             stroke="#ff7300"
//             strokeDasharray="5 5"
//             dot={false}
//             name="예측"
//             isAnimationActive={false}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// export default PaymentForecast;
