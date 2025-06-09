// src/components/ListTable.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
    getList,
    getListWithKeyword,
} from "../../api/donationApi.js";

import DonationTable from "./DonationTable.jsx";
import DonationCardList from "./DonationCardList.jsx";
import InfiniteScrollList from "./InfiniteScrollList.jsx";
import CustomPagination from "../common/CustomPagination.jsx";
import DonationSearch from "./DonationSearch.jsx";
import CustomHeader from "../common/CustomHeader.jsx";
import TopDonatorsChart from "../common/TopDonatorChart.jsx";

export default function ListTable({ filterProviderType, category, keyword: keywordProp = "" }) {
    const [serverDataList, setServerDataList] = useState([]);
    const [page, setPage]     = useState(0);
    const [size, setSize]     = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState(keywordProp);

    // 뷰 타입 상태: table(리스트), card, infinite(무한 스크롤)
    const [viewType, setViewType] = useState("table");

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const registerPath = pathname.startsWith("/admin")
        ? "/admin/donation/register"
        : "/donation/register";

    useEffect(() => {
        const fetch = async () => {
            try {
                const response =
                    keyword.trim() === ""
                        ? await getList(page, size)
                        : await getListWithKeyword(keyword, page, size);

                let data = response.data.content;
                if (filterProviderType) {
                    data = data.filter(p => p.providerType === filterProviderType);
                }
                if (category) {
                    data = data.filter(p => p.category?.categoryName === category);
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

    const handleViewChange = (_, next) => {
        if (next !== null) setViewType(next);
    };

    return (
        <>
            <Box sx={{ width: "100%", maxWidth: 1220, mx: "auto", px: { xs: 1, sm: 2 } }}>
                {page === 0 && <TopDonatorsChart />}

                <CustomHeader text="기부모집" />

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
                    <DonationSearch setPage={setPage} keyword={keyword} setKeyword={setKeyword} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* 뷰 타입 토글 */}
                        <ToggleButtonGroup
                            value={viewType}
                            exclusive
                            onChange={handleViewChange}
                            size="small"
                        >
                            <ToggleButton value="table">목록 보기</ToggleButton>
                            <ToggleButton value="card">카드 보기</ToggleButton>
                            <ToggleButton value="infinite">연속 보기</ToggleButton>
                        </ToggleButtonGroup>

                        {/* 게시물 작성 버튼 */}
                        <Button variant="contained" onClick={() => navigate(registerPath)}>
                            게시물 작성
                        </Button>
                    </Box>
                </Box>

                {/* 뷰별 렌더링 */}
                {viewType === "table" && (
                    <>
                        <DonationTable serverDataList={serverDataList} navigate={navigate} pathname={pathname} />
                        <CustomPagination totalPages={totalPages} page={page} setPage={setPage} />
                    </>
                )}

                {viewType === "card" && (
                    <>
                        <DonationCardList serverDataList={serverDataList} navigate={navigate} pathname={pathname} />
                        <CustomPagination totalPages={totalPages} page={page} setPage={setPage} />
                    </>
                )}

                {viewType === "infinite" && (
                    <InfiniteScrollList />
                )}
            </Box>
        </>
    );
}
