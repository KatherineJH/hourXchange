// src/components/ListMap.jsx
import React, { useEffect, useState } from 'react';
import { getListWithPosition } from '../../api/productApi.js';
import DaumPostcode from 'react-daum-postcode';

import {
    Box,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent, Link
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KakaoListMap from '../common/KakaoListMap.jsx';
import KoreaMap from '../common/KoreaMap.jsx';
import CustomHeader from "../common/CustomHeader.jsx";

const initPosition = { lat: 37.496486063, lng: 127.028361548 };

// KoreaMap.jsx 에 정의한 시·도청 좌표와 이름 매핑
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

export default function ListMap() {
    const [position, setPosition] = useState(initPosition);
    const [serverDataList, setServerDataList] = useState([]);
    const [openPostcode, setOpenPostcode] = useState(false);

    // position 변경될 때마다 API 호출
    useEffect(() => {
        getListWithPosition(position)
            .then(res => setServerDataList(res.data))
            .catch(console.error);
    }, [position]);

    const handlePostcodeComplete = data => {
        const address = data.address;
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const { y, x } = result[0];
                setPosition({ lat: parseFloat(y), lng: parseFloat(x) });
            } else {
                alert('주소 검색에 실패했습니다.');
            }
            setOpenPostcode(false);
        });
    };

    return (
        <>
            {/* 헤더: 타이틀 + 주소 직접검색 버튼 */}
            <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 4 }}>
                <CustomHeader text={'지역별'}/>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'center',
                        mb: 2
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<LocationOnIcon />}
                        onClick={() => setOpenPostcode(true)}
                    >
                        주소 직접검색
                    </Button>
                </Box>

                {/* 지도 영역과 버튼 영역 */}
                <Box sx={{ display: 'flex', gap: 2, height: 400 }}>
                    {/* 좌측: 벡터 지도 */}
                    <Paper variant="outlined" sx={{ flex: 1 }}>
                        <KoreaMap
                            onRegionClick={({ lat, lng }) => setPosition({ lat, lng })}
                        />
                    </Paper>

                    {/* 우측: 시·도 버튼 */}
                    <Paper
                        variant="outlined"
                        sx={{
                            width: 200,
                            p: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            overflowY: 'auto'
                        }}
                    >
                        {regions.map(r => (
                            <Button
                                key={r.name}
                                startIcon={<LocationOnIcon />}
                                onClick={() => setPosition(r.coords)}
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                {r.name}
                            </Button>
                        ))}
                    </Paper>
                </Box>
            </Box>

            {/* 주소 검색 다이얼로그 */}
            <Dialog
                open={openPostcode}
                onClose={() => setOpenPostcode(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>주소 검색</DialogTitle>
                <DialogContent sx={{ p: 0, height: 400 }}>
                    <DaumPostcode
                        onComplete={handlePostcodeComplete}
                        style={{ width: '100%', height: '100%' }}
                    />
                </DialogContent>
            </Dialog>

            {/* 카카오 지도 + 리스트 */}
            <Box sx={{ height: 600, mt: 2 }}>
                <KakaoListMap
                    serverData={serverDataList}
                    position={position}
                    setPosition={setPosition}
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
        </>
    );
}
