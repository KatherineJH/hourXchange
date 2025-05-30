import React, {useEffect, useState} from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {getDaily, getMonthly, getWeekly, getYearly} from "../../api/paymentLogApi.js";

const initState = [];

export default function PaymentDashboard() {
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

    const renderChart = (data) => (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
                data={data}
                margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                {/* ← dataKey를 서버 응답 필드명인 count로 변경 */}
                <Line type="monotone" dataKey="count" />
            </LineChart>
        </ResponsiveContainer>
    );

    const configs = [
        { title: '일별 결제 건수', data: dailyPayments },
        { title: '주별 결제 건수', data: weeklyPayments },
        { title: '월별 결제 건수', data: monthlyPayments },
        { title: '연별 결제 건수', data: yearlyPayments },
    ];

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>
                결제현황
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
