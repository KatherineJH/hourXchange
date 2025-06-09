import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    getDailyAmount,
    getWeeklyAmount,
    getMonthlyAmount,
    getYearlyAmount,
    getItemRatio
} from '../../api/paymentLogApi.js';

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#A28FFF', '#FF6699', '#33CC33', '#FF3333',
    '#3366FF', '#FF9933'
];

export default function PaymentAmountDashboard() {
    const theme = useTheme();
    const [dailyAmounts, setDailyAmounts]     = useState([]);
    const [weeklyAmounts, setWeeklyAmounts]   = useState([]);
    const [monthlyAmounts, setMonthlyAmounts] = useState([]);
    const [yearlyAmounts, setYearlyAmounts]   = useState([]);
    const [itemRatios, setItemRatios]         = useState([]);

    useEffect(() => {
        getDailyAmount().then(({ data }) => setDailyAmounts(data)).catch(console.error);
        getWeeklyAmount().then(({ data }) => setWeeklyAmounts(data)).catch(console.error);
        getMonthlyAmount().then(({ data }) => setMonthlyAmounts(data)).catch(console.error);
        getYearlyAmount().then(({ data }) => setYearlyAmounts(data)).catch(console.error);
        getItemRatio().then(({ data }) => setItemRatios(data)).catch(console.error);
    }, []);

    const renderBarChart = (data) => (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                {/* 그라데이션 정의 */}
                <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity={0.2}/>
                    </linearGradient>
                </defs>

                {/* 배경 격자 */}
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.palette.divider}
                    opacity={0.3}
                />

                {/* 축 스타일 */}
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
                <ReTooltip
                    contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[2],
                        borderRadius: 4
                    }}
                    formatter={val => val.toLocaleString()}
                />

                {/* 바 스타일 */}
                <Bar
                    dataKey="count"
                    fill="url(#barGrad)"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );

    const renderPieChart = (data) => (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="count"
                    nameKey="itemName"
                    cx="50%" cy="45%"
                    innerRadius={60} outerRadius={100}
                    paddingAngle={4}
                    label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                >
                    {data.map((_, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>

                {/* 범례 및 툴팁 */}
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12 }}
                />
                <ReTooltip
                    contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[2],
                        borderRadius: 4
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );

    const barConfigs = [
        { title: '일별 결제 금액', data: dailyAmounts },
        { title: '주별 결제 금액', data: weeklyAmounts },
        { title: '월별 결제 금액', data: monthlyAmounts },
        { title: '연별 결제 금액', data: yearlyAmounts },
    ];

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>
                결제금액현황
            </Typography>
            <Box display="flex" flexWrap="wrap" margin={-1}>
                {barConfigs.map(({ title, data }, idx) => (
                    <Box key={idx} width="50%" p={1} boxSizing="border-box">
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {title}
                                </Typography>
                                {renderBarChart(data)}
                            </CardContent>
                        </Card>
                    </Box>
                ))}
                <Box width="100%" p={1} boxSizing="border-box">
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                아이템별 결제 비율
                            </Typography>
                            {renderPieChart(itemRatios)}
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
