// // import * as React from "react";
// import { SignInPage } from "@toolpad/core/SignInPage";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUserAsync } from "../../slice/AuthSlice.js";
// import { TextField, Typography, Box, Link as MuiLink } from "@mui/material";
// import React, { useState, useEffect } from "react";
// import { getAdvertisement } from "../../api/advertisementApi.js";
// import AdvertisementCard from "../advertisement/AdvertisementCard.jsx";
// const providers = [
//   { id: "naver", name: "Naver" },
//   { id: "google", name: "Google" },
//   { id: "credentials", name: "Email and Password" },
// ];

// export default function EmailLoginForm() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { isLoading, error } = useSelector((state) => state.auth);
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [ad, setAd] = useState(null);

//   useEffect(() => {
//     getAdvertisement()
//       .then((ads) => {
//         if (ads.length > 0) {
//           setAd(ads[0]);
//         }
//       })
//       .catch((err) => console.error("광고 로딩 실패:", err));
//   }, []);

//   const signIn = async (provider, formData) => {
//     console.log("선택된 provider:", provider.id); // 디버깅: 어떤 provider가 호출되었는지 확인
//     switch (provider.id) {
//       case "naver":
//         console.log("Naver 로그인 리디렉션 시작");
//         window.location.href = `${backendUrl}/oauth2/authorization/naver`;
//         return {};

//       case "google":
//         console.log("Google 로그인 리디렉션 시작");
//         window.location.href = `${backendUrl}/oauth2/authorization/google`;
//         return {};

//       case "credentials":
//         try {
//           const email = formData.get("email");
//           const password = formData.get("password");

//           console.log("formData:", Object.fromEntries(formData)); // 디버깅
//           console.log("추출된 값:", { email, password }); // 디버깅

//           if (!email || !password) {
//             throw new Error("이메일 또는 비밀번호가 입력되지 않았습니다.");
//           }

//           console.log(formData.get("email"));
//           const response = await dispatch(loginUserAsync(formData));

//           console.log("로그인 성공 응답:", response); // 디버깅
//           alert("로그인 성공!");
//           navigate("/");
//           return {};
//         } catch (error) {
//           console.error("로그인 실패:", error);
//           const errorMessage =
//             error?.response?.data?.message ||
//             error?.message ||
//             "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.";
//           alert(errorMessage);
//           return { error: errorMessage };
//         }

//       default:
//         console.warn("알 수 없는 provider:", provider.id); // 디버깅
//         return { error: "지원하지 않는 로그인 방식입니다." };
//     }
//   };

//   return (
//     //   <SignInPage
//     //     signIn={signIn}
//     //     providers={providers}
//     //     slots={{
//     //       // SignInPage 내부에 Sign up 문구를 완전히 커스터마이징
//     //       signUpLink: () => (
//     //         <Typography sx={{ textAlign: "center", mt: 2 }}>
//     //           계정이 없으신가요?{" "}
//     //           <MuiLink component={RouterLink} to="/save" underline="hover">
//     //             Sign up
//     //           </MuiLink>
//     //         </Typography>
//     //       ),
//     //     }}
//     //     slotProps={{
//     //       credentials: {
//     //         inputs: (
//     //           <>
//     //             <TextField
//     //               name="email"
//     //               label="이메일"
//     //               type="email"
//     //               fullWidth
//     //               margin="normal"
//     //               required
//     //               disabled={isLoading}
//     //             />
//     //             <TextField
//     //               name="password"
//     //               label="비밀번호"
//     //               type="password"
//     //               fullWidth
//     //               margin="normal"
//     //               required
//     //               disabled={isLoading}
//     //             />
//     //           </>
//     //         ),
//     //       },
//     //     }}
//     //     sx={{
//     //       // 추가 여백 조정 필요시 여기에 적용
//     //       "& .MuiStack-root": {
//     //         rowGap: "0.75rem",
//     //       },
//     //     }}
//     //   />
//     // );

