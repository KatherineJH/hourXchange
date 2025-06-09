import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import { getDaily, getMonthly, getWeekly, getYearly } from "../../api/paymentLogApi.js";

const initState = [];

export default function PaymentDashboard() {
    const theme = useTheme();
    const [dailyPayments, saveDailyPayments]     = useState(initState);
    const [weeklyPayments, saveWeeklyPayments]   = useState(initState);
    const [monthlyPayments, saveMonthlyPayments] = useState(initState);
    const [yearlyPayments, saveYearlyPayments]   = useState(initState);

    useEffect(() => {
        getDaily()
            .then(({ data }) => saveDailyPayments(data))
            .catch(err => console.error(err));
        getWeekly()
            .then(({ data }) => saveWeeklyPayments(data))
            .catch(err => console.error(err));
        getMonthly()
            .then(({ data }) => saveMonthlyPayments(data))
            .catch(err => console.error(err));
        getYearly()
            .then(({ data }) => saveYearlyPayments(data))
            .catch(err => console.error(err));
    }, []);

    const renderChart = (data, key) => (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
                data={data}
                margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
                {/* 그라데이션 정의 */}
                <defs>
                    <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.4}/>
                        <stop offset="75%" stopColor={theme.palette.primary.main} stopOpacity={0.05}/>
                    </linearGradient>
                </defs>

                {/* 격자 */}
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />

                {/* X/Y 축 스타일 */}
                <XAxis
                    dataKey="period"
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={false}
                />

                {/* 툴팁 스타일 */}
                <Tooltip
                    contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 4,
                        boxShadow: theme.shadows[2]
                    }}
                />

                {/* 선 스타일 */}
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke={theme.palette.primary.dark}
                    strokeWidth={2}
                    dot={{ r: 4, fill: theme.palette.primary.main }}
                    activeDot={{ r: 6 }}
                    fill={`url(#grad-${key})`}
                />
            </LineChart>
        </ResponsiveContainer>
    );

    const configs = [
        { title: '일별 결제 건수', data: dailyPayments, key: 'daily' },
        { title: '주별 결제 건수', data: weeklyPayments, key: 'weekly' },
        { title: '월별 결제 건수', data: monthlyPayments, key: 'monthly' },
        { title: '연별 결제 건수', data: yearlyPayments, key: 'yearly' },
    ];

    return (
        <Box sx={{ mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                결제현황
            </Typography>
            <Box display="flex" flexWrap="wrap" margin={-1}>
                {configs.map(({ title, data, key }, idx) => (
                    <Box key={idx} width="50%" p={1} boxSizing="border-box">
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {title}
                                </Typography>
                                {renderChart(data, key)}
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
