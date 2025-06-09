// src/components/TopDonatorsChart.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    CircularProgress,
    Paper,
    useTheme
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { getTopDonators } from '../../api/donationHistoryApi.js';

export default function TopDonatorsChart() {
    const theme = useTheme();
    const [weekly, setWeekly]   = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [yearly, setYearly]   = useState(null);
    const [loading, setLoading] = useState(true);

    const reorder = (data) => {
        if (!data || data.length < 2) return data;
        const arr = [...data];
        [arr[0], arr[1]] = [arr[1], arr[0]];
        return arr;
    };

    useEffect(() => {
        async function loadAll() {
            try {
                setLoading(true);
                const [w, m, y] = await Promise.all([
                    getTopDonators('weekly'),
                    getTopDonators('monthly'),
                    getTopDonators('yearly')
                ]);
                setWeekly(w.data);
                setMonthly(m.data);
                setYearly(y.data);
            } finally {
                setLoading(false);
            }
        }
        loadAll();
    }, []);

    const renderChart = (data, title) => (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                flex: '1 1 300px',
                minWidth: 300,
                backgroundColor: theme.palette.background.paper
            }}
        >
            <Typography variant="subtitle1" gutterBottom align="center">
                {title}
            </Typography>

            {data && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={reorder(data)}
                        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                    >
                        {/* 그라데이션 정의 */}
                        <defs>
                            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="0%"
                                    stopColor={theme.palette.primary.main}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={theme.palette.primary.main}
                                    stopOpacity={0.2}
                                />
                            </linearGradient>
                        </defs>

                        {/* 배경 격자 */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.palette.divider}
                            opacity={0.2}
                        />

                        {/* X축 */}
                        <XAxis
                            dataKey="user.name"
                            tick={{
                                fill: theme.palette.text.secondary,
                                fontSize: 12
                            }}
                            axisLine={{ stroke: theme.palette.divider }}
                            tickLine={false}
                        />

                        {/* Y축 */}
                        <YAxis
                            tick={{
                                fill: theme.palette.text.secondary,
                                fontSize: 12
                            }}
                            axisLine={{ stroke: theme.palette.divider }}
                            tickLine={false}
                        />

                        {/* 툴팁 */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: theme.shadows[2],
                                borderRadius: 4
                            }}
                            formatter={(value) =>
                                `${value.toLocaleString()}시간`
                            }
                        />

                        {/* Bar */}
                        <Bar
                            dataKey="totalDonationTime"
                            fill={`url(#grad-${title})`}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <Typography variant="body2" align="center">
                    데이터 없음
                </Typography>
            )}
        </Paper>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', py: 4, px: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>
                최근 기부 톱3
            </Typography>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                justifyContent="center"
                alignItems="stretch"
            >
                {renderChart(weekly, '주간')}
                {renderChart(monthly, '월간')}
                {renderChart(yearly, '연간')}
            </Stack>
        </Box>
    );
}
