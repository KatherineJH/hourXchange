// src/components/ListMap.jsx
import React, { useEffect, useState } from 'react';
import { getListWithBounds } from '../../api/productApi.js';
import DaumPostcode from 'react-daum-postcode';

import {
    Box,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Link
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KakaoListMap from '../common/KakaoListMap.jsx';
import KoreaMap from '../common/KoreaMap.jsx';
import CustomHeader from "../common/CustomHeader.jsx";

// 초기 중심 좌표 (서울시청)
const initCenter = { lat: 37.5663214, lng: 126.9778293 };

export default function ListMap() {
    // 1) 화면에 보이는 영역 (bounds)
    const [bounds, setBounds]   = useState(null);
    // 2) 지도의 중심 좌표
    const [center, setCenter]   = useState(initCenter);
    const [serverDataList, setServerDataList] = useState([]);
    const [openPostcode, setOpenPostcode]     = useState(false);

    // bounds 변경될 때마다 API 호출
    useEffect(() => {
        if (!bounds) return;
        getListWithBounds(bounds)
            .then(res => setServerDataList(res.data))
            .catch(console.error);
    }, [bounds]);

    // 주소 직접 검색 핸들러
    const handlePostcodeComplete = data => {
        const address = data.address;
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const { y, x } = result[0];
                setCenter({ lat: parseFloat(y), lng: parseFloat(x) });
            } else {
                alert('주소 검색에 실패했습니다.');
            }
            setOpenPostcode(false);
        });
    };

    // 시·도 버튼 목록
    const regions = [
        { name: '서울특별시',     coords: { lat: 37.5663214, lng: 126.9778293 } },
        { name: '부산광역시',     coords: { lat: 35.179449,  lng: 129.075498  } },
        { name: '대구광역시',     coords: { lat: 35.871435,  lng: 128.601445  } },
        { name: '인천광역시',     coords: { lat: 37.456255,  lng: 126.705200  } },
        { name: '광주광역시',     coords: { lat: 35.159545,  lng: 126.852601  } },
        { name: '대전광역시',     coords: { lat: 36.350417,  lng: 127.384517  } },
        { name: '울산광역시',     coords: { lat: 35.538377,  lng: 129.311397  } },
        { name: '세종특별자치시', coords: { lat: 36.480036,  lng: 127.289001  } },
        { name: '경기도',         coords: { lat: 37.275058,  lng: 127.009385  } },
        { name: '강원도',         coords: { lat: 37.881315,  lng: 127.730029  } },
        { name: '충청북도',       coords: { lat: 36.638011,  lng: 127.489377  } },
        { name: '충청남도',       coords: { lat: 36.601680,  lng: 126.660090  } },
        { name: '전라북도',       coords: { lat: 35.820225,  lng: 127.148005  } },
        { name: '전라남도',       coords: { lat: 34.816785,  lng: 126.462709  } },
        { name: '경상북도',       coords: { lat: 36.570793,  lng: 128.726523  } },
        { name: '경상남도',       coords: { lat: 35.227035,  lng: 128.681286  } },
        { name: '제주특별자치도', coords: { lat: 33.501014,  lng: 126.529778  } }
    ];

    return (
        <>
            <Box
                sx={{ width: "100%", maxWidth: 1220, mx: "auto", px: { xs: 1, sm: 2 } }}
            >
            {/* 헤더 + 주소 검색 버튼 */}
            <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4 }}>
                <CustomHeader text={'지역별'} />
                <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<LocationOnIcon />}
                        onClick={() => setOpenPostcode(true)}
                    >
                        주소 직접검색
                    </Button>
                </Box>

                {/* 벡터 지도 + 지역 버튼 */}
                <Box sx={{ display: 'flex', gap: 2, height: 400 }}>
                    <Paper variant="outlined" sx={{ flex: 1 }}>
                        <KoreaMap onRegionClick={coords => setCenter(coords)} />
                    </Paper>
                    <Paper
                        variant="outlined"
                        sx={{ width: 200, p:1, display:'flex', flexDirection:'column', gap:1, overflowY:'auto' }}
                    >
                        {regions.map(r => (
                            <Button
                                key={r.name}
                                startIcon={<LocationOnIcon />}
                                onClick={() => setCenter(r.coords)}
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                {r.name}
                            </Button>
                        ))}
                    </Paper>
                </Box>
            </Box>

            {/* 주소 검색 다이얼로그 */}
            <Dialog open={openPostcode} onClose={() => setOpenPostcode(false)} fullWidth maxWidth="sm">
                <DialogTitle>주소 검색</DialogTitle>
                <DialogContent sx={{ p:0, height:400 }}>
                    <DaumPostcode
                        onComplete={handlePostcodeComplete}
                        style={{ width:'100%', height:'100%' }}
                    />
                </DialogContent>
            </Dialog>

            {/* 카카오 리스트 지도 */}
            <Box sx={{ height:600, mt:2 }}>
                <KakaoListMap
                    serverData={serverDataList}
                    center={center}
                    onViewportChange={setBounds}
                />
            </Box>

            <Typography variant="caption" color="text.secondary" align="center">
                해당 페이지에 포함된 지도 원자료는 통계청 통계지리정보서비스(
                <Link
                    href="https://sgis.kostat.go.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    sgis.kostat.go.kr
                </Link>
                )에서 공공누리 제 1유형 라이선스에 의거해 제공하는 것으로, 2025년 05월 21일에 수집되었습니다. 출처:
                <Link
                    href="http://www.kogl.or.kr/info/license.do"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    kogl.or.kr
                </Link>
            </Typography>
            </Box>
        </>
    );
}
