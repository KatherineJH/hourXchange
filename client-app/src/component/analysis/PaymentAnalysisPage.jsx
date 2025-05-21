import { useEffect, useState } from "react";
import { Box, Typography, CardContent } from "@mui/material";
import { getForecast } from "../../api/analysisApi";
import { getPaymentCountByRange } from "../../api/paymentLogApi";
import PaymentForecast from "./PaymentForecast";

const PaymentAnalysisPage = () => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      const from = "2024-05-01";
      const to = "2024-05-20";
      try {
        const res = await getPaymentCountByRange(from, to);
        const history = res.data.map((item) => ({
          ds: item.period,
          y: item.count,
        }));

        const forecast = await getForecast(history);

        const merged = [
          ...history.map((item) => ({
            ds: item.ds,
            y: item.y,
            type: "actual",
          })),
          ...forecast.map((item) => ({
            ds: item.ds.split("T")[0],
            y: item.yhat,
            yhat_lower: item.yhat_lower,
            yhat_upper: item.yhat_upper,
            type: "forecast",
          })),
        ];

        setForecastData(merged);
      } catch (err) {
        console.error("예측 데이터 실패:", err);
      }
    };
    fetchForecast();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          📊 결제 분석
        </Typography>
        <Typography variant="h6" gutterBottom>
          📈 결제 건수 예측 (신뢰 구간 포함)
        </Typography>
        <PaymentForecast forecastData={forecastData} />
      </CardContent>
    </Box>
  );
};

export default PaymentAnalysisPage;
