// src/components/DonationList.jsx
import React, {useEffect, useState} from 'react';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Pagination,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack
} from '@mui/material';
import { getCntrProgramList } from '../../api/donationApi.js';
import CustomPagination from "../common/CustomPagination.jsx";
import CustomHeader from "../common/CustomHeader.jsx";

const VITE_OPENAPI_KEY = import.meta.env.VITE_OPENAPI_KEY;

// YYYYMMDD 문자열을 YYYY-MM-DD로 포맷
const formatDisplayDate = yyyymmdd => {
    const s = String(yyyymmdd || '');
    if (s.length !== 8) return yyyymmdd;
    return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6)}`;
};

// 시도 코드 옵션
const sidoOptions = [
    { value: '', label: '전체' },
    { value: '11', label: '서울특별시' },
    { value: '26', label: '부산광역시' },
    { value: '27', label: '대구광역시' },
    { value: '28', label: '인천광역시' },
    { value: '29', label: '광주광역시' },
    { value: '30', label: '대전광역시' },
    { value: '31', label: '울산광역시' },
    { value: '36', label: '세종특별자치시' },
    { value: '41', label: '경기도' },
    { value: '42', label: '강원도' },
    { value: '43', label: '충청북도' },
    { value: '44', label: '충청남도' },
    { value: '45', label: '전라북도' },
    { value: '46', label: '전라남도' },
    { value: '47', label: '경상북도' },
    { value: '48', label: '경상남도' },
    { value: '50', label: '제주특별자치도' }
];

function DonationList() {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth()-1);
    const formatYYYYMMDD = date=>date.toISOString().slice(0,10).replace(/-/g,'');

    const [filters, setFilters] = useState({
        serviceKey: VITE_OPENAPI_KEY,
        schCntrProgrmRegistNo:'', schSido:'',
        schRcritBgnde: formatYYYYMMDD(oneMonthAgo),
        schRcritEndde: formatYYYYMMDD(today), schCntrNm:'',
        step:'', sortColumn:'rcritBgnde', sortType:'DESC',
        pageNo:1, numOfRows:10
    });
    const [items,setItems]=useState([]);
    const [totalCount,setTotalCount]=useState(0);
    const [searchTrigger, setSearchTrigger] = useState(false);

    const handleChange = key => e => {
        const val=e.target.value;
        setFilters(f=>({
            ...f,
            [key]: ['pageNo','numOfRows'].includes(key)?Number(val):val,
            ...(key!=='pageNo'?{pageNo:1}:null)
        }));
    };

    useEffect(() => {
        getCntrProgramList(filters).then(response=>{
            const body=response.data.response?.body||{};
            const raw=body.items;
            console.log(body.items)
            let list=[];
            if(raw){
                if(Array.isArray(raw.item)) list=raw.item;
                else if(raw.item) list=[raw.item];
            }
            setItems(list);
            setTotalCount(Number(body.totalCount)||0);
        }).catch(error=>{
            console.log(error);
        })
    }, [filters.pageNo, searchTrigger]);

    const setPage = (page)=>{
        setFilters(f=>({...f, pageNo: page + 1}));
    }

    const totalPages=Math.ceil(totalCount/filters.numOfRows);

    const openDetail = (rcritrId) => {
        const url=`https://www.nanumkorea.go.kr/ctgp/viewCntrGrpDetail.do?grpRqstSn=${rcritrId}`;
        window.open(url,'_blank');
    };

    return(
        <>
            <Box sx={{ width: "100%", maxWidth: 1220, mx: "auto", px: { xs: 1, sm: 2 } }}>
            <CustomHeader text={'1365 기부모집 정보'}/>
            <Card variant="outlined" sx={{mb:3}}>
                <CardHeader title="검색 조건" />
                <CardContent>
                    {/* 첫 번째 줄 */}
                    <Box sx={{display:'flex',gap:2,flexWrap:'wrap',mb:2}}>
                        <Box sx={{flex:'1 1 200px'}}><FormControl fullWidth size="small"><InputLabel>진행상태</InputLabel><Select value={filters.step} label="진행상태" onChange={handleChange('step')}><MenuItem value="">전체</MenuItem><MenuItem value="1">모집중</MenuItem><MenuItem value="2">모집완료</MenuItem></Select></FormControl></Box>
                        <Box sx={{flex:'1 1 200px'}}><FormControl fullWidth size="small"><InputLabel>정렬방식</InputLabel><Select value={filters.sortType} label="정렬방식" onChange={handleChange('sortType')}><MenuItem value="DESC">내림차순</MenuItem><MenuItem value="ASC">오름차순</MenuItem></Select></FormControl></Box>
                    </Box>
                    {/* 두 번째 줄 */}
                    <Box sx={{display:'flex',gap:2,flexWrap:'wrap',mb:2}}>
                        <Box sx={{flex:'1 1 200px'}}><TextField label="시작일(YYYYMMDD)" size="small" fullWidth value={filters.schRcritBgnde} onChange={handleChange('schRcritBgnde')} /></Box>
                        <Box sx={{flex:'1 1 200px'}}><TextField label="완료일(YYYYMMDD)" size="small" fullWidth value={filters.schRcritEndde} onChange={handleChange('schRcritEndde')} /></Box>
                        <Box sx={{flex:'1 1 200px'}}><FormControl fullWidth size="small"><InputLabel>정렬컬럼</InputLabel><Select value={filters.sortColumn} label="정렬컬럼" onChange={handleChange('sortColumn')}><MenuItem value="rcritBgnde">시작일</MenuItem><MenuItem value="rcritEndde">완료일</MenuItem><MenuItem value="step">진행상태</MenuItem></Select></FormControl></Box>
                    </Box>
                    {/* 세 번째 줄 */}
                    <Box sx={{display:'flex',gap:2,flexWrap:'wrap'}}>
                        <Box sx={{flex:'1 1 200px'}}><FormControl fullWidth size="small"><InputLabel>시도코드</InputLabel><Select value={filters.schSido} label="시도코드" onChange={handleChange('schSido')}>{sidoOptions.map(opt=><MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}</Select></FormControl></Box>
                        <Box sx={{flex:'1 1 200px'}}><TextField label="모집등록번호" size="small" fullWidth value={filters.schCntrProgrmRegistNo} onChange={handleChange('schCntrProgrmRegistNo')} /></Box>
                        <Box sx={{flex:'1 1 200px'}}><TextField label="검색어" size="small" fullWidth value={filters.schCntrNm} onChange={handleChange('schCntrNm')} /></Box>
                    </Box>
                </CardContent>
                <CardActions sx={{justifyContent:'flex-end',pr:2,pb:2}}><Button variant="contained" onClick={() => setSearchTrigger(!searchTrigger)}>조회</Button></CardActions>
            </Card>
            {/* 테이블 */}
            <TableContainer component={Paper} sx={{ width: "100%", overflow: "hidden", marginTop: "1rem" }}>
                <Table stickyHeader aria-label="donation table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>단체정보</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>등록번호</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>제목</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>시작일</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>완료일</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>상태</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>목표액</TableCell>
                            <TableCell sx={{ bgcolor: "secondary.main" }}>단체명</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item=>(<TableRow key={item.cntrProgrmRegistNo} hover>
                            <TableCell>
                                <Button size="small" onClick={()=>openDetail(item.rcritrId)}>단체정보</Button>
                            </TableCell>
                            <TableCell>{item.cntrProgrmRegistNo}</TableCell>
                            <TableCell><Typography variant="body2" sx={{display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:2,overflow:'hidden'}}>{item.reprsntSj}</Typography></TableCell>
                            <TableCell>{formatDisplayDate(item.rcritBgnde)}</TableCell>
                            <TableCell>{formatDisplayDate(item.rcritEndde)}</TableCell>
                            <TableCell>{item.step}</TableCell>
                            <TableCell>{Number(item.rcritGoalAm).toLocaleString()}원</TableCell>
                            <TableCell>{item.rcritrNm}</TableCell>
                        </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* 페이지네이션 */}
            <CustomPagination totalPages={totalPages} page={filters.pageNo - 1} setPage={setPage} />
            </Box>
        </>
    );
}

export default DonationList;
