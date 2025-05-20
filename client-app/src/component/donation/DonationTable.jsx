import React from 'react';
import {
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

function DonationTable({serverDataList, navigate, pathname}) {
    const readPath = pathname.startsWith('/admin')
        ? '/admin/donation/read/'
        : '/donation/read/';

    return (
    <TableContainer component={Paper} sx={{ width: "100%", overflow: "hidden", marginTop: "1rem" }}>
        <Table stickyHeader aria-label="donation table">
            <TableHead>
                <TableRow>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>Id</TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>제목</TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>설명</TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>모집시간</TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>시작시간</TableCell>
                    <TableCell sx={{ bgcolor: "secondary.main" }}>끝시간</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {serverDataList.length > 0 ? (
                    serverDataList.map((item) => {
                        const progress = Math.min(
                            (item.currentAmount / item.targetAmount) * 100,
                            100
                        );
                        return (
                            <TableRow
                                hover
                                key={item.id}
                                onClick={() => navigate(`${readPath}${item.id}`)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell>{item.id}</TableCell>
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
                        <TableCell colSpan={4} align="center">조회 결과가 없습니다.</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
    );
}

export default DonationTable;