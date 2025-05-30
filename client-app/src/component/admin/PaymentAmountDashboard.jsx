import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    getDailyAmount,
    getWeeklyAmount,
    getMonthlyAmount,
    getYearlyAmount,
    getItemRatio
} from '../../api/paymentLogApi.js';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FFF', '#FF6699', '#33CC33', '#FF3333', '#3366FF', '#FF9933'];

export default function PaymentAmountDashboard() {
    const [dailyAmounts, setDailyAmounts] = useState([]);
    const [weeklyAmounts, setWeeklyAmounts] = useState([]);
    const [monthlyAmounts, setMonthlyAmounts] = useState([]);
    const [yearlyAmounts, setYearlyAmounts] = useState([]);
    const [itemRatios, setItemRatios]       = useState([]);

    useEffect(() => {
        getDailyAmount()
            .then(({ data }) => setDailyAmounts(data))
            .catch(err => console.error(err));

        getWeeklyAmount()
            .then(({ data }) => setWeeklyAmounts(data))
            .catch(err => console.error(err));

        getMonthlyAmount()
            .then(({ data }) => setMonthlyAmounts(data))
            .catch(err => console.error(err));

        getYearlyAmount()
            .then(({ data }) => setYearlyAmounts(data))
            .catch(err => console.error(err));

        getItemRatio()
            .then(({ data }) => setItemRatios(data))
            .catch(err => console.error(err));
    }, []);

    const renderBarChart = (data) => (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <XAxis dataKey="period" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );

    const renderPieChart = (data) => (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="count"
                    nameKey="itemName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <ReTooltip />
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
                        <Card>
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
                    <Card>
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
