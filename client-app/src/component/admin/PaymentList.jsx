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
import {getPaymentSearch} from "../../api/paymentApi.js";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateField} from "@mui/x-date-pickers";

const initParams = {
    paymentId: '',
    userId: '',
    paymentItemId: '',
    impUid: '',       // imp_uid
    merchantUid: '',   // merchant_uid
    status: '',        // paid, failed 등
    payMethod: '',    // card, vbank 등
    pgProvider: '',   // html5_inicis, naverpay 등
    pgTid: '',        // PG 거래번호
    receiptUrl: '',   // 영수증 URL
    startDate: null,// 시작일
    endDate: null// 끝일
}


export default function PaymentList() {
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
            const response = await getPaymentSearch(page, size, formattedParams);
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
                결제내역조회
            </Typography>
            <Box>
                {/* 1st row: 제목, 설명 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <TextField
                        fullWidth
                        name="paymentId"
                        label="결제내역ID"
                        value={params.paymentId}
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
                        name="paymentItemId"
                        label="결제아이템ID"
                        value={params.paymentItemId}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="impUid"
                        label="impUID"
                        value={params.impUid}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="merchantUid"
                        label="merchantUid"
                        value={params.merchantUid}
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
                            <MenuItem value="PAID">성공</MenuItem>
                            <MenuItem value="FAILED">실패</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        name="payMethod"
                        label="payMethod"
                        value={params.payMethod}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="pgProvider"
                        label="pgProvider"
                        value={params.pgProvider}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="pgTid"
                        label="pgTid"
                        value={params.pgTid}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="receiptUrl"
                        label="receiptUrl"
                        value={params.receiptUrl}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>

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
                                    // onClick={() => navigate(`/donation/read/${item.id}`)}
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
