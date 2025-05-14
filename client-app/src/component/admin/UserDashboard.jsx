import React, {useEffect, useState} from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
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
    const [dailyData, setDailyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [yearlyData, setYearlyData] = useState([]);

    useEffect(() => {
        // helper to merge total & unique
        const merge = (total, unique) => {
            const map = new Map();
            total.forEach(item => {
                map.set(item.period, { period: item.period, total: item.count, unique: 0 });
            });
            unique.forEach(item => {
                if (map.has(item.period)) {
                    map.get(item.period).unique = item.count;
                } else {
                    map.set(item.period, { period: item.period, total: 0, unique: item.count });
                }
            });
            return Array.from(map.values());
        };

        // fetch daily
        Promise.all([getDaily(), getDailyUnique()])
            .then(([{ data: tot }, { data: uniq }]) => setDailyData(merge(tot, uniq)))
            .catch(console.error);
        // weekly
        Promise.all([getWeekly(), getWeeklyUnique()])
            .then(([{ data: tot }, { data: uniq }]) => setWeeklyData(merge(tot, uniq)))
            .catch(console.error);
        // monthly
        Promise.all([getMonthly(), getMonthlyUnique()])
            .then(([{ data: tot }, { data: uniq }]) => setMonthlyData(merge(tot, uniq)))
            .catch(console.error);
        // yearly
        Promise.all([getYearly(), getYearlyUnique()])
            .then(([{ data: tot }, { data: uniq }]) => setYearlyData(merge(tot, uniq)))
            .catch(console.error);
    }, []);

    const renderChart = (data) => (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" />
                <Line type="monotone" dataKey="unique" />
            </LineChart>
        </ResponsiveContainer>
    );

    const configs = [
        { title: '일별 방문(PV) & 고유(UV)', data: dailyData },
        { title: '주별 방문(PV) & 고유(UV)', data: weeklyData },
        { title: '월별 방문(PV) & 고유(UV)', data: monthlyData },
        { title: '연별 방문(PV) & 고유(UV)', data: yearlyData },
    ];

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>
                유저 접속 현황
            </Typography>
            <Box display="flex" flexWrap="wrap" margin={-1}>
                {configs.map(({ title, data }, idx) => (
                    <Box key={idx} width="50%" p={1} boxSizing="border-box">
                        <Card>
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
