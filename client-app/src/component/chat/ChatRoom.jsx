import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useParams} from "react-router-dom";
import { fetchChatRoomInfo } from "../../api/chatApi";
import api from "../../api/Api.js";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import uploadToCloudinary from "../../assets/uploadToCloudinary.js";
import {useSelector} from "react-redux";  // Cloudinary helper

const IMAGE_SIZE = 300;

const ChatRoom = () => {
  const { chatRoomId } = useParams();
  const roomId = Number(chatRoomId);

  const [status, setStatus] = useState("🔌 연결 시도 중...");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);

  const clientRef = useRef(null);
  const messageBoxRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  // Load room info
  const handleMatchClick = async () => {
    try {
      const result = await matchTransaction(numericRoomId);
      alert(result || "거래가 완료되었습니다!");
    } catch (error) {
      console.error("거래 성사 실패", error);
      alert("거래 성사 중 오류가 발생했습니다.");
    }
  };

  // 요청 버튼 클릭
  const handleRequestClick = async () => {
    try {
      const result = await api.patch(`/api/chat/request/${numericRoomId}`);
      setRoomInfo({ ...roomInfo, transactionStatus: "REQUESTED" });
      alert("요청이 완료되었습니다!");
    } catch (error) {
      console.error("요청 실패", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  // 수락 버튼 클릭
  const handleAcceptClick = async () => {
    try {
      const result = await api.patch(`/api/chat/accept/${numericRoomId}`);
      setRoomInfo({ ...roomInfo, transactionStatus: "ACCEPTED" });
      alert("거래가 수락되었습니다!");
    } catch (error) {
      console.error("수락 실패", error);
      alert("수락 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    (async () => {
      const info = await fetchChatRoomInfo(roomId);
      setRoomInfo(info);
    })();
  }, [roomId]);
    async function loadRoomInfo() {
      // console.log("📌 loadRoomInfo() 진입:", numericRoomId);
      try {
        const info = await fetchChatRoomInfo(numericRoomId);
        // console.log("🐛 채팅방 정보 응답:", info);
        setRoomInfo(info);
      } catch (error) {
        // console.error("❌ 채팅방 정보 가져오기 실패:", error);
      }
    }

    loadRoomInfo();
  }, [numericRoomId]);

  // WebSocket connect
  useEffect(() => {
    if (isNaN(roomId)) {
      setStatus("❌ 잘못된 방 번호");
      return;
    }
    const connect = async () => {
      const res = await api.get('/api/auth/token', { withCredentials: true });
      const token = res.data.token;
      const client = new Client({
        brokerURL: `${import.meta.env.VITE_WS_URL}/ws?token=${token}`,
        reconnectDelay: 5000,
        onConnect: () => {
          setStatus("🟢 연결됨");
          client.subscribe(`/topic/room/${roomId}`, msg => {
            const body = JSON.parse(msg.body);
            console.log(msg)
            console.log(msg.body);
            setMessages(prev => [...prev, body]);
          });
          client.publish({ destination: "/app/chat.addUser", body: JSON.stringify({ chatRoomId: roomId }) });
        },
        onStompError: frame => {
          console.error(frame);
          setStatus("❌ STOMP 오류");
        }
      });
      client.activate();
      clientRef.current = client;
    };
    connect();
    return () => clientRef.current?.deactivate();
  }, [roomId]);

  // Scroll messages
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Send text
  const sendText = () => {
    if (!input.trim()) return;
    clientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({ chatRoomId: roomId, type: "TEXT", content: input })
    });
    setInput("");
  };

  // Send image
  const sendImage = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file);
      clientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({ chatRoomId: roomId, type: "IMAGE", content: url })
      });
    } catch (err) {
      console.error("이미지 업로드 중 오류", err);
      alert("이미지 전송에 실패했습니다.");
    }
    e.target.value = null;
  };

  return (
      <Box sx={{ mt: 4, maxWidth: '700px', mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>💬 채팅방 #{roomId}</Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {status}
    <Box sx={{ mt: 4, maxWidth: "700px", mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        💬 채팅방 #{numericRoomId}
      </Typography>
      {/* <Box
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

        <Box ref={messageBoxRef} sx={{ height: 400, overflowY: 'auto', border: 1, borderColor: 'divider', p: 2, mb: 2 }}>
          {messages.map((msg, i) => (
              <Box key={i} sx={{mb: 1, textAlign: user.id == msg.sender.id ? 'right' : 'left'}}>
                {msg.chatMessageType === 'IMAGE' ?
                    <>
                      <Typography><strong>{msg.sender.name}:</strong></Typography>
                      <img src={msg.content} alt="img" style={{ maxWidth: IMAGE_SIZE, borderRadius: 4 }} />
                    </> : (
                    <Typography><strong>{msg.sender.name}:</strong> {msg.content}</Typography>
                )}
              </Box>
          ))}
        </Box>
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
      </Box> */}
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
          <>
            {/* 요청 버튼: 요청자이고 PENDING 상태일 때 */}
            {currentUserId !== roomInfo.ownerId &&
              roomInfo.transactionStatus === "PENDING" && (
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handleRequestClick}
                >
                  요청
                </Button>
              )}
            {/* 수락 버튼: 상품 소유자이고 REQUESTED 상태일 때 */}
            {currentUserId === roomInfo.ownerId &&
              roomInfo.transactionStatus === "REQUESTED" && (
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={handleAcceptClick}
                >
                  수락
                </Button>
              )}
            {/* 거래 완료 상태 */}
            {roomInfo.transactionStatus === "ACCEPTED" && (
              <Typography variant="subtitle2" color="text.secondary">
                거래 수락됨 (마이페이지에서 완료 처리)
              </Typography>
            )}
          </>
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

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {/* Photo button */}
          <IconButton color="primary" component="label" sx={{ p: 1 }}>
            <PhotoCamera sx={{ width: 24, height: 24 }} />
            <input type="file" hidden accept="image/*" onChange={sendImage} ref={fileInputRef} />
          </IconButton>
          {/* Text input */}
          <TextField
              fullWidth size="small" variant="outlined"
              placeholder="메시지를 입력하세요" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendText()}
          />
          <Button variant="contained" onClick={sendText} sx={{ minWidth: 100 }}>
            <SendIcon />
          </Button>
        </Box>
      </Box>
  );
};

export default ChatRoom;
