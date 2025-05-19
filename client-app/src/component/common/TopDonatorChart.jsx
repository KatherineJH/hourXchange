// src/components/TopDonatorsChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Stack,
    CircularProgress,
    Paper
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
import { getTopDonators } from "../../api/donationHistoryApi.js";

export default function TopDonatorsChart() {
    const [weekly, setWeekly] = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [yearly, setYearly] = useState(null);
    const [loading, setLoading] = useState(true);

    // 순서 재정렬: 2등, 1등, 3등 이상
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
            } catch (e) {
                console.error('Failed to load top donators', e);
            } finally {
                setLoading(false);
            }
        }
        loadAll();
    }, []);

    const renderChart = (data, title) => (
        <Paper elevation={2} sx={{ p: 2, flex: '1 1 300px', minWidth: 300 }}>
            <Typography variant="subtitle1" gutterBottom align="center">
                {title}
            </Typography>
            {data && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={reorder(data)}
                        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="user.name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalDonationTime" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <Typography variant="body2" align="center">데이터 없음</Typography>
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
