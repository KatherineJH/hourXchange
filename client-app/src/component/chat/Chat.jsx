// src/component/chat/Chat.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import {
    Avatar,
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
    Divider,
    Paper, ListItemButton,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

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
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      {/* 모바일 테두리 프레임 */}
      <Paper
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: 430,
          height: "760px",
          borderRadius: "40px",
          border: "10px solid #333",
          backgroundColor: "#f9f9f9",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 상단 바 */}
        <Box
          sx={{
            height: 40,
            backgroundColor: "#eee",
            borderBottom: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          참여 중인 채팅방
        </Box>

        {/* 채팅 리스트 */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 1, py: 1 }}>
          {chatError && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {chatError}
            </Typography>
          )}

          {chatRooms.length === 0 ? (
            <Typography sx={{ mt: 2, textAlign: "center" }}>
              입장 가능한 채팅방이 없습니다.
            </Typography>
          ) : (
            <List disablePadding>
              {chatRooms.map((room, idx) => (
                <React.Fragment key={room.id}>
                  <ListItemButton
                    onClick={() =>
                      navigate(`${pathPrefix}/chat-room/${room.id}`)
                    }
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      px: 2,
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <ChatBubbleOutlineIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {room.name}
                        </Typography>
                      }
                      secondary={`상품 ID: ${room.productId}`}
                    />
                  </ListItemButton>
                  {idx < chatRooms.length - 1 && <Divider />}{" "}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default Chat;
