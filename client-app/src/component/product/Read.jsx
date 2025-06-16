import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRead, putDelete } from "../../api/productApi.js";
import { postSave } from "../../api/transactionApi.js";
import { initiateChat } from "../../api/chatApi";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Modal,
  Paper,
} from "@mui/material";

import KakaoReadMap from "../common/KakaoReadMap.jsx";

const IMAGE_SIZE = 300;
const initState = {
  id: "",
  title: "",
  description: "",
  hours: "",
  startedAt: "",
  endAt: "",
  owner: {},
  category: {},
  providerType: "",
  images: [],
  lat: "",
  lng: "",
};

function Read() {
  const [serverData, setServerData] = useState(initState);
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);

  const location = useLocation();
  const pathPrefix = location.pathname.startsWith("/admin")
    ? "/admin"
    : location.pathname.startsWith("/myPage")
      ? "/myPage"
      : "";

  useEffect(() => {
    getRead(id)
      .then((response) => {
        setServerData(response.data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  // const handleChatClick = async () => {
  //   console.log(auth.user.email);
  //   if (!auth.user.email) {
  //     if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
  //       // state.from에 현재 위치를 담아서 로그인 후 복귀하도록 전달
  //       navigate("/login", {
  //         state: { from: location },
  //         replace: true,
  //       });
  //     }
  //     return;
  //   }
  //   try {
  //     const chatRoom = await initiateChat(serverData.id, auth.user.id);
  //     const transactionData = { productId: serverData.id, status: "PENDING" };
  //     await postSave(transactionData);
  //     navigate(`${pathPrefix}/chat-room/${chatRoom.id}`);
  //   } catch (error) {
  //     console.error("채팅방 생성 실패", error);
  //   }
  // };

  const handleChatClick = async () => {
    console.log(auth.user.email);
    if (!auth.user.email) {
      setOpenModal(true);
      return;
    }
    try {
      const chatRoom = await initiateChat(serverData.id, auth.user.id);
      const transactionData = { productId: serverData.id, status: "PENDING" };
      await postSave(transactionData);
      navigate(`${pathPrefix}/chat-room/${chatRoom.id}`);
    } catch (error) {
      console.error("채팅방 생성 실패", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await putDelete(id);
      console.log(response);
      alert("삭제가 완료 되었습니다.");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: "700px", mx: "auto" }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📄 서비스 상세 정보
          </Typography>

          {/* Title & Description */}
          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
              mb: 3,
            }}
          >
            <Typography variant="h6">제목</Typography>
            <Typography variant="body1" gutterBottom>
              {serverData.title || "-"}
            </Typography>
            <Typography variant="h6">설명</Typography>
            <Typography variant="body1">
              {serverData.description || "-"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 이미지 썸네일 */}
          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              이미지
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {serverData.images?.map((url, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={url}
                  alt={`preview-${idx}`}
                  sx={{
                    width: IMAGE_SIZE,
                    height: IMAGE_SIZE,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.1)",
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* 시간 정보 */}
          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  시작 시간
                </Typography>
                <Typography variant="body1">
                  {serverData.startedAt || "-"}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  종료 시간
                </Typography>
                <Typography variant="body1">
                  {serverData.endAt || "-"}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  시간(비용)
                </Typography>
                <Typography variant="body1">
                  {serverData.hours ? `${serverData.hours} 시간` : "-"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  카테고리
                </Typography>
                <Typography variant="body1">
                  {serverData.category?.categoryName || "-"}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  타입
                </Typography>
                <Typography variant="body1">
                  {serverData.providerType === "BUYER"
                    ? "구매"
                    : serverData.providerType === "SELLER"
                      ? "판매"
                      : "-"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 태그 정보 */}
          {serverData.tags && serverData.tags.length > 0 && (
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                p: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                태그
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {serverData.tags.map((tag, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: "secondary.main",
                      fontSize: "14px",
                    }}
                  >
                    #{tag}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* 지도 */}
          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              위치
            </Typography>
            <KakaoReadMap
              serverData={serverData}
              setSaveData={() => {}}
              viewOnly
            />
          </Box>

          {/* 버튼 영역 */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            {auth.user?.id === serverData.owner.id ? (
              <>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() =>
                    navigate(`${pathPrefix}/product/modify/${serverData.id}`)
                  }
                >
                  수정하기
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleDeleteClick(serverData.id)}
                >
                  삭제하기
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleChatClick}
              >
                문의하기
              </Button>
            )}
          </Box>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Paper
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 350,
                p: 3,
                outline: "none",
              }}
            >
              <Typography variant="h6" gutterBotton>
                로그인이 필요합니다.
              </Typography>
              <Typography variant="body2" mb={3} sx={{ pt: 2 }}>
                채팅을 이용하려면 로그인을 해주세요.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenModal(false);
                    navigate("/login");
                  }}
                >
                  로그인 하러 가기
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenModal(false);
                    navigate("/save");
                  }}
                >
                  회원가입 하러 가기
                </Button>
              </Box>
            </Paper>
          </Modal>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Read;
