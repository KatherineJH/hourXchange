import React, { useState } from 'react';
import {
    Box,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    CircularProgress,
    Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function AiChat() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMsg: ChatMessage = { role: 'user', content: trimmed };
        setHistory(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(
                import.meta.env.VITE_API_BASE_URL!,
                { message: trimmed, history }
        );
            const botMsg: ChatMessage = { role: 'assistant', content: response.data.reply };
            setHistory(prev => [...prev, botMsg]);
        } catch (err) {
            console.error(err);
            // TODO: 에러 처리 UI 추가
            setHistory(prev => [
                ...prev,
                { role: 'assistant', content: '오류가 발생했습니다. 다시 시도해주세요.' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                {history.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                        대화를 시작해보세요.
                    </Typography>
                ) : (
                    <List>
                        {history.map((m, i) => (
                            <ListItem
                                key={i}
                                sx={{ justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: m.role === 'user' ? 'primary.main' : 'grey.300',
                                        color: m.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                        borderRadius: 2,
                                        p: 1,
                                        maxWidth: '80%'
                                    }}
                                >
                                    <ListItemText primary={m.content} />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="메시지를 입력하세요..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    disabled={loading}
                />
                <IconButton
                    color="primary"
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    sx={{ ml: 1 }}
                >
                    {loading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
            </Box>
        </Paper>
    );
}