//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "start",
//         width: "100%",
//         mt: 5,
//       }}
//     >
//       {/* 로그인 폼 */}
//       <Box sx={{ flexShrink: 0 }}>
//         <SignInPage
//           signIn={signIn}
//           providers={providers}
//           slots={{
//             signUpLink: () => (
//               <Typography sx={{ textAlign: "center", mt: 2 }}>
//                 계정이 없으신가요?{" "}
//                 <MuiLink component={RouterLink} to="/save" underline="hover">
//                   Sign up
//                 </MuiLink>
//               </Typography>
//             ),
//           }}
//           slotProps={{
//             credentials: {
//               inputs: (
//                 <>
//                   <TextField
//                     name="email"
//                     label="이메일"
//                     type="email"
//                     fullWidth
//                     margin="normal"
//                     required
//                     disabled={isLoading}
//                   />
//                   <TextField
//                     name="password"
//                     label="비밀번호"
//                     type="password"
//                     fullWidth
//                     margin="normal"
//                     required
//                     disabled={isLoading}
//                   />
//                 </>
//               ),
//             },
//           }}
//           sx={{
//             "& .MuiStack-root": {
//               rowGap: "0.75rem",
//             },
//           }}
//         />
//       </Box>

//       {/* 광고 카드 (오른쪽) */}
//       <Box sx={{ width: 320, ml: 4 }}>
//         {ad ? (
//           <AdvertisementCard
//             id={ad.id}
//             title={ad.title}
//             description={ad.description}
//             ownerName={ad.ownerName}
//           />
//         ) : (
//           <Typography sx={{ mt: 2 }} color="text.secondary">
//             광고를 불러오는 중입니다...
//           </Typography>
//         )}
//       </Box>
//     </Box>
//   );
// }

