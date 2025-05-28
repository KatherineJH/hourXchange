// import React, { useEffect, useState } from "react";
// import { Box, Typography } from "@mui/material";
// import AdvertisementCard from "../component/advertisement/AdvertisementCard.jsx";
// import { getAdvertisement } from "../api/advertisementApi.js";

// const RightSideBar = () => {
//   const [ad, setAd] = useState(null);

//   useEffect(() => {
//     getAdvertisement()
//       .then((ads) => {
//         console.log("📦 광고 리스트:", ads); // ads는 배열이어야 함
//         if (ads.length > 0) {
//           setAd(ads[0]); // 하나만 선택해서 보여주기
//         }
//       })
//       .catch((err) => {
//         console.error("❌ 광고 불러오기 실패", err);
//       });
//   }, []);

//   return (
//     <Box sx={{ width: 320, padding: 2 }}>
//       <Typography variant="h6" sx={{ mb: 2 }}>
//         📢 지금 올라온 광고
//       </Typography>
//       {ad && (
//         <AdvertisementCard
//           id={ad.id}
//           title={ad.title}
//           description={ad.description}
//           ownerName={ad.ownerName}
//         />
//       )}
//     </Box>
//   );
// };

// export default RightSideBar;
