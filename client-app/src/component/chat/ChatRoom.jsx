// src/component/chat/ChatRoom.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useParams } from "react-router-dom";
import { matchTransaction, fetchChatRoomInfo } from "../../api/chatApi";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

const ChatRoom = () => {
  const { chatRoomId } = useParams();
  const numericRoomId = Number(chatRoomId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("🔌 연결 시도 중...");
  const clientRef = useRef(null);
  const messageBoxRef = useRef(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id;
  console.log("🔐 로그인한 사용자:", user);

  const handleMatchClick = async () => {
    try {
      const result = await matchTransaction(numericRoomId);
      alert(result || "거래가 완료되었습니다!");
    } catch (error) {
      console.error("거래 성사 실패", error);
      alert("거래 성사 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    async function loadRoomInfo() {
      const info = await fetchChatRoomInfo(numericRoomId);
      console.log("채팅방 정보:", info);
      setRoomInfo(info); // ✅ 이 줄 추가!
    }
    loadRoomInfo();
  }, [numericRoomId]);

  useEffect(() => {
    if (!numericRoomId || isNaN(numericRoomId)) {
      setStatus("❌ 잘못된 채팅방 ID");
      return;
    }
    const connectWebSocket = async () => {
      try {
        const res = await axios.get("http://localhost:8282/api/auth/token", {
          withCredentials: true,
        });
        const token = res.data.token;

        const client = new Client({
          brokerURL: `ws://localhost:8282/ws?token=${token}`,
          reconnectDelay: 5000,
          // debug: (str) => console.log(str),
          onConnect: () => {
            setStatus("🟢 연결됨");
            client.subscribe(`/topic/room/${numericRoomId}`, (message) => {
              const body = JSON.parse(message.body);
              if (body.type === "JOIN" || body.type === "LEAVE") {
                setMessages((prev) => [
                  ...prev,
                  { content: body.content, system: true },
                ]);
              } else if (body.type === "CHAT") {
                setMessages((prev) => [...prev, body]);
              }
            });
            client.publish({
              destination: "/app/chat.addUser",
              body: JSON.stringify({ chatRoomId: numericRoomId }),
            });
          },
          onStompError: (frame) => {
            console.error("❌ STOMP 오류:", frame);
            setStatus("❌ 연결 실패");
          },
        });

        client.activate();
        clientRef.current = client;
      } catch (err) {
        console.error("❌ 인증 실패", err);
        setStatus("❌ 인증 실패");
      }
    };

    connectWebSocket();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        setStatus("⚪ 연결 해제됨");
      }
    };
  }, [numericRoomId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    clientRef.current?.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({
        chatRoomId: numericRoomId,
        content: input,
        type: "CHAT",
      }),
    });
    setInput("");
  };

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box sx={{ mt: 4, maxWidth: "700px", mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        💬 채팅방 #{numericRoomId}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {status === "🔌 연결 시도 중..." ? (
            <CircularProgress size={16} />
          ) : (
            status
          )}
        </Typography>
        {roomInfo ? (
          <Button
            variant="outlined"
            size="medium"
            disabled={
              roomInfo.transactionStatus === "COMPLETED" ||
              currentUserId !== roomInfo.ownerId
            }
            onClick={handleMatchClick}
          >
            {roomInfo.transactionStatus === "COMPLETED"
              ? "거래 성공!"
              : "거래 할까요?"}
          </Button>
        ) : (
          <CircularProgress size={20} />
        )}
      </Box>
      <Card variant="outlined" sx={{ height: 400, overflowY: "auto", mb: 2 }}>
        <CardContent ref={messageBoxRef} sx={{ px: 2 }}>
          {messages.length === 0 ? (
            <Typography color="text.secondary">메시지가 없습니다.</Typography>
          ) : (
            messages.map((msg, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                {msg.system ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontStyle="italic"
                  >
                    {msg.content}
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    <strong>{msg.senderUsername}</strong>: {msg.content}
                  </Typography>
                )}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{ minWidth: "100px" }}
        >
          보내기
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;
