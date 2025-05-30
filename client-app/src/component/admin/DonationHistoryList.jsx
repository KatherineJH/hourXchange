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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { getDonationHistory } from '../../api/donationHistoryApi.js';
import CustomPagination from "../common/CustomPagination.jsx";

export default function DonationHistoryList() {
    const navigate = useNavigate();
    const [donationHistoryList, setDonationHistoryList] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getDonationHistory(page, size).then(response => {
            setDonationHistoryList(response.data.content);
            setTotalPages(response.data.totalPages);
        }).catch(error => console.log(error));

    }, [page]);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                기부내역조회
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>기부 전 금액</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>기부금액</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>기부일자</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>
                                기부모집Id
                            </TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>
                                기부모집 제목
                            </TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>
                                기부모집 설명
                            </TableCell>
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
                                    <TableCell>{item.balance}</TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{item.createdAt}</TableCell>
                                    <TableCell>{item.donation.id}</TableCell>
                                    <TableCell>{item.donation.title}</TableCell>
                                    <TableCell>{item.donation.description}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    등록된 정보가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomPagination totalPages={totalPages} page={page} setPage={setPage} />
        </Box>
    );
}
