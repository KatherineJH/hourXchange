import React, { useState, useEffect } from "react";
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
    Pagination, CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {getMyDonation} from "../../api/donationApi.js";

export default function MyDonationList() {
    const navigate = useNavigate();
    const [donationList, setDonationList] = useState([]);
    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            try {
                const res = await getMyDonation(page, size);
                console.log(res);
                const { content, totalPages: tp } = res.data;
                setDonationList(content);
                setTotalPages(tp);
            } catch (err) {
                console.error("기부 리스트 조회 실패:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, [page]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1220, mx: "auto", p: 2 }}>
            <Typography variant="h4" gutterBottom>
                나의 기부 리스트
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
                            <TableCell sx={{ bgcolor: "secondary.main" }}>모집목적</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>현재모집목표액</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>모집목표액</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>모집시작일</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>모집끝일</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>생성일자</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>증빙</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {donationList.length > 0 ? (
                            donationList.map((item) => (
                                <TableRow
                                    key={item.id}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/donation/read/${item.id}`)}
                                >
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.purpose}</TableCell>
                                    <TableCell>{item.currentAmount}</TableCell>
                                    <TableCell>{item.targetAmount}</TableCell>
                                    <TableCell>{item.startDate}</TableCell>
                                    <TableCell>{item.endDate}</TableCell>
                                    <TableCell>{item.createdAt}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>
                                        <CardMedia
                                            component="img"
                                            src={item.proofUrl ? item.proofUrl : "/default.png"}
                                            alt="증빙 이미지"
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </TableCell>
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

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
