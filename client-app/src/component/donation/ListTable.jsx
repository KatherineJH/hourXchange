import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Stack,
    Pagination,
    Typography,
    LinearProgress
} from "@mui/material";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { getList, getListWithKeyword, getAutocompleteSuggestions } from "../../api/donationApi.js";
import {useLocation, useNavigate} from "react-router-dom";
import {useDebounce} from "../../assets/useDebounce.js";

export default function ListTable({ filterProviderType, category, keyword: keywordProp = "" }) {
    const [serverDataList, setServerDataList] = useState([]);
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [keyword, setKeyword] = useState(keywordProp);
    const [searchInput, setSearchInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const { pathname } = useLocation();              // 현재 경로
    const registerPath = pathname.startsWith('/admin')
        ? '/admin/donation/register'
        : '/donation/register';

    const readPath = pathname.startsWith('/admin')
        ? '/admin/donation/read/'
        : '/donation/read/';

    const debouncedInput = useDebounce(searchInput, 300);

    useEffect(() => {
        if (searchInput.trim() === "" || searchInput === keyword) {
            setSuggestions([]);
            return;
        }
        getAutocompleteSuggestions(debouncedInput)
            .then(res => setSuggestions(res.data))
            .catch(e => {
                console.error("추천 검색어 실패", e);
                setSuggestions([]);
            });
        setHighlightedIndex(-1);
    }, [debouncedInput, keyword]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response =
                    keyword.trim() === ""
                        ? await getList(page, size)
                        : await getListWithKeyword(keyword, page, size);

                let data = response.data.content;

                if (filterProviderType) {
                    data = data.filter((p) => p.providerType === filterProviderType);
                }
                if (category) {
                    data = data.filter((p) => p.category?.categoryName === category);
                }

                setServerDataList(data);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("리스트 조회 실패:", error);
            }
        };
        fetch();
    }, [page, size, keyword, filterProviderType, category]);

    useEffect(() => {
        setKeyword(keywordProp);
    }, [keywordProp]);

    const handleSearch = () => {
        setKeyword(searchInput);
        setPage(0);
    };

    return (
        <Box>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    {/* 검색창 + 버튼 영역 */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        {/* 검색창 */}
                        <Box sx={{ position: "relative", width: "300px" }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="검색어를 입력하세요"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowDown") {
                                        e.preventDefault();
                                        setHighlightedIndex((prev) =>
                                            prev < suggestions.length - 1 ? prev + 1 : 0
                                        );
                                    } else if (e.key === "ArrowUp") {
                                        e.preventDefault();
                                        setHighlightedIndex((prev) =>
                                            prev > 0 ? prev - 1 : suggestions.length - 1
                                        );
                                    } else if (e.key === "Enter") {
                                        if (
                                            highlightedIndex >= 0 &&
                                            highlightedIndex < suggestions.length
                                        ) {
                                            const selected = suggestions[highlightedIndex];
                                            setSearchInput(selected);
                                            setKeyword(selected);
                                            setPage(0);
                                            setSuggestions([]);
                                            setHighlightedIndex(-1);
                                        } else {
                                            handleSearch();
                                        }
                                    }
                                }}
                                size="small"
                            />
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    height: "100%",
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                }}
                            >
                                검색
                            </Button>

                            {/* 추천 검색어 */}
                            {suggestions.length > 0 && (
                                <Paper
                                    sx={{
                                        position: "absolute",
                                        width: "100%",
                                        mt: "4px",
                                        zIndex: 10,
                                        maxHeight: 200,
                                        overflowY: "auto",
                                    }}
                                >
                                    <List dense>
                                        {suggestions.map((s, idx) => (
                                            <ListItem key={idx} disablePadding>
                                                <ListItemButton
                                                    selected={idx === highlightedIndex}
                                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                                    onClick={() => {
                                                        setSearchInput(s);
                                                        setKeyword(s);
                                                        setPage(0);
                                                        setSuggestions([]);
                                                        setHighlightedIndex(-1);
                                                    }}
                                                >
                                                    <ListItemText primary={s} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </Box>

                        {/* 게시물 작성 버튼 */}
                        <Button variant="contained" onClick={() => navigate(registerPath)}>게시물 작성</Button>
                    </Box>

                    {/* 테이블 */}
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                                        <TableCell colSpan={6} align="center">조회 결과가 없습니다.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            {/* 페이지네이션 */}
            <Box sx={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                <Stack spacing={2}>
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={(event, value) => setPage(value - 1)}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                    />
                </Stack>
            </Box>
        </Box>
    );
}
