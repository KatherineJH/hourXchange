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

const initParams = {
    userId: '',
    email: '',
    name: '',
    username: '',
    role: '',
    status: ''
}


import CustomPagination from "../common/CustomPagination.jsx";
import {getSearch} from "../../api/userApi.js";
export default function UserList() {
    const navigate = useNavigate();
    const [serverData, setServerData] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [params, setParams] = useState(initParams);

    const getSearchFuntion = async () => {
        try{
            console.log(params);
            const response = await getSearch(page, size, params);
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
        <Box sx={{ mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>
                유저조회
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
                        name="userId"
                        label="유저ID"
                        value={params.userId}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="email"
                        label="이메일"
                        value={params.email}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="name"
                        label="이름"
                        value={params.name}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        name="username"
                        label="닉네임"
                        value={params.username}
                        onChange={handleChange}
                        size="small"
                        sx={{ flexGrow: 1 }}
                    />
                </Box>

                {/* 2nd row: 시작일, 종료일, 상태, 검색 버튼 */}
                <Box sx={{ display: 'flex', gap: 2 }}>

                    <FormControl fullWidth size="small" sx={{ flexGrow: 1 }}>
                        <InputLabel>상태</InputLabel>
                        <Select
                            name="role"
                            label="권한"
                            value={params.role}
                            onChange={handleChange}
                        >
                            <MenuItem value="">전체</MenuItem>
                            <MenuItem value="ROLE_USER">유저</MenuItem>
                            <MenuItem value="ROLE_ADMIN">어드민</MenuItem>
                            <MenuItem value="ROLE_COMPANY">회사</MenuItem>
                        </Select>
                    </FormControl>


                    <FormControl fullWidth size="small" sx={{ flexGrow: 1 }}>
                        <InputLabel>상태</InputLabel>
                        <Select
                            name="status"
                            label="상태"
                            value={params.status}
                            onChange={handleChange}
                        >
                            <MenuItem value="">전체</MenuItem>
                            <MenuItem value="ACTIVE">활성</MenuItem>
                            <MenuItem value="INACTIVE">비활성</MenuItem>
                            <MenuItem value="WITHDRAWN">탈퇴</MenuItem>
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
                            <TableCell sx={{ bgcolor: "secondary.main" }}>이메일</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>이름</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>닉네임</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>생일</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>권한</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>잔액</TableCell>
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
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    <TableCell>{item.birthdate}</TableCell>
                                    <TableCell>{item.role}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{item.wallet.credit}</TableCell>
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

