import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { styled } from "@mui/material/styles";

import AddressForm from "./AddressForm.jsx";
import { postSave } from "../../api/authApi.js";

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
  const [saveData, setSaveData] = useState(initState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaveData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saveData.password !== saveData.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return; // 서버로 요청 보내지 않음
    }
    try {
      await postSave(saveData);
      navigate("/email-login", { replace: true });
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다. 다시 확인해주세요.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 500 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1" align="center">
              회원가입
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
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
              />

              {/* 주소 입력 컴포넌트 */}
              <AddressForm saveData={saveData} setSaveData={setSaveData} />

              <Button type="submit" variant="contained" fullWidth>
                저장
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
