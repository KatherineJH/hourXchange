import { Box, Typography, CardContent } from "@mui/material";
import PaymentForecast from "./PaymentForecast";

const PaymentAnalysisPage = () => {

  return (
    <Box sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          📊 결제 분석 <br />
          <br />
        </Typography>
        <Typography variant="h6" gutterBottom>
          📈 결제 건수 예측
        </Typography>
        <PaymentForecast />
      </CardContent>
    </Box>
  );
};

export default PaymentAnalysisPage;
