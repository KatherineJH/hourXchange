import { Box, Typography } from "@mui/material";

function BannerStrip() {
  return (
    <Box
      sx={{
        overflow: "hidden",
        backgroundColor: "black",
        height: "50px",
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "inline-block",
          animation: "scrollText 20s linear infinite",
        }}
      >
        <Typography
          component="a"
          href="/main"
          sx={{ mx: 3, color: "#fff", fontSize: "1rem" }}
        >
          내 시간으로 누군가에게 희망을
        </Typography>
        <Typography
          component="a"
          href="/payment/buy"
          sx={{ mx: 4, color: "#fff", fontSize: "1rem" }}
        >
          시간으로 거래 가능
        </Typography>
        <Typography
          component="a"
          href="board/list"
          sx={{ mx: 4, color: "#fff", fontSize: "1rem" }}
        >
          커뮤니티 활성화!
        </Typography>
        <Typography
          component="a"
          href="product/list"
          sx={{ mx: 4, color: "#fff", fontSize: "1rem" }}
        >
          지역별로 보기!
        </Typography>
        <Typography
          component="a"
          href="donation/list"
          sx={{ mx: 4, color: "#fff", fontSize: "1rem" }}
        >
          기부 모집 중!
        </Typography>
        <Typography
          component="a"
          href="product/volunteer"
          sx={{ mx: 4, color: "#fff", fontSize: "1rem" }}
        >
          봉사 모집 중!
        </Typography>
      </Box>

      <style>
        {`
          @keyframes scrollText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </Box>
  );
}

export default BannerStrip;
