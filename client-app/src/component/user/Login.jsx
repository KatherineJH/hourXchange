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
import UserAdvertisement from "../advertisement/UserAdvertisement.jsx";

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
    console.log("선택된 provider:", provider.id);
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

          console.log("formData:", Object.fromEntries(formData));
          console.log("추출된 값:", { email, password });
          if (!email || !password) {
            throw new Error("이메일 또는 비밀번호가 입력되지 않았습니다.");
          }

          console.log(formData.get("email"));
          const response = await dispatch(loginUserAsync(formData));

          console.log("로그인 성공 응답:", response);
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
        console.warn("알 수 없는 provider:", provider.id);
        return { error: "지원하지 않는 로그인 방식입니다." };
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        gap: 2,
      }}
    >
      {/* 왼쪽 광고 (1) */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <UserAdvertisement ad={ad} />
      </Box>

      {/* 로그인 폼 (3) */}
      <Box sx={{ flex: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 500 }}>
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
          />
        </Box>
      </Box>
      {/* 오른쪽 광고 (1) */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <UserAdvertisement ad={ad} />
      </Box>
    </Box>
  );
}
