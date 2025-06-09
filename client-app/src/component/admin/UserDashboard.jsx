import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';
import {
    getDaily,
    getDailyUnique,
    getWeekly,
    getWeeklyUnique,
    getMonthly,
    getMonthlyUnique,
    getYearly,
    getYearlyUnique
} from '../../api/visitLogApi.js';

// 방문자 대시보드: 요청 횟수(PV)와 고유 방문자 수(UV) 함께 표시
export default function Dashboard() {
    const theme = useTheme();
    const [dailyData,   setDailyData]   = useState([]);
    const [weeklyData,  setWeeklyData]  = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [yearlyData,  setYearlyData]  = useState([]);

    useEffect(() => {
        const merge = (total, unique) => {
            const map = new Map();
            total.forEach(item => map.set(item.period, { period: item.period, total: item.count, unique: 0 }));
            unique.forEach(item => {
                if (map.has(item.period)) map.get(item.period).unique = item.count;
                else map.set(item.period, { period: item.period, total: 0, unique: item.count });
            });
            return Array.from(map.values());
        };

        Promise.all([getDaily(), getDailyUnique()])
            .then(([{ data: tot }, { data: uniq }]) => setDailyData(merge(tot, uniq)))
            .catch(console.error);
        Promise.all([getWeekly(), getWeeklyUnique()])
            .then(([{ data: tot }, { data: uniq }]) => setWeeklyData(merge(tot, uniq)))
            .catch(console.error);
        Promise.all([getMonthly(), getMonthlyUnique()])
            .then(([{ data: tot }, { data: uniq }]) => setMonthlyData(merge(tot, uniq)))
            .catch(console.error);
        Promise.all([getYearly(), getYearlyUnique()])
            .then(([{ data: tot }, { data: uniq }]) => setYearlyData(merge(tot, uniq)))
            .catch(console.error);
    }, []);

    const renderChart = (data) => (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                {/* 배경 격자 */}
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.25} />

                {/* X축, Y축 스타일 */}
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
                        boxShadow: theme.shadows[2],
                        borderRadius: 4
                    }}
                />

                {/* PV 선 */}
                <Line
                    type="monotone"
                    dataKey="total"
                    name="PV"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 4, fill: theme.palette.primary.main }}
                    activeDot={{ r: 6 }}
                />

                {/* UV 선 */}
                <Line
                    type="monotone"
                    dataKey="unique"
                    name="UV"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: theme.palette.secondary.main }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );

    const configs = [
        { title: '일별 서버 요청 추이 (PV/UV)', data: dailyData },
        { title: '주별 서버 요청 추이 (PV/UV)', data: weeklyData },
        { title: '월별 서버 요청 추이 (PV/UV)', data: monthlyData },
        { title: '연별 서버 요청 추이 (PV/UV)', data: yearlyData },
    ];

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>
                서버요청현황
            </Typography>
            <Box display="flex" flexWrap="wrap" margin={-1}>
                {configs.map(({ title, data }, idx) => (
                    <Box key={idx} width="50%" p={1} boxSizing="border-box">
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {title}
                                </Typography>
                                {renderChart(data)}
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
