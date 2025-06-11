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
import {getList} from "../../api/categoryApi.js";

export default function CategoryList() {
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
        <Box sx={{ mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                카테고리조회
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>카테고리명</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {serverData.length > 0 ? (
                            serverData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    hover
                                    // sx={{ cursor: 'pointer' }}
                                    // onClick={() => navigate(`/donation/read/${item.id}`)}
                                >
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.categoryName}</TableCell>
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
