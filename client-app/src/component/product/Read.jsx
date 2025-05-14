//src/component/product/Read.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRead } from "../../api/productApi.js";
import { postSave } from "../../api/transactionApi.js";
import { initiateChat } from "../../api/chatApi";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import GoogleReadMap from "../common/GoogleReadMap.jsx";
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
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleChatClick = async () => {
    try {
      const chatRoom = await initiateChat(serverData.id, auth.user.id);
      const transactionData = { productId: serverData.id, status: "PENDING" };
      await postSave(transactionData);
      navigate(`${pathPrefix}/chat-room/${chatRoom.id}`);
    } catch (error) {
      console.error("채팅방 생성 실패", error);
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: "700px", mx: "auto" }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📄 서비스 상세 정보
          </Typography>

          {/* Divider */}
          <Divider sx={{ my: 3 }} />

          {/* 이미지 썸네일 */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
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

          {/* 시작 시간, 종료 시간, 시간(비용) */}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
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
              <Typography variant="body1">{serverData.endAt || "-"}</Typography>
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

          {/* 카테고리, 타입 */}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
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

          {/* 지도 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              위치
            </Typography>
            {/*<GoogleReadMap*/}
            {/*  serverData={serverData}*/}
            {/*  setSaveData={() => {}}*/}
            {/*  viewOnly*/}
            {/*/>*/}
            <KakaoReadMap
                serverData={serverData}
                setSaveData={() => {}}
                viewOnly
            />
          </Box>

          {/* 버튼 영역 */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="contained" size="large" onClick={handleChatClick}>
              채팅하기
            </Button>

            {auth.user?.id === serverData.owner.id && (
              <Button
                variant="outlined"
                size="large"
                onClick={() =>
                  navigate(`${pathPrefix}/product/modify/${serverData.id}`)
                }
              >
                수정하기
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Read;
