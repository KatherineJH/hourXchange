// src/components/VolunteerList.jsx
import React, { useState } from 'react';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    TextField,
    Stack,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography
} from "@mui/material";
import { getList } from "../../api/volunteerApi.js";
import CustomHeader from "../common/CustomHeader.jsx";

const areaOptions = [
    { name: '서울', code: '0101' },
    { name: '부산', code: '0102' },
    { name: '대구', code: '0103' },
    { name: '인천', code: '0104' },
    { name: '광주', code: '0105' },
    { name: '대전', code: '0106' },
    { name: '울산', code: '0107' },
    { name: '세종', code: '0117' },
    { name: '경기', code: '0108' },
    { name: '강원', code: '0109' },
    { name: '충북', code: '0110' },
    { name: '충남', code: '0111' },
    { name: '전북', code: '0112' },
    { name: '전남', code: '0113' },
    { name: '경북', code: '0114' },
    { name: '경남', code: '0115' },
    { name: '제주', code: '0116' }
];

const today = new Date();
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
const formatDate = date => date.toISOString().split('T')[0];

const initState = {
    serviceKey: import.meta.env.VITE_OPENAPI_KEY,
    numOfRows: 10,
    pageNo: 1,
    areaCode: '0101',
    TermType: 2,
    strDate: formatDate(oneMonthAgo),
    endDate: formatDate(today),
};

export default function VolunteerList() {
    const [options, setOptions] = useState(initState);
    const [serverData, setServerData] = useState([]);

    const fetchData = async opts => {
        try {
            const res = await getList(opts);
            const parser = new DOMParser();
            const xml = parser.parseFromString(res.data, 'application/xml');
            const items = Array.from(xml.getElementsByTagName('item')).map(node => ({
                seq:        node.getElementsByTagName('seq')[0]?.textContent,
                title:      node.getElementsByTagName('title')[0]?.textContent,
                centName:   node.getElementsByTagName('centName')[0]?.textContent,
                areaName:   node.getElementsByTagName('areaName')[0]?.textContent,
                regDate:    node.getElementsByTagName('regDate')[0]?.textContent,
                statusName: node.getElementsByTagName('statusName')[0]?.textContent,
            }));
            setServerData(items);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFetch = () => {
        setOptions(prev => ({ ...prev, pageNo: 1 }));
        fetchData({ ...options, pageNo: 1 });
    };

    const handlePrev = () => {
        if (options.pageNo > 1) {
            const next = options.pageNo - 1;
            setOptions(prev => ({ ...prev, pageNo: next }));
            fetchData({ ...options, pageNo: next });
        }
    };

    const handleNext = () => {
        if (serverData.length >= options.numOfRows) {
            const next = options.pageNo + 1;
            setOptions(prev => ({ ...prev, pageNo: next }));
            fetchData({ ...options, pageNo: next });
        }
    };

    const openInNewTab = seq => {
        window.open(
            `https://www.vms.or.kr/partspace/recruitView.do?seq=${seq}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    return (
        <>
            <CustomHeader text={'1365 봉사모집 정보'}/>

            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardHeader title="검색 조건" />
                <CardContent>

                    {/* 날짜 필터 */}
                    <Stack direction="row" spacing={2} mb={2}>
                        <TextField
                            label="조회 시작일"
                            name="strDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={options.strDate}
                            onChange={e => setOptions(prev => ({ ...prev, strDate: e.target.value, pageNo: 1 }))}
                            sx={{ flex: '1 1 200px' }}
                        />
                        <TextField
                            label="조회 종료일"
                            name="endDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={options.endDate}
                            onChange={e => setOptions(prev => ({ ...prev, endDate: e.target.value, pageNo: 1 }))}
                            sx={{ flex: '1 1 200px' }}
                        />
                    </Stack>

                    {/* 지역 선택 버튼 */}
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {areaOptions.map(({ name, code }) => (
                            <Button
                                key={code}
                                variant={options.areaCode === code ? 'contained' : 'outlined'}
                                onClick={() => setOptions(prev => ({ ...prev, areaCode: code, pageNo: 1 }))}
                            >
                                {name}
                            </Button>
                        ))}
                    </Box>

                    {/* 모집 유형 버튼 */}
                    <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                        <Button
                            variant={options.TermType === 2 ? 'contained' : 'outlined'}
                            onClick={() => setOptions(prev => ({ ...prev, TermType: 2, pageNo: 1 }))}
                        >
                            비정기
                        </Button>
                        <Button
                            variant={options.TermType === 1 ? 'contained' : 'outlined'}
                            onClick={() => setOptions(prev => ({ ...prev, TermType: 1, pageNo: 1 }))}
                        >
                            정기
                        </Button>
                    </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Button variant="outlined" onClick={handlePrev} disabled={options.pageNo === 1}>
                        이전
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleNext}
                        disabled={serverData.length < options.numOfRows}
                    >
                        다음
                    </Button>
                    <Button variant="contained" onClick={handleFetch}>
                        조회
                    </Button>
                </CardActions>
            </Card>

            <TableContainer component={Paper} sx={{ width: "100%", overflow: "hidden", marginTop: "1rem" }}>
                <Table stickyHeader aria-label="donation table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>시퀀스</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>제목</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>업체명</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>지역</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>날짜</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {serverData.map(row => (
                            <TableRow
                                key={row.seq}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => openInNewTab(row.seq)}
                            >
                                <TableCell>{row.seq}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.centName}</TableCell>
                                <TableCell>{row.areaName}</TableCell>
                                <TableCell>{row.regDate}</TableCell>
                                <TableCell>{row.statusName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
