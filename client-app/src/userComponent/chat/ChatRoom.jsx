import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useParams } from "react-router-dom";

const ChatRoom = () => {
  const { chatRoomId } = useParams();
  console.log("💬 useParams:", chatRoomId);
  const numericRoomId = Number(chatRoomId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("🔌 연결 시도 중...");
  const clientRef = useRef(null);
  const messageBoxRef = useRef(null);

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
        console.log("🪪 JWT 토큰:", token);

        const client = new Client({
          brokerURL: `ws://localhost:8282/ws?token=${token}`,
          reconnectDelay: 5000,
          debug: (str) => console.log(str),
          onConnect: () => {
            console.log("✅ STOMP 연결 성공");
            setStatus("🟢 연결됨");

            // ✅ 채팅방 구독
            client.subscribe(`/topic/room/${numericRoomId}`, (message) => {
              const body = JSON.parse(message.body);
              if (body.type === "JOIN") {
                setMessages((prev) => [
                  ...prev,
                  { content: `🟢 ${body.content}`, system: true },
                ]);
              } else if (body.type === "LEAVE") {
                setMessages((prev) => [
                  ...prev,
                  { content: `🔴 ${body.content}`, system: true },
                ]);
              } else if (body.type === "CHAT") {
                setMessages((prev) => [...prev, body]);
              }
            });

            // ✅ 입장 메시지 전송
            const enterPayload = { chatRoomId: numericRoomId };
            console.log("🚪 입장 메시지 전송:", enterPayload);
            client.publish({
              destination: "/app/chat.addUser",
              body: JSON.stringify(enterPayload),
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

    console.log("📤 메시지 전송 시도:", input);
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
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h2>채팅방 #{numericRoomId}</h2>
      <p style={{ fontStyle: "italic" }}>{status}</p>

      <div
        ref={messageBoxRef}
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "1rem",
          height: "300px",
          overflowY: "auto",
          marginBottom: "1rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "5px 0" }}>
            {msg.system ? (
              <div style={{ fontStyle: "italic", color: "#888" }}>
                {msg.content}
              </div>
            ) : (
              <div>
                <b>{msg.senderUsername}</b>: {msg.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, marginRight: "1rem", padding: "0.5rem" }}
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          보내기
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
