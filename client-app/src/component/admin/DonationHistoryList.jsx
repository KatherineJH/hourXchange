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
import {getSearch} from "../../api/donationHistoryApi.js";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateField} from "@mui/x-date-pickers";

const initParams = {
    donationHistoryId: '',
    donationId: '',
    donatorId: '',
    startDate: null,
    endDate: null

}

export default function DonationHistoryList() {
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
                기부내역조회
            </Typography>
            <Box>
                {/* 1st row: 제목, 설명 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <TextField
                        fullWidth
                        name="donationHistoryId"
                        label="기부내역ID"
                        value={params.donationHistoryId}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
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
                        name="donatorId"
                        label="유저ID"
                        value={params.donatorId}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />

                {/* 2nd row: 시작일, 종료일, 상태, 검색 버튼 */}

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
                        {serverData.length > 0 ? (
                            serverData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    // onClick={() => navigate(`/donation/read/${item.id}`)}
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
