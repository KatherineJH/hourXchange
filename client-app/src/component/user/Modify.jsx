// src/component/user/Modify.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  Paper,
  Modal,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DaumPostcode from "react-daum-postcode";
import { fetchUser, updatePassword, updateUser } from "../../api/authApi";

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow:
    "rgba(0, 0, 0, 0.05) 0px 5px 15px, rgba(0, 0, 0, 0.05) 0px 15px 35px -5px",
}));

export default function Modify() {
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState(null);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });

  useEffect(() => {
    fetchUser().then((res) => {
      console.log("현재 사용자 정보:", res);
      setUserData(res);
      setForm({
        username: res.username,
        birthdate: res.birthdate,
        address: res.address || {
          zonecode: "",
          roadAddress: "",
          jibunAddress: "",
          detailAddress: "",
        },
      });
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressComplete = (data) => {
    setForm((prev) => ({
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

  const handleDetailAddressChange = (e) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, detailAddress: e.target.value },
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateUser(form);
      alert("정보가 성공적으로 수정되었습니다.");
    } catch (e) {
      console.error("수정 실패:", e);
      alert("수정 실패");
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.password || passwords.password !== passwords.confirm) {
      alert("비밀번호가 일치하지 않거나 비어 있습니다.");
      return;
    }
    try {
      await updatePassword({
        newPassword: passwords.password,
        confirmPassword: passwords.confirm,
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setPasswords({ password: "", confirm: "" });
    } catch (e) {
      console.error("비밀번호 변경 실패:", e);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  if (!userData || !form) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 4,
        px: 2,
        py: 4,
      }}
    >
      {/* 내 정보 수정 */}
      <Card sx={{ maxWidth: 400, flex: 1 }}>
        <Stack spacing={2}>
          <Typography variant="h6" align="center">
            내 정보 수정
          </Typography>
          <TextField label="이메일" value={userData.email} disabled fullWidth />
          <TextField
            label="별명"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="생일"
            name="birthdate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.birthdate}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="outlined" onClick={() => setIsPostcodeOpen(true)}>
            주소 검색
          </Button>
          <Typography variant="body2">
            {form.address.zonecode} {form.address.roadAddress}{" "}
            {form.address.jibunAddress}
          </Typography>
          <TextField
            label="상세 주소"
            name="detailAddress"
            value={form.address.detailAddress}
            onChange={handleDetailAddressChange}
            fullWidth
          />
          <Button variant="contained" onClick={handleSubmit}>
            수정하기
          </Button>
        </Stack>
      </Card>

      {/* 비밀번호 변경 */}
      <Card sx={{ maxWidth: 400, flex: 1 }}>
        <Stack spacing={2}>
          <Typography variant="h6" align="center">
            비밀번호 변경
          </Typography>
          <TextField
            label="새 비밀번호"
            type="password"
            fullWidth
            value={passwords.password}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <TextField
            label="비밀번호 확인"
            type="password"
            fullWidth
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
            }
          />
          <Button variant="contained" onClick={handlePasswordChange}>
            비밀번호 변경
          </Button>
        </Stack>
      </Card>

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
    </Box>
  );
}
