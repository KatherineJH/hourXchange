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
import {getDaily, getMonthly, getWeekly, getYearly} from "../../api/visitLogApi.js";

const initState = {
    period: '',
    count: '',
}

// 방문자 대시보드: 일/주/월/연 단위 접속자 수 그래프 2x2 레이아웃 (샘플 데이터 포함)
export default function Dashboard() {
    // state 초기화
    const [dailyVisitors, saveDailyVisitors]   = useState([]);
    const [weeklyVisitors, saveWeeklyVisitors]  = useState([]);
    const [monthlyVisitors, saveMonthlyVisitors] = useState([]);
    const [yearlyVisitors, saveYearlyVisitors]  = useState([]);

    useEffect(() => {
        getDaily().then(response => {
            console.log(response.data);
            saveDailyVisitors(response.data)
        }).catch(error => {
            console.log(error);
        })

        getWeekly().then(response => {
            console.log(response.data);
            saveWeeklyVisitors(response.data)
        }).catch(error => {
            console.log(error);
        })

        getMonthly().then(response => {
            console.log(response.data);
            saveMonthlyVisitors(response.data)
        }).catch(error => {
            console.log(error);
        })

        getYearly().then(response => {
            console.log(response.data);
            saveYearlyVisitors(response.data)
        }).catch(error => {
            console.log(error);
        })
    }, []);

    const renderVisitorsChart = (data) => (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" />
            </LineChart>
        </ResponsiveContainer>
    );

    const configs = [
        { title: '일별 방문자 수', data: dailyVisitors },
        { title: '주별 방문자 수', data: weeklyVisitors },
        { title: '월별 방문자 수', data: monthlyVisitors },
        { title: '연별 방문자 수', data: yearlyVisitors },
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
                                {renderVisitorsChart(data)}
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
