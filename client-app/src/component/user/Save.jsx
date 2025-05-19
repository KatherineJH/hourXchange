// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import DaumPostcode from "react-daum-postcode";

// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Modal,
// } from "@mui/material";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import { postSave } from "../../api/authApi.js";

// const initState = {
//   name: "",
//   username: "",
//   password: "",
//   passwordCheck: "",
//   email: "",
//   birthdate: "",
//   address: {
//     zonecode: "",
//     roadAddress: "",
//     jibunAddress: "",
//     detailAddress: "",
//   },
// };

// export default function Save() {
//   const navigate = useNavigate();
//   const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
//   const [saveData, setSaveData] = useState(initState); //모달 숨기기
//   //오늘 날짜 계산
//   const today = new Date().toISOString().split("T")[0];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSaveData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddressComplete = (data) => {
//     setSaveData((prev) => ({
//       ...prev,
//       address: {
//         ...prev.address,
//         zonecode: data.zonecode,
//         roadAddress: data.roadAddress,
//         jibunAddress: data.jibunAddress,
//       },
//     }));
//     setIsPostcodeOpen(false);
//   };

//   const handleDetailChange = (e) => {
//     setSaveData((prev) => ({
//       ...prev,
//       address: {
//         ...prev.address,
//         detailAddress: e.target.value,
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const birthDate = new Date(saveData.birthdate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // 시간을 00:00으로 초기화

//     if (birthDate > today) {
//       alert("생일은 미래 날짜로 설정할 수 없습니다.");
//       return;
//     }

//     if (saveData.password !== saveData.passwordCheck) {
//       alert("비밀번호가 일치하지 않습니다.");
//       return; // 서버로 요청 보내지 않음
//     }
//     try {
//       await postSave(saveData);
//       navigate("/email-login", { replace: true });
//     } catch (error) {
//       console.error(error);
//       alert("회원가입에 실패했습니다. 다시 확인해주세요.");
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//       <Card sx={{ width: "100%", maxWidth: 500 }}>
//         <CardContent>
//           <Stack spacing={2}>
//             <Typography variant="h5" component="h1" align="center">
//               회원가입
//             </Typography>
//             <Box
//               component="form"
//               noValidate
//               onSubmit={handleSubmit}
//               sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//             >
//               <TextField
//                 label="이메일"
//                 name="email"
//                 value={saveData.email}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//               <TextField
//                 label="비밀번호"
//                 name="password"
//                 type="password"
//                 value={saveData.password}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//               <TextField
//                 label="비밀번호 확인"
//                 name="passwordCheck"
//                 type="password"
//                 value={saveData.passwordCheck}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//               <TextField
//                 label="이름"
//                 name="name"
//                 value={saveData.name}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//               />
//               <TextField
//                 label="별명"
//                 name="username"
//                 value={saveData.username}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 label="생일"
//                 name="birthdate"
//                 type="date"
//                 value={saveData.birthdate}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{ max: new Date().toISOString().split("T")[0] }}
//               />
//               {/*주소 정보*/}
//               <Button
//                 variant="outlined"
//                 onClick={() => setIsPostcodeOpen(true)}
//               >
//                 주소 검색
//               </Button>
//               <p>
//                 {saveData.address.zonecode + " " +
//                   saveData.address.roadAddress +
//                   saveData.address.jibunAddress}
//               </p>
//               <TextField
//                 label="상세 주소"
//                 vlaue={saveData.address.detailAddress}
//                 onChange={handleDetailChange}
//                 fullwidh
//                 required
//               />
//               <Button type="submit" variant="contained" fullWidth>
//                 저장
//               </Button>
//               <Typography sx={{ textAlign: "center" }}>
//                 이미 계정이 있으신가요?{" "}
//                 <Link to="/login" variant="body2" sx={{ alignSelf: "center" }}>
//                   Sign in
//                 </Link>
//               </Typography>
//             </Box>
//           </Stack>
//         </CardContent>
//       </Card>
//       {/* 주소 검색 모달 */}
//       <Modal open={isPostcodeOpen} onClose={() => setIsPostcodeOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             boxShadow: 24,
//             p: 2,
//           }}
//         >
//           <DaumPostcode onComplete={handleAddressComplete} />
//         </Box>
//       </Modal>
//     </Box>
//   );
// }

import React, { useState } from "react";
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
      navigate("/email-login", { replace: true });
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다. 다시 확인해주세요.");
    }
  };

  return (
    <SignUpContainer>
      <CssBaseline />
      <Card component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={1.5}>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            회원가입
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
            <Link component={RouterLink} to="/email-login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Card>

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
    </SignUpContainer>
  );
}
