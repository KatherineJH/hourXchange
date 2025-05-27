// src/component/analysis/DonationAnalysisPage.jsx
import { Box, Typography, CardContent } from "@mui/material";
import DonationAmountForecast from "./DonationAmountForecast";
import DonationPayForecast from "./DonationPayForecast";

const DonationAnalysisPage = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          📊 기부 분석
        </Typography>
        <Typography variant="h6" gutterBottom>
          📈 기부 횟수 예측
        </Typography>
        <DonationPayForecast />
        <Typography variant="h6" gutterBottom>
          📈 기부 금액 예측
        </Typography>
        <DonationAmountForecast />
      </CardContent>
    </Box>
  );
};

export default DonationAnalysisPage;
