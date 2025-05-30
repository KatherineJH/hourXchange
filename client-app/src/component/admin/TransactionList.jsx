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
import {getList} from "../../api/transactionApi.js";

export default function TransactionList() {
    const navigate = useNavigate();
    const [serverData, setServerData] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getList(page, size).then(response => {
            setServerData(response.data.content);
            setTotalPages(response.data.totalPages);
        }).catch(error => console.log(error));

    }, [page]);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                거래기록조회
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>유저명</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>제품명</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>생성일자</TableCell>
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
                                    <TableCell>{item.user.name}</TableCell>
                                    <TableCell>{item.product.title}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{item.createdAt}</TableCell>
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
