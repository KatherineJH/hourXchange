import React, {useEffect, useState} from 'react';
import {
    Box, Button,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput, Pagination,
    Paper,
    Select, Stack,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,
    TextField
} from "@mui/material";
import {getList} from "../../api/volunteerApi.js";

const initState = {
    serviceKey: import.meta.env.VITE_OPENAPI_KEY,
    numOfRows: 10, // 페이지 사이즈
    pageNo: 1, // 페이지
    strDate: '', // 조회 시작일
    endDate: '', // 조회 끝일
    areaCode: '', // 지역
    TermType: '', // 1 정기 2 비정기
    status: 1 // 1 모집중 2 모집완료
}

const area = [
    {name: '서울', code: '0101'},
    {name: '부산', code: '0102'},
    {name: '대구', code: '0103'},
    {name: '인천', code: '0104'},
    {name: '광주', code: '0105'},
    {name: '대전', code: '0106'},
    {name: '울산', code: '0107'},
    {name: '세종', code: '0117'},
    {name: '경기', code: '0108'},
    {name: '강원', code: '0109'},
    {name: '충북', code: '0110'},
    {name: '충남', code: '0111'},
    {name: '전북', code: '0112'},
    {name: '전남', code: '0113'},
    {name: '경북', code: '0114'},
    {name: '경남', code: '0115'},
    {name: '제주', code: '0116'}
]

function VolunteerList(props) {

    const [options, setOptions] = useState(initState);

    const [serverData, setServerData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name + value)
        setOptions({ ...options, [name]: value });
    };

    // useEffect(() => {
    //     getList(options).then(response => {
    //         setServerData(response.data);
    //     }).catch(error => {console.log(error)});
    // }, []);

    const handleClickFetch = async () => {
        try {
            const response = await getList(options);
            console.log(response);
            // 1) DOMParser로 XML 문자열을 파싱
            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'application/xml');

            // 2) <item> 노드를 배열로 변환
            const items = Array.from(xml.getElementsByTagName('item')).map(itemNode => ({
                seq:        itemNode.getElementsByTagName('seq')[0]?.textContent,
                title:      itemNode.getElementsByTagName('title')[0]?.textContent,
                centName:   itemNode.getElementsByTagName('centName')[0]?.textContent,
                areaName:   itemNode.getElementsByTagName('areaName')[0]?.textContent,
                place:      itemNode.getElementsByTagName('place')[0]?.textContent,
                regDate:    itemNode.getElementsByTagName('regDate')[0]?.textContent,
                termType:   itemNode.getElementsByTagName('termTypeName')[0]?.textContent,
                statusName: itemNode.getElementsByTagName('statusName')[0]?.textContent,
            }));
            setServerData(items);
        }catch (error) {
            console.log(error);
        }
    }

    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel id="areaCode-label">지역</InputLabel>
                <Select
                    labelId="areaCode-label"
                    id="areaCodeselect"
                    name="areaCode"
                    value={options.areaCode}
                    label="areaCode"
                    onChange={handleChange}
                >
                    {area.map(item =>(
                        <MenuItem key={item.code} value={item.code}>{item.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="TermType-label">정기/비정기</InputLabel>
                <Select
                    labelId="TermType-label"
                    id="TermType-select"
                    name="TermType"
                    value={options.TermType}
                    label="TermType"
                    onChange={handleChange}
                >
                    <MenuItem key={1} value={1}>정기</MenuItem>
                    <MenuItem key={2} value={2}>비정기</MenuItem>
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel id="strDate-label">부터</InputLabel>
                <TextField
                    fullWidth
                    id="strDate"
                    name="strDate"
                    type="Date"
                    InputLabelProps={{ shrink: true }}
                    value={options.strDate}
                    onChange={handleChange}
                    margin="normal"
                />
            </FormControl>
            <FormControl>
                <InputLabel id="endDate-label">까지</InputLabel>
                <TextField
                    fullWidth
                    id="endDate"
                    name="endDate"
                    type="Date"
                    InputLabelProps={{ shrink: true }}
                    value={options.endDate}
                    onChange={handleChange}
                    margin="normal"
                />
            </FormControl>
            <Button
                onClick={handleClickFetch}
            >
                조회
            </Button>
            <Box>
                {/*<pre>{JSON.stringify(serverData)}</pre>*/}
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table stickyHeader aria-label="product table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: "secondary.main" }}>시퀀스</TableCell>
                                <TableCell sx={{ bgcolor: "secondary.main" }}>제목</TableCell>
                                <TableCell sx={{ bgcolor: "secondary.main" }}>업체명</TableCell>
                                <TableCell sx={{ bgcolor: "secondary.main" }}>지역</TableCell>
                                <TableCell sx={{ bgcolor: "secondary.main" }}>
                                    날짜
                                </TableCell>
                                <TableCell sx={{ bgcolor: "secondary.main" }}>
                                    상태
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {serverData.map((item) => (
                                <TableRow
                                    hover
                                    key={item.seq}
                                    // onClick={() => navigate(`/product/read/${item.id}`)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <TableCell>{item.seq}</TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.centName}</TableCell>
                                    <TableCell>{item.areaName}</TableCell>
                                    <TableCell>{item.regDate}</TableCell>
                                    <TableCell>{item.statusName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>


        </Box>
    );
}

export default VolunteerList;