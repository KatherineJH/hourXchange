// src/components/ChatbotPopup.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    IconButton,
    TextField,
    List,
    ListItem,
    Typography,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { sendMessage } from '../../api/aiChatbotApi.js';
import { v4 as uuidv4 } from 'uuid';

const WELCOME_TEXT = `안녕하세요! HourXchange입니다.
시간을 사고팔고, 봉사활동·기부정보를 조회하거나 지역별 거래 게시글을 지도에서 확인할 수 있습니다.
다음과 같은 질문을 해 보실 수 있어요:
1. 삽니다/팝니다 게시글 작성 방법 (예: “게시글은 어떻게 작성해요?”)
2. 채팅 거래 기능 사용법 (예: “채팅으로 거래는 어떻게 하나요?”)
3. 일반 게시물 및 댓글 기능 설명 (예: “댓글은 어떻게 달아요?”)
4. 시간 충전 방법 안내 (예: “시간 충전은 어디서 하나요?”)
5. 봉사활동 정보 조회 방법 (예: “봉사활동 정보는 어디서 보나요?”)
6. 기부 정보 조회 방법 (예: “기부 정보는 어떻게 찾나요?”)
7. 지도에서 거래 게시글 보기 (예: “서울 거래 게시글을 지도에서 볼 수 있나요?”)
궁금하신 번호나 키워드를 입력해 주세요!`;

export default function AiChatbotPopup({ open, onClose }) {
    const [sessionId] = useState(uuidv4());
    const [msg, setMsg] = useState('');
    const [chat, setChat] = useState([]);
    const endRef = useRef();

    // 팝업 열릴 때 한 번만 Welcome 메시지 세팅
    useEffect(() => {
        if (open) {
            setChat([{ text: WELCOME_TEXT, user: 'bot' }]);
        } else {
            setChat([]);  // 팝업 닫힐 때 대화 초기화
        }
    }, [open]);

    const send = async () => {
        if (!msg.trim()) return;
        setChat(c => [...c, { text: msg, user: 'me' }]);
        setMsg('');
        try {
            const { fulfillmentText } = await sendMessage(msg, sessionId);
            setChat(c => [...c, { text: fulfillmentText, user: 'bot' }]);
        } catch {
            setChat(c => [...c, { text: '서버 오류가 발생했습니다.', user: 'bot' }]);
        }
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat]);

    if (!open) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 264,
                right: 50,
                width: 600,
                height: 600,
                zIndex: 1300,
                pointerEvents: 'auto'
            }}
        >
            <Paper elevation={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* 헤더 */}
                <Box sx={{ p:1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">AI Chatbot</Typography>
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Divider />

                {/* 메시지 영역 */}
                <List sx={{ flex:1, overflowY: 'auto', p:1 }}>
                    {chat.map((m, i) => (
                        <ListItem
                            key={i}
                            sx={{
                                display: 'flex',
                                justifyContent: m.user === 'me' ? 'flex-end' : 'flex-start',
                                py: 0.5
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    bgcolor: m.user === 'me' ? 'primary.light' : 'grey.100',
                                    px: 2, py: 1,
                                    borderRadius: 2,
                                    maxWidth: '75%',
                                    whiteSpace: 'pre-line',
                                    wordBreak: 'break-word'
                                }}
                            >
                                <Typography component="span">
                                    {m.text}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                    <div ref={endRef} />
                </List>
                <Divider />

                {/* 입력 영역 */}
                <Box sx={{ p:1, display: 'flex', alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="메시지를 입력하세요..."
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                    />
                    <IconButton color="primary" onClick={send} sx={{ ml:1 }}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
}
