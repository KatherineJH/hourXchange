// import React from "react";
// import { Box, Button, Typography } from "@mui/material";

// function Mid3HourXChange() {
//   return (
//     <Box
//       sx={{
//         position: "relative",
//         width: "100%",
//         bgcolor: "#FFF176",
//         overflow: "hidden",
//       }}
//     >
//       {/* 내용 영역 */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           px: 6,
//           py: 10,
//           flexWrap: "wrap",
//           zIndex: 1,
//           position: "relative",
//         }}
//       >
//         {/* 왼쪽 텍스트 */}
//         <Box sx={{ flex: 1, minWidth: 300 }}>
//           <Typography variant="h4" fontWeight="bold" gutterBottom>
//             따뜻함이 모이는 공간!
//           </Typography>
//           <Typography variant="h4" fontWeight="bold" gutterBottom>
//             로그인하고 더 많은 서비스를 둘러보세요!
//           </Typography>
//           <Box sx={{ mt: 2 }}>
//             <Button variant="contained" sx={{ mr: 2 }}>
//               로그인 하러 가기
//             </Button>
//             <Button variant="outlined">회원가입 하러 가기</Button>
//           </Box>
//         </Box>

//         {/* 오른쪽 이미지 */}
//         <Box sx={{ flex: 1, textAlign: "center", minWidth: 300 }}>
//           <img
//             src="/hourXFriends.png"
//             alt="middleimg"
//             style={{ height: 400, maxWidth: "100%" }}
//           />
//         </Box>
//       </Box>

//       {/* 하단 물결 SVG */}
//       <Box
//         component="svg"
//         viewBox="0 0 1440 320"
//         xmlns="http://www.w3.org/2000/svg"
//         sx={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           width: "100%",
//           height: "auto",
//           zIndex: 0,
//         }}
//       >
//         <path
//           fill="#fffde7" // 배경보다 더 연한 색
//           d="M0,288L48,272C96,256,192,224,288,202.7C384,181,480,171,576,160C672,149,768,139,864,160C960,181,1056,235,1152,229.3C1248,224,1344,160,1392,128L1440,96V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"
//         />
//       </Box>
//     </Box>
//   );
// }

// export default Mid3HourXChange;

import React, { useRef, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Mid3HourXChange() {
  const navigate = useNavigate();
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        bgcolor: "#FFF176",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 6,
          py: 10,
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* 텍스트 영역 */}
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            따뜻함이 모이는 공간!
          </Typography>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            로그인하고 더 많은 서비스를 둘러보세요!
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={() => navigate("/login")}
            >
              로그인 하러 가기
            </Button>
            <Button variant="outlined" onClick={() => navigate("/save")}>
              회원가입 하러 가기
            </Button>
          </Box>
        </Box>

        {/* 이미지 영역 (오른쪽 → 왼쪽 슬라이드) */}
        <Box sx={{ flex: 1, textAlign: "center", minWidth: 300 }} ref={ref}>
          <motion.img
            src="/hourXFriends.png"
            alt="middleimg"
            style={{ height: 400, maxWidth: "100%" }}
            initial={{ x: 200, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ type: "spring", duration: 1 }}
          />
        </Box>
      </Box>

      {/* 하단 물결 SVG */}
      <Box
        component="svg"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "auto",
          zIndex: 0,
        }}
      >
        <path
          fill="#fffde7"
          fillOpacity="1"
          d="M0,288L48,272C96,256,192,224,288,202.7C384,181,480,171,576,160C672,149,768,139,864,160C960,181,1056,235,1152,229.3C1248,224,1344,160,1392,128L1440,96V320H0Z"
        />
      </Box>
    </Box>
  );
}

export default Mid3HourXChange;
