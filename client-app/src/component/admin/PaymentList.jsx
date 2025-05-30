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


import CustomPagination from "../common/CustomPagination.jsx";
import {getPaymentList} from "../../api/paymentApi.js";

export default function PaymentList() {
    const navigate = useNavigate();
    const [serverData, setServerData] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getPaymentList(page, size).then(response => {
            setServerData(response.data.content);
            setTotalPages(response.data.totalPages);
        }).catch(error => console.log(error));

    }, [page]);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                결제내역조회
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>주문번호</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>결제번호</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>이메일</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상품이름</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상품가격</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>결제일자</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>결제수단</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>결제처</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>PG거래번호</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>영수증번호</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {serverData.length > 0 ? (
                            serverData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/donation/read/${item.id}`)}
                                >
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.merchantUid}</TableCell>
                                    <TableCell>{item.impUid}</TableCell>
                                    <TableCell>{item.user.email}</TableCell>
                                    <TableCell>{item.paymentItem.name}</TableCell>
                                    <TableCell>{item.paymentItem.price}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{item.paidAt}</TableCell>
                                    <TableCell>{item.payMethod}</TableCell>
                                    <TableCell>{item.pgProvider}</TableCell>
                                    <TableCell>{item.pgTid}</TableCell>
                                    <TableCell>{item.receiptUrl}</TableCell>
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
