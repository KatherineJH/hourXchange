// src/components/DonationCardList.jsx
import React from 'react';
import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
    LinearProgress
} from '@mui/material';

export default function DonationCardList({ serverDataList, navigate, pathname }) {
    const readPath = pathname.startsWith('/admin')
        ? '/admin/donation/read/'
        : '/donation/read/';

    if (!serverDataList || serverDataList.length === 0) {
        return (
            <Typography align="center" sx={{ mt: 4 }}>
                조회 결과가 없습니다.
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gap: 2,
                // minmax(300px, 1fr) 로 '최소 300px, 최대 1fr' 너비를 자동으로 칸을 채워줍니다.
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                mt: 2,
            }}
        >
            {serverDataList.map(item => {
                const progress = Math.min(
                    (item.currentAmount / item.targetAmount) * 100,
                    100
                );
                return (
                    <Card
                        key={item.id}
                        onClick={() => navigate(`${readPath}${item.id}`)}
                        sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                    >
                        <CardMedia
                            component="img"
                            image={item.images?.[0] ?? '/default.png'}
                            alt={item.title}
                            sx={{ height: 160, objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 2, flexGrow: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                {item.status}
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                    mb: 1
                                }}
                            >
                                {item.title}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {`${item.currentAmount} / ${item.targetAmount} 시간`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`${item.startDate} ~ ${item.endDate}`}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ height: 6, borderRadius: 3 }}
                            />
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
}
