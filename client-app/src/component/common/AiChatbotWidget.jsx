// src/components/ChatbotWidget.jsx
import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatbotPopup from '../common/AiChatbotPopup.jsx';

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <ChatbotPopup open={open} onClose={() => setOpen(false)} />
            <IconButton
                onClick={() => setOpen(o => !o)}
                sx={{
                    position: 'fixed',
                    bottom: 200,
                    right: 50,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    boxShadow: 3,
                    color: 'common.white',
                    zIndex: 1200,        // 팝업보다 낮게
                    pointerEvents: 'auto'
                }}
            >
                <ChatIcon />
            </IconButton>
        </>
    );
}
