import React, { useEffect, useState } from "react";
import {
    Box,
    Button, Typography
} from "@mui/material";
import { getList, getListWithKeyword } from "../../api/donationApi.js";
import {useLocation, useNavigate} from "react-router-dom";
import DonationTable from "./DonationTable.jsx";
import CustomPagination from "../common/CustomPagination.jsx";
import DonationSearch from "./DonationSearch.jsx";

export default function ListTable({ filterProviderType, category, keyword: keywordProp = "" }) {
    const [serverDataList, setServerDataList] = useState([]);
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [size,setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState(keywordProp);


    const { pathname } = useLocation();              // 현재 경로
    const registerPath = pathname.startsWith('/admin')
        ? '/admin/donation/register'
        : '/donation/register';



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



    return (
        <>
            <Typography variant="h4" sx={{mt: 4}} gutterBottom>
                기부모집
            </Typography>
            {/* 검색창 + 버튼 영역 */}
            <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                {/* 검색창 */}
                <DonationSearch setPage={setPage} keyword={keyword} setKeyword={setKeyword} />

                {/* 게시물 작성 버튼 */}
                <Button variant="contained" onClick={() => navigate(registerPath)}>게시물 작성</Button>
            </Box>
            {/* 테이블 내용*/}
            <DonationTable serverDataList={serverDataList} navigate={navigate} pathname={pathname}/>
            {/* 페이지네이션 */}
            <CustomPagination totalPages={totalPages} page={page} setPage={setPage} />
        </>
    );
}
