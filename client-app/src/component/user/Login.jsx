import * as React from "react";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync } from "../../slice/AuthSlice.js";
import { TextField, Typography, Box } from "@mui/material";

const providers = [
  { id: "naver", name: "Naver" },
  { id: "google", name: "Google" },
  { id: "credentials", name: "Email and Password" },
];

export default function EmailLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{
          form: { noValidate: true },
          credentials: {
            inputs: (
              <>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  required
                  disabled={isLoading}
                />
                <TextField
                  name="password"
                  label="Password"
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
          "& form > .MuiStack-root": {
            marginTop: "2rem",
            rowGap: "0.5rem",
          },
        }}
        disabled={isLoading}
      />

      {/* 👇 로그인 폼 바로 아래에 Sign up 문구 삽입 */}
      <Typography sx={{ mt: 2 }}>
        계정이 없으신가요?{" "}
        <Link to="/save" style={{ textDecoration: "underline" }}>
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
