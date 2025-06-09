import * as React from "react";
import { Box, Typography, TextField, Link as MuiLink } from "@mui/material";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync } from "../../slice/AuthSlice.js";
import { getAdvertisement } from "../../api/advertisementApi.js";
import { useState, useEffect } from "react";
import UserAdvertisement from "../advertisement/UserAdvertisement.jsx";

export default function EmailLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [ads, setAds] = useState([]);

  useEffect(() => {
    getAdvertisement()
      .then((res) => {
        if (Array.isArray(res.content)) {
          setAds(res.content);
        }
      })
      .catch((err) => console.error("광고 로딩 실패:", err));
  }, []);

  const signIn = async (provider, formData) => {
    switch (provider.id) {
      case "naver":
      case "google":
      case "github":
        window.location.href = `${backendUrl}/oauth2/authorization/${provider.id}`;
        return {};
      case "credentials":
        try {
          const email = formData.get("email");
          const password = formData.get("password");

          console.log("formData:", Object.fromEntries(formData));
          console.log("추출된 값:", { email, password });
          if (!email || !password) {
            throw new Error("이메일 또는 비밀번호가 입력되지 않았습니다.");
          }

          console.log(formData.get("email"));
          const response = await dispatch(loginUserAsync(formData)).unwrap();

          console.log("로그인 성공 응답:", response);
          alert("로그인 성공!");
          navigate("/");
          return {};
        } catch (error) {
          console.error("로그인 실패:", error);
          const errorMessage = "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.";
          alert(errorMessage);
          return { error: errorMessage };
        }
      default:
        return { error: "지원하지 않는 로그인 방식입니다." };
    }
  };

  // ← 이 부분만 변경
  const leftAds = ads.slice(0, 3);
  const rightAds = ads.slice(3, 6);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        px: 2,
        gap: 2,
        overflowY: "auto",
      }}
    >
      {/* 왼쪽 광고 (1개) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          alignItems: "center",
          position: "sticky",
          top: 170,
        }}
      >
        {leftAds.map((ad, index) => (
          <UserAdvertisement key={`left-${index}`} ad={ad} />
        ))}
      </Box>

      {/* 로그인 폼 */}
      <Box sx={{ flex: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 500 }}>
          <SignInPage
            signIn={signIn}
            providers={[
              { id: "naver", name: "Naver" },
              { id: "google", name: "Google" },
              { id: "github", name: "GitHub" },
              { id: "credentials", name: "Email and Password" },
            ]}
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
          />
        </Box>
      </Box>

      {/* 오른쪽 광고  */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          alignItems: "center",
          position: "sticky",
          mt: 20,
          height: "100%",
        }}
      >
        {rightAds.map((ad, index) => (
          <UserAdvertisement key={`right-${index}`} ad={ad} />
        ))}
      </Box>
    </Box>
  );
}