import * as React from "react";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync } from "../../slice/AuthSlice.js";
import {
  TextField,
  Typography,
  Box,
  Link as MuiLink,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import { getAdvertisement } from "../../api/advertisementApi.js";
import { useEffect } from "react";

const providers = [
  { id: "naver", name: "Naver" },
  { id: "google", name: "Google" },
  { id: "github", name: "GitHub" },
  { id: "credentials", name: "Email and Password" },
];

export default function EmailLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [ad, setAd] = useState(null);

  useEffect(() => {
    getAdvertisement()
      .then((ads) => {
        if (ads.length > 0) {
          setAd(ads[0]);
        }
      })
      .catch((err) => console.error("광고 로딩 실패:", err));
  }, []);

  const signIn = async (provider, formData) => {
    console.log("선택된 provider:", provider.id); // 디버깅: 어떤 provider가 호출되었는지 확인
    switch (provider.id) {
      case "naver":
        console.log("Naver 로그인 리디렉션 시작");
        window.location.href = `${backendUrl}/oauth2/authorization/naver`;
        return {};

      case "google":
        console.log("Google 로그인 리디렉션 시작");
        window.location.href = `${backendUrl}/oauth2/authorization/google`;
        return {};

      case "github":
        console.log("GitHub 로그인 리디렉션 시작");
        window.location.href = `${backendUrl}/oauth2/authorization/github`;
        return {};

      case "credentials":
        try {
          const email = formData.get("email");
          const password = formData.get("password");

          console.log("formData:", Object.fromEntries(formData)); // 디버깅
          console.log("추출된 값:", { email, password }); // 디버깅

          if (!email || !password) {
            throw new Error("이메일 또는 비밀번호가 입력되지 않았습니다.");
          }

          console.log(formData.get("email"));
          const response = await dispatch(loginUserAsync(formData));

          console.log("로그인 성공 응답:", response); // 디버깅
          alert("로그인 성공!");
          navigate("/");
          return {};
        } catch (error) {
          console.error("로그인 실패:", error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.";
          alert(errorMessage);
          return { error: errorMessage };
        }

      default:
        console.warn("알 수 없는 provider:", provider.id); // 디버깅
        return { error: "지원하지 않는 로그인 방식입니다." };
    }
  };

  // return (
  //   <>
  //     <>
  //       <Box
  //         sx={{
  //           flexDirection: {
  //             xs: "column", // 모바일/좁은 화면: 세로 정렬
  //             md: "row", // 데스크탑/넓은 화면: 가로 정렬
  //           },
  //           top: "100px",
  //           right: "0.1px",
  //           display: "flex", // 수평 정렬
  //           justifyContent: "flex-end", // 내부 요소 오른쪽 정렬
  //           width: "103%",
  //           height: "0",
  //           pr: 2,
  //         }}
  //       >
  //         <Box
  //           sx={{
  //             width: 350,
  //             height: 500,
  //             ml: 4,
  //             p: 2,
  //             border: "1px solid #ccc",
  //             borderRadius: 2,
  //             backgroundColor: "#fafafa",
  //             display: "flex",
  //             flexDirection: "column",
  //           }}
  //         >
  //           {ad ? (
  //             <>
  //               <Typography variant="h6" gutterBottom>
  //                 {ad.title}
  //               </Typography>
  //               <Typography variant="body2" gutterBottom>
  //                 {ad.description}
  //               </Typography>
  //               <Typography
  //                 variant="caption"
  //                 color="text.secondary"
  //                 sx={{ mt: "auto" }}
  //               >
  //                 작성자: {ad.ownerName}
  //               </Typography>
  //             </>
  //           ) : (
  //             <Typography sx={{ mt: 2 }} color="text.secondary">
  //               광고를 불러오는 중입니다...
  //             </Typography>
  //           )}
  //         </Box>
  //       </Box>
  //     </>

  //     <SignInPage
  //       signIn={signIn}
  //       providers={providers}
  //       slots={{
  //         // SignInPage 내부에 Sign up 문구를 완전히 커스터마이징
  //         signUpLink: () => (
  //           <Typography sx={{ textAlign: "center", mt: 2 }}>
  //             계정이 없으신가요?{" "}
  //             <MuiLink component={RouterLink} to="/save" underline="hover">
  //               Sign up
  //             </MuiLink>
  //           </Typography>
  //         ),
  //       }}
  //       slotProps={{
  //         credentials: {
  //           inputs: (
  //             <>
  //               <TextField
  //                 name="email"
  //                 label="이메일"
  //                 type="email"
  //                 fullWidth
  //                 margin="normal"
  //                 required
  //                 disabled={isLoading}
  //               />
  //               <TextField
  //                 name="password"
  //                 label="비밀번호"
  //                 type="password"
  //                 fullWidth
  //                 margin="normal"
  //                 required
  //                 disabled={isLoading}
  //               />
  //             </>
  //           ),
  //         },
  //       }}
  //       sx={{
  //         // 추가 여백 조정 필요시 여기에 적용
  //         "& .MuiStack-root": {
  //           rowGap: "0.75rem",
  //         },
  //       }}
  //     />
  //   </>
  // );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        // gap: 4,
        // px: 2,
        mt: 7,
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      {/* 로그인 폼 */}
      <Box
        sx={{
          flex: 4,
        }}
      >
        <SignInPage
          signIn={signIn}
          providers={providers}
          slots={{
            signUpLink: () => (
              <Typography sx={{ textAlign: "center", mt: 2 }}>
                계정이 없으신가요?{" "}
                <MuiLink component={RouterLink} to="/save" underline="hover">
                  Sign up
                </MuiLink>
              </Typography>
            ),
          }}
          slotProps={{
            credentials: {
              inputs: (
                <>
                  <TextField
                    name="email"
                    label="이메일"
                    type="email"
                    fullWidth
                    margin="normal"
                    required
                    disabled={isLoading}
                  />
                  <TextField
                    name="password"
                    label="비밀번호"
                    type="password"
                    fullWidth
                    margin="normal"
                    required
                    disabled={isLoading}
                  />
                </>
              ),
            },
          }}
          sx={{
            "& .MuiStack-root": {
              rowGap: "0.75rem",
            },
            height: "auto !important",
            display: "flex !important",
            flexDirection: "column !important",
            justifyContent: "flex-start !important",
          }}
        />
      </Box>

      {/* 광고 박스 */}
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            width: 300,
            minHeight: 700,
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "#fafafa",
            maxWidth: 300,
            width: "100%",
            flexDirection: "column",
            boxShadow: 3,
          }}
        >
          {ad ? (
            <>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {ad.title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {ad.description}
                </Typography>
              </CardContent>
              <Box
                component="img"
                src={ad.imgUrl ?? "/donationAd.png"}
                alt={ad.title}
                sx={{
                  width: "100%",
                  borderRadius: 1,
                  mb: 2,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: "auto" }}
              >
                작성자: {ad.ownerName}
              </Typography>
            </>
          ) : (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              광고를 불러오는 중입니다...
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
