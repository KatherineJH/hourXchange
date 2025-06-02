import React, { useState, useEffect } from 'react';
import {
    Box, Button, FormControl, InputLabel, MenuItem,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CustomPagination from "../common/CustomPagination.jsx";
import {getSearch} from "../../api/transactionApi.js";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateField} from "@mui/x-date-pickers";

const initParams = {
    transactionId: '',
    userId: '',
    productId: '',
    status: '',
    startDate: null, // 시작일
    endDate: null // 끝일
}

export default function TransactionList() {
    const navigate = useNavigate();
    const [serverData, setServerData] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [params, setParams] = useState(initParams);

    const getSearchFuntion = async () => {
        try{
            const formattedParams = {
                ...params,
                startDate: params.startDate?.format('YYYY-MM-DD') ?? null,
                endDate:   params.endDate?.format('YYYY-MM-DD')   ?? null,
            };
            console.log(formattedParams);
            const response = await getSearch(page, size, formattedParams);
            console.log(response.data.content)
            setServerData(response.data.content);
            setTotalPages(response.data.totalPages);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        getSearchFuntion();

    }, [page]);

    const handleSearch = () => {
        setPage(0);
        getSearchFuntion();
    }

    // 입력 핸들러
    const handleChange = e => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                거래기록조회
            </Typography>

            <Box>
                {/* 1st row: 제목, 설명 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <TextField
                        fullWidth
                        name="transactionId"
                        label="거래기록ID"
                        value={params.transactionId}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="userId"
                        label="유저ID"
                        value={params.userId}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="productId"
                        label="제품ID"
                        value={params.productId}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <FormControl fullWidth size="small" sx={{ flexGrow: 1 }}>
                        <InputLabel>상태</InputLabel>
                        <Select
                            name="status"
                            label="상태"
                            value={params.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="">전체</MenuItem>
                            <MenuItem value="PENDING">진행</MenuItem>
                            <MenuItem value="REQUESTED">요청</MenuItem>
                            <MenuItem value="ACCEPTED">수락</MenuItem>
                            <MenuItem value="COMPLETED">완료</MenuItem>
                            <MenuItem value="FAILED">실패</MenuItem>
                            <MenuItem value="REFUNDED">환불</MenuItem>
                        </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField
                            fullWidth
                            name="startDate"
                            label="시작일"
                            value={params.startDate}
                            onChange={value => handleChange({ target: { name: 'startDate', value } })}
                            format="YYYY-MM-DD"
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ flexGrow: 1 }}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField
                            fullWidth
                            name="endDate"
                            label="종료일"
                            value={params.endDate}
                            onChange={value => handleChange({ target: { name: 'endDate', value } })}
                            format="YYYY-MM-DD"
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ flexGrow: 1 }}
                        />
                    </LocalizationProvider>
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{ flexGrow: 1, minWidth: 120 }}
                    >
                        검색
                    </Button>
                </Box>
            </Box>

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
                                    // onClick={() => navigate(`/donation/read/${item.id}`)}
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
