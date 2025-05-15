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
  useEffect(() => {
    (async () => {
      const info = await fetchChatRoomInfo(roomId);
      setRoomInfo(info);
    })();
  }, [roomId]);

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
