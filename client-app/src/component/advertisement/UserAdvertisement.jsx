// import React from "react";
// import { Box, Typography, CardContent } from "@mui/material";

// function UserAdvertisement({ ad }) {
//   if (!ad) {
//     return (
//       <Box
//         sx={{
//           border: "1px dashed gray",
//           padding: 2,
//           borderRadius: 2,
//           textAlign: "center",
//         }}
//       >
//         <Typography color="text.secondary">
//           광고를 불러오는 중입니다...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: 700,
//         p: 2,
//         border: "1px solid #ccc",
//         borderRadius: 2,
//         backgroundColor: "#fafafa",
//         maxWidth: 300,
//         width: "100%",
//         flexDirection: "column",
//         boxShadow: 3,
//       }}
//     >
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           {ad.title}
//         </Typography>
//         <Typography variant="body2" gutterBottom>
//           {ad.description}
//         </Typography>
//       </CardContent>
//       <Box
//         component="img"
//         src={ad.imgUrl ?? "/donationAd.png"}
//         alt={ad.title}
//         sx={{
//           width: "100%",
//           borderRadius: 1,
//           mb: 2,
//         }}
//       />
//       <Typography variant="caption" color="text.secondary">
//         작성자: {ad.ownerName}
//       </Typography>
//     </Box>
//   );
// }

// export default UserAdvertisement;

import React from "react";
import { Box, Typography, CardContent, Chip, Button } from "@mui/material";

function UserAdvertisement({ ad }) {
  if (!ad) {
    return (
      <Box
        sx={{
          border: "1px dashed gray",
          padding: 2,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">
          광고를 불러오는 중입니다...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 300,
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        background: "linear-gradient(to bottom, #ffffff, #f7f7f7)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* AD 배지 */}
      <Chip
        label="AD"
        color="warning"
        size="small"
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
      />

      {/* 이미지 */}
      <Box
        component="img"
        src={ad.imgUrl ?? "/donateNow.png"}
        alt={ad.title}
        sx={{ width: "100%", height: 160, objectFit: "cover" }}
      />

      {/* 콘텐츠 */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {ad.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
          {ad.description}
        </Typography>
      </CardContent>

      {/* CTA 버튼 */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          href={ad.linkUrl || "#"}
          target="_blank"
        >
          자세히 보기
        </Button>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          작성자: {ad.ownerName}
        </Typography>
      </Box>
    </Box>
  );
}

export default UserAdvertisement;
