import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFoundPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container
            maxWidth="md"
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                px: 2,
            }}
        >
            <Box
                sx={{
                    fontSize: isMobile ? 80 : 120,
                    color: theme.palette.error.main,
                    lineHeight: 1,
                }}
            >
                <ErrorOutlineIcon fontSize="inherit" />
                404
            </Box>

            <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
                페이지를 찾을 수 없습니다
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                요청하신 페이지가 삭제되었거나, 사용 권한이 없거나, 주소를 잘못 입력하셨습니다.
            </Typography>

            <Button
                component={RouterLink}
                to="/"
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
            >
                홈으로 돌아가기
            </Button>
        </Container>
    );
}
