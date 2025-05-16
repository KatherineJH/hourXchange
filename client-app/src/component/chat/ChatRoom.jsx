import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router-dom";
import {
  acceptTransaction,
  fetchChatRoomInfo,
  requestTransaction,
} from "../../api/chatApi";
import api from "../../api/Api.js";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import uploadToCloudinary from "../../assets/uploadToCloudinary.js";
import { useSelector } from "react-redux";

const IMAGE_SIZE = 300;

const ChatRoom = () => {
  const { chatRoomId } = useParams();
  const roomId = Number(chatRoomId);

  const [status, setStatus] = useState("🔌 연결 시도 중...");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);

  const clientRef = useRef(null);
  // 스크롤 컨테이너를 Card에 붙입니다.
  const messageBoxRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  // 방 정보 로드 및 WebSocket 연결
  useEffect(() => {
    if (isNaN(roomId)) {
      setStatus("❌ 잘못된 방 번호");
      return;
    }

    // 1) 방 정보 가져오기
    fetchChatRoomInfo(roomId)
      .then((info) => setRoomInfo(info))
      .catch(() => console.error("채팅방 정보 로드 실패"));

    // 2) JWT 토큰 받아서 STOMP 클라이언트 설정
    api
      .get("/api/auth/token", { withCredentials: true })
      .then((res) => {
        const token = res.data.token;
        const client = new Client({
          brokerURL: `${import.meta.env.VITE_WS_URL}/ws?token=${token}`,
          reconnectDelay: 5000,
          onConnect: () => {
            setStatus("🟢 연결됨");
            client.subscribe(`/topic/room/${roomId}`, (msg) => {
              const body = JSON.parse(msg.body);
              setMessages((prev) => [...prev, body]);
            });
            client.publish({
              destination: "/app/chat.addUser",
              body: JSON.stringify({ chatRoomId: roomId }),
            });
          },
          onStompError: (frame) => {
            console.error(frame);
            setStatus("❌ STOMP 오류");
          },
        });
        client.activate();
        clientRef.current = client;
      })
      .catch((err) => {
        console.error("토큰 가져오기 실패", err);
        setStatus("❌ 토큰 오류");
      });

    return () => {
      clientRef.current?.deactivate();
    };
  }, [roomId]);

  // 메시지 리스트가 바뀔 때마다 스크롤 최하단으로 이동
  useEffect(() => {
    const el = messageBoxRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // 거래 요청/수락 핸들러
  const handleRequestClick = async () => {
    try {
      await requestTransaction(roomId);
      setRoomInfo((r) => ({ ...r, transactionStatus: "REQUESTED" }));
      alert("요청이 완료되었습니다!");
    } catch {
      alert("요청 중 오류가 발생했습니다.");
    }
  };
  const handleAcceptClick = async () => {
    try {
      await acceptTransaction(roomId);
      setRoomInfo((r) => ({ ...r, transactionStatus: "ACCEPTED" }));
      alert("거래가 수락되었습니다!");
    } catch {
      alert("수락 중 오류가 발생했습니다.");
    }
  };

  // 텍스트/이미지 전송
  const sendText = () => {
    if (!input.trim()) return;
    clientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({
        chatRoomId: roomId,
        type: "TEXT",
        content: input,
      }),
    });
    setInput("");
  };
  const sendImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file);
      clientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({
          chatRoomId: roomId,
          type: "IMAGE",
          content: url,
        }),
      });
    } catch {
      alert("이미지 전송에 실패했습니다.");
    }
    e.target.value = null;
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h5">💬 채팅방 #{roomId}</Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {status === "🔌 연결 시도 중..." ? (
          <CircularProgress size={16} />
        ) : (
          status
        )}
      </Typography>

      {/* 거래 버튼 그룹 */}
      <Box sx={{ mb: 2 }}>
        {roomInfo ? (
          <>
            {/* 요청자: 내가 상품 주인이 아닌 경우 */}
            {user.id !== roomInfo.ownerId && (
              <Button
                onClick={handleRequestClick}
                disabled={roomInfo.transactionStatus !== "PENDING"}
              >
                요청
              </Button>
            )}
            {/* 수락자: 내가 상품 주인인 경우 */}
            {user.id === roomInfo.ownerId && (
              <Button
                onClick={handleAcceptClick}
                disabled={roomInfo.transactionStatus !== "REQUESTED"}
              >
                수락
              </Button>
            )}
            {/* 상태 안내 */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              현재 거래 상태: {roomInfo.transactionStatus}
            </Typography>
          </>
        ) : (
          <CircularProgress size={20} />
        )}
      </Box>

      {/* 메시지 리스트 (스크롤 컨테이너에 ref) */}
      <Card
        variant="outlined"
        ref={messageBoxRef}
        sx={{ height: 400, overflowY: "auto", mb: 2 }}
      >
        <CardContent>
          {messages.length === 0 ? (
            <Typography color="text.secondary">메시지가 없습니다.</Typography>
          ) : (
            messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  mb: 1,
                  textAlign: user.id === msg.sender.id ? "right" : "left",
                }}
              >
                {msg.chatMessageType === "IMAGE" ? (
                  <>
                    <Typography>
                      <strong>{msg.sender.name}:</strong>
                    </Typography>
                    <img
                      src={msg.content}
                      alt=""
                      style={{ maxWidth: IMAGE_SIZE }}
                    />
                  </>
                ) : msg.system ? (
                  <Typography color="text.secondary" fontStyle="italic">
                    {msg.content}
                  </Typography>
                ) : (
                  <Typography>
                    <strong>{msg.sender.name}:</strong> {msg.content}
                  </Typography>
                )}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* 입력 영역 */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton component="label">
          <PhotoCamera />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={sendImage}
            ref={fileInputRef}
          />
        </IconButton>
        <TextField
          fullWidth
          size="small"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendText()}
        />
        <Button variant="contained" onClick={sendText}>
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;
