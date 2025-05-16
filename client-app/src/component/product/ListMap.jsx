import React, {useEffect, useState} from 'react';
import {getListWithPosition} from "../../api/productApi.js";

import {
    Box,
    Typography,
    Paper,
    Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KakaoListMap from "../common/KakaoListMap.jsx";

const initState = {
    id: '',
    title: '',
    description: '',
    hours: '',
    startedAt: '',
    endAt: '',
    lat: '',
    lng: '',
    owner: {},
    category: {},
    providerType: '',
    images: []
}

const initPosition = {
    lat: 37.496486063,
    lng: 127.028361548
}

// 1. 주요 지역과 좌표 데이터를 미리 정의
const regions = [
    { name: '서울', coords: { lat: 37.5665, lng: 126.9780 } },
    { name: '부산', coords: { lat: 35.1796, lng: 129.0756 } },
    { name: '대구', coords: { lat: 35.8714, lng: 128.6014 } },
    { name: '인천', coords: { lat: 37.4563, lng: 126.7052 } },
    { name: '광주', coords: { lat: 35.1595, lng: 126.8526 } },
    { name: '대전', coords: { lat: 36.3504, lng: 127.3845 } },
    { name: '울산', coords: { lat: 35.5384, lng: 129.3114 } },
    { name: '세종', coords: { lat: 36.4800, lng: 127.2890 } },
];

function ListMap() {

    const [serverDataList, setServerDataList] = useState([]);

    const [position, setPosition] = useState(initPosition);

    const handleRegionClick = (position) =>{
        setPosition(position)
    }

    useEffect(() => {
        getListWithPosition(position).then(response => {
            setServerDataList(response.data);
        }).catch(error => console.log(error));
    }, [position]);

    return (
        <>
            <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4, p: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    📍 지역 선택
                </Typography>

                {/* 가로 스크롤 가능한 버튼 그룹 */}
                <Paper
                    variant="outlined"
                    sx={{
                        display: 'flex',
                        gap: 1,
                        p: 1,
                        overflowX: 'auto',
                        justifyContent: 'center'
                    }}
                >
                    {regions.map(region => (
                        <Button
                            key={region.name}
                            onClick={() => handleRegionClick(region.coords)}
                            startIcon={<LocationOnIcon />}
                            sx={{
                                flexDirection: 'column',
                                minWidth: 80,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {region.name}
                        </Button>
                    ))}
                </Paper>
            </Box>
        <Box>
            <KakaoListMap serverData={serverDataList} position={position} setPosition={setPosition}/>

        </Box>
        </>
    );
}

export default ListMap;