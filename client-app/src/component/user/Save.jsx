import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Modal,
  CssBaseline,
  Link,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { postSave } from "../../api/authApi.js";
import UserAdvertisement from "../advertisement/UserAdvertisement.jsx";
import { getAdvertisement } from "../../api/advertisementApi.js";

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow:
    "rgba(0, 0, 0, 0.05) 0px 5px 15px, rgba(0, 0, 0, 0.05) 0px 15px 35px -5px",
}));

const SignUpContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundRepeat: "no-repeat",
  padding: theme.spacing(2),
  gap: 2,
}));

const initState = {
  name: "",
  username: "",
  password: "",
  passwordCheck: "",
  email: "",
  birthdate: "",
  address: {
    zonecode: "",
    roadAddress: "",
    jibunAddress: "",
    detailAddress: "",
  },
};

export default function Save() {
  const navigate = useNavigate();
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [saveData, setSaveData] = useState(initState);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaveData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    setSaveData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        detailAddress: e.target.value,
      },
    }));
  };

  const handleAddressComplete = (data) => {
    setSaveData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        zonecode: data.zonecode,
        roadAddress: data.roadAddress,
        jibunAddress: data.jibunAddress,
      },
    }));
    setIsPostcodeOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const birthDate = new Date(saveData.birthdate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      alert("생일은 미래 날짜로 설정할 수 없습니다.");
      return;
    }

    if (saveData.password !== saveData.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await postSave(saveData);
      alert("회원가입이 완료되었습니다.")
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다. 다시 확인해주세요.");
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          px: 2,
        }}
      >
        {/* 왼쪽 광고 영역 (1) */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <UserAdvertisement ad={ad} />
        </Box>

        {/* 중앙 회원가입 폼 (3) */}
        <Box sx={{ flex: 3, display: "flex", justifyContent: "center" }}>
          <Card
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 480,
              width: "100%",
              p: 4,
              borderRadius: 3,
              boxShadow:
                "rgba(0, 0, 0, 0.05) 0px 5px 15px, rgba(0, 0, 0, 0.05) 0px 15px 35px -5px",
            }}
          >
            <Stack spacing={1.5}>
              <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Sign Up
              </Typography>
              <TextField
                label="이메일"
                name="email"
                value={saveData.email}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="비밀번호"
                name="password"
                type="password"
                value={saveData.password}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="비밀번호 확인"
                name="passwordCheck"
                type="password"
                value={saveData.passwordCheck}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="이름"
                name="name"
                value={saveData.name}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="별명"
                name="username"
                value={saveData.username}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="생일"
                name="birthdate"
                type="date"
                value={saveData.birthdate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split("T")[0] }}
              />
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setIsPostcodeOpen(true)}
                sx={{ fontSize: "0.875rem", py: 1 }}
              >
                주소 검색
              </Button>
              <Typography variant="body2">
                {saveData.address.zonecode +
                  " " +
                  saveData.address.roadAddress +
                  saveData.address.jibunAddress}
              </Typography>
              <TextField
                label="상세 주소"
                name="detailAddress"
                value={saveData.address.detailAddress}
                onChange={handleDetailChange}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ fontSize: "0.875rem", py: 1, fontWeight: 500 }}
              >
                저장
              </Button>
              <Typography align="center" sx={{ mt: 1 }}>
                이미 계정이 있으신가요?{" "}
                <Link component={RouterLink} to="/login" underline="hover">
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </Card>
        </Box>

        {/* 오른쪽 광고 영역 (1) */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <UserAdvertisement ad={ad} />
        </Box>
      </Box>

      {/* 주소 검색 모달 */}
      <Modal open={isPostcodeOpen} onClose={() => setIsPostcodeOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            p: 2,
          }}
        >
          <DaumPostcode onComplete={handleAddressComplete} />
        </Box>
      </Modal>
    </>
  );
}
