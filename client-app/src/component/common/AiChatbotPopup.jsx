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

export default function AiChatbotPopup({ open, onClose }) {
    const [sessionId] = useState(uuidv4());
    const [msg, setMsg] = useState('');
    const [chat, setChat] = useState([]);
    const endRef = useRef();

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
                bottom: 88,
                right: 24,
                width: 600,
                height: 500,
                zIndex: 1300,
                pointerEvents: 'auto'
            }}
        >
            <Paper elevation={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Header */}
                <Box sx={{ p:1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">AI Chatbot</Typography>
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Divider />

                {/* Chat messages */}
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
                                    px:2, py:1,
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

                {/* Input area */}
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
