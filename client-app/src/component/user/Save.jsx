import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
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
import { getAdvertisement } from "../../api/advertisementApi.js";
import AdvertisementCard from "../advertisement/AdvertisementCard.jsx";

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow:
    "rgba(0, 0, 0, 0.05) 0px 5px 15px, rgba(0, 0, 0, 0.05) 0px 15px 35px -5px",
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

  // 전체 광고 배열을 담을 상태
  const [ads, setAds] = useState([]);

  // 광고를 4개씩 분할해서 좌·우에 뿌리기 위함
  const leftAds = ads.slice(0, 2);
  const rightAds = ads.slice(2, 4);

  const location = useLocation();
  // Save → 로그인에서 받는 from 이 문자열일 수도 있으니
  const rawFrom = location.state?.from;
  const from = typeof rawFrom === "string" ? rawFrom : rawFrom?.pathname || "/";

  // 회원가입 폼 핸들링
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
      alert("회원가입이 완료되었습니다.");
      navigate("/login", { state: { from }, replace: true });
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  };

  // 마운트 시 한 번만 광고 리스트를 불러와서 ads 상태에 저장
  useEffect(() => {
    getAdvertisement()
      .then((res) => {
        // API 응답이 { content: [...] } 형태라면 res.content 사용
        // 만약 배열 그 자체를 반환하면 res 사용
        const list = Array.isArray(res.content) ? res.content : [];
        setAds(list);
      })
      .catch((err) => console.error("광고 로딩 실패:", err));
  }, []);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "center",
          px: 2,
          gap: 2,
        }}
      >
        {/* 왼쪽 광고 */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          
            alignItems: "center",
            position: { xs: "static", md: "sticky" },
            
            height: "100%",
          }}
        >
          {leftAds.map((ad, index) => (
            <AdvertisementCard key={`left-${index}`} ad={ad} />
          ))}
        </Box>

        <Box
          sx={{
            flex: 3,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            mt: { xs: 4, md: 15 }, // md 이상에서 20(spacing) = 160px
          }}
        >
          <Card
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 410,
              width: "100%",
              p: 4,
              borderRadius: 1,
              boxShadow:
                "0px 4px 8px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.3)",
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
                  " " +
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

        <Box
          sx={(theme) => ({
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: { xs: "static", md: "sticky" },
          })}
        >
          {rightAds.map((ad, index) => (
            <AdvertisementCard key={`right-${index}`} ad={ad} />
          ))}
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
