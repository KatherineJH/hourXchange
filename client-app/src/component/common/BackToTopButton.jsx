// src/components/BackToTopButton.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/**
 * 스크롤 트리거 훅: 페이지가 조금이라도 스크롤되면 true 반환
 */
function ScrollTriggerWrapper({ children }) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,      // 스크롤이 0px 초과일 때 바로 show
    });

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Zoom in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{
                    position: 'fixed',
                    bottom: 200,
                    right: 50,
                    zIndex: theme => theme.zIndex.tooltip + 1,
                }}
            >
                {children}
            </Box>
        </Zoom>
    );
}
ScrollTriggerWrapper.propTypes = {
    children: PropTypes.element.isRequired,
};

/**
 * 백투탑 버튼 컴포넌트
 */
export default function BackToTopButton() {
    return (
        <ScrollTriggerWrapper>
            <Tooltip title="맨 위로" arrow placement="left" slotProps={{
                tooltip: {
                    sx: {
                        fontSize: '1.25rem',    // 폰트 크기 (예: 20px)
                        px: 1.5,                // 좌우 패딩
                        py: 0.75,               // 상하 패딩
                        borderRadius: 1,        // 모서리 둥글기 (theme.spacing 단위)
                    },
                },
            }}>
                <Fab color="primary" size="large" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </Tooltip>
        </ScrollTriggerWrapper>
    );
}
