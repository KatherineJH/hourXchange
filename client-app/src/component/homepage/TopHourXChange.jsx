// import { Typography, Box } from "@mui/material";
// import { display, fontSize } from "@mui/system";
// import React, { useEffect, useRef, useState } from "react";
// import Typed from "typed.js";

// function TopHourXChange() {
//   const typedRef = useRef(null);
//   const typedInstance = useRef(null);
//   const [start, setStart] = useState(false);

//   useEffect(() => {
//     // 0.2초 후 타이핑 시작
//     setTimeout(() => {
//       setStart(true);

//       typedInstance.current = new Typed(typedRef.current, {
//         strings: ["당신의 시간,\n가장 따뜻한 기부가 됩니다\nHourXChange"],
//         typeSpeed: 40,
//         backSpeed: 20,
//         loop: false,
//       });
//     }, 200);

//     return () => {
//       typedInstance.current?.destroy();
//     };
//   }, []);

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         position: "relative",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "third.main",
//         overflow: "hidden",
//       }}
//     >
//       <img
//         src="/hourFriends.png"
//         alt="HourXChange 캐릭터들"
//         style={{ width: 250, height: 170, bottom: 0, p: 0 }}
//       />
//       <div
//         ref={typedRef}
//         style={{
//           fontSize: "clamp(2rem, 5vw, 5em)",
//           color: "#f07b5a",
//           fontFamily: "Gamja Flower",
//           textAlign: "center",
//           whiteSpace: "pre",
//           animation: start ? "slideUpFadeIn 1s ease-out forwards" : "none",
//         }}
//       />
//     </Box>
//   );
// }
// export default TopHourXChange;

import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

function TopHourXChange() {
  const typedRef = useRef(null);
  const typedInstance = useRef(null);

  useEffect(() => {
    typedInstance.current = new Typed(typedRef.current, {
      strings: ["당신의 시간,<br>가장 따뜻한 기부가 됩니다<br>HourXChange"],
      typeSpeed: 40,
      backSpeed: 20,
      loop: false,
      showCursor: false,
    });

    return () => {
      typedInstance.current?.destroy();
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "third.main", // MUI theme에서 정의한 색상
        height: 500,
        overflow: "hidden",
      }}
    >
      <img
        src="/hourFriends.png"
        alt="HourXChange 캐릭터들"
        style={{
          width: 250,
          height: 170,
          marginBottom: 16,
        }}
      />

      {/* 타이핑 텍스트 */}
      <div
        ref={typedRef}
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5em)",
          color: "#f07b5a",
          fontFamily: "Gamja Flower",
          textAlign: "center",
          lineHeight: 1.5,
          whiteSpace: "pre-line",
          minHeight: "6em",
        }}
      />
    </Box>
  );
}

export default TopHourXChange;
