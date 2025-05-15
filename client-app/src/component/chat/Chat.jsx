// src/component/chat/Chat.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
} from "@mui/material";

function Chat({ chatRooms, chatError, navigate }) {
  const location = useLocation();
  const pathPrefix = location.pathname.startsWith("/admin")
    ? "/admin"
    : location.pathname.startsWith("/myPage")
      ? "/myPage"
      : "";

  if (!chatRooms) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, maxWidth: "600px", mx: "auto" }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📋 참여 중인 채팅방
          </Typography>

          {chatError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {chatError}
            </Typography>
          )}

          {chatRooms.length === 0 ? (
            <Typography sx={{ mt: 2 }}>
              입장 가능한 채팅방이 없습니다.
            </Typography>
          ) : (
            chatRooms.map((room) => (
              <Card key={room.id} sx={{ mb: 2, borderRadius: 2 }}>
                <CardActionArea
                  onClick={() => navigate(`${pathPrefix}/chat-room/${room.id}`)}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      🗨️ {room.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      상품 ID: {room.productId}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Chat;
