import React, { useState, useEffect } from 'react';
import {
    Box, Button, CardMedia, FormControl, InputLabel, LinearProgress, MenuItem,
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
import {getSearch} from "../../api/donationApi.js";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DateField} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

const initParams = {
    donationId: '',
    title: '',
    description: '',
    status: '',
    startDate: null,
    endDate: null
}

export default function DonationList() {
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
            const response = await getSearch(page, size, formattedParams);
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
        <Box sx={{ mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                기부모집조회
            </Typography>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ width: '100%', mb: 2 }}
            >
                {/* 1st row: 제목, 설명 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <TextField
                        fullWidth
                        name="donationId"
                        label="기부모집ID"
                        value={params.donationId}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="title"
                        label="제목"
                        value={params.title}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="description"
                        label="설명"
                        value={params.description}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                </Box>

                {/* 2nd row: 시작일, 종료일, 상태, 검색 버튼 */}
                <Box sx={{ display: 'flex', gap: 2 }}>
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

                    <FormControl fullWidth size="small" sx={{ flexGrow: 1 }}>
                        <InputLabel>상태</InputLabel>
                        <Select
                            name="status"
                            label="상태"
                            value={params.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="">전체</MenuItem>
                            <MenuItem value="ONGOING">진행중</MenuItem>
                            <MenuItem value="COMPLETED">완료</MenuItem>
                            <MenuItem value="CANCELLED">취소</MenuItem>
                        </Select>
                    </FormControl>

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
                            <TableCell sx={{ bgcolor: "secondary.main" }}>사진</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>제목</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>설명</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>모집시간</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>시작시간</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>끝시간</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {serverData.length > 0 ? (
                            serverData.map((item) => {
                                const progress = Math.min(
                                    (item.currentAmount / item.targetAmount) * 100,
                                    100
                                );
                                return (
                                    <TableRow
                                        hover
                                        key={item.id}
                                        // onClick={() => navigate(`${readPath}${item.id}`)}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>
                                            <CardMedia
                                                component="img"
                                                image={item.images[0] ?? '/default.png'}
                                                alt={item.title}
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 1,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{item.status}</TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell sx={{ width: 200 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {`${item.currentAmount} / ${item.targetAmount}`}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={progress}
                                                sx={{ height: 8, borderRadius: 4, mt: 0.5 }}
                                            />
                                        </TableCell>
                                        <TableCell>{item.startDate}</TableCell>
                                        <TableCell>{item.endDate}</TableCell>
                                    </TableRow>
                                );
                            })
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
