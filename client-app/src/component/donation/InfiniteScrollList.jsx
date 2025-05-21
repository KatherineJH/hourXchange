// InfiniteScrollList.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getList } from "../../api/donationApi.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    CardMedia,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

export default function InfiniteScrollList() {
    const [items, setItems]     = useState([]);
    const [page, setPage]       = useState(1);
    const [size]                = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef           = useRef();
    const navigate              = useNavigate();
    const { pathname }          = useLocation();
    const readPath              = pathname.startsWith('/admin')
        ? '/admin/donation/read/'
        : '/donation/read/';

    // 데이터 로드
    useEffect(() => {
        if (!hasMore) return;
        setLoading(true);
        getList(page, size)
            .then(res => {
                const { content, last } = res.data;
                setItems(prev => [...prev, ...content]);
                setHasMore(!last);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page]);

    // 마지막 행 감지
    const lastRowRef = useCallback(node => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observerRef.current.observe(node);
    }, [loading, hasMore]);

    return (
        <TableContainer component={Paper} sx={{ width: "100%", mt: 2 }}>
            <Table stickyHeader aria-label="donation table">
                <TableHead>
                    <TableRow>
                        {["Id","사진","상태","제목","설명","모집시간","시작시간","끝시간"].map(h => (
                            <TableCell key={h} sx={{ bgcolor: "secondary.main" }}>{h}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {items.length === 0 && !loading ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                조회 결과가 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : items.map((item, idx) => {
                        const progress = Math.min((item.currentAmount / item.targetAmount) * 100, 100);
                        const refProps = idx === items.length - 1 ? { ref: lastRowRef } : {};
                        return (
                            <TableRow
                                key={item.id}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => navigate(`${readPath}${item.id}`)}
                                {...refProps}
                            >
                                <TableCell>{item.id}</TableCell>
                                <TableCell>
                                    <CardMedia
                                        component="img"
                                        image={item.images?.[0] ?? '/default.png'}
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
                    })}
                </TableBody>
            </Table>

            {loading && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography>로딩 중…</Typography>
                </Box>
            )}
            {!hasMore && !loading && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography>모두 불러왔습니다.</Typography>
                </Box>
            )}
        </TableContainer>
    );
}
