import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Stack,
    Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { getMyDonationHistory } from '../../api/donationHistoryApi.js';

export default function MyDonationHistoryList() {
    const navigate = useNavigate();
    const [donationHistoryList, setDonationHistoryList] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            try {
                const res = await getMyDonationHistory(page, size);
                console.log(res)
                const { content, totalPages: tp } = res.data;
                setDonationHistoryList(content);
                setTotalPages(tp);
            } catch (err) {
                console.error('기부 리스트 조회 실패:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, [page]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                기부 모금 목록
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>
                                기부모집 제목
                            </TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>
                                기부모집 설명
                            </TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>기부 전 금액</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>기부금액</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>기부일자</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {donationHistoryList.length > 0 ? (
                            donationHistoryList.map((item) => (
                                <TableRow
                                    key={item.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/donation/read/${item.id}`)}
                                >
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.donation.title}</TableCell>
                                    <TableCell>{item.donation.description}</TableCell>
                                    <TableCell>{item.balance}</TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{item.createdAt}</TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    등록된 모금이 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Stack spacing={2}>
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={(_, value) => setPage(value - 1)}
                        color="primary"
                    />
                </Stack>
            </Box>
        </Box>
    );
}
