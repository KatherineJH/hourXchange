// src/components/KoreaMap.jsx
import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { feature } from 'topojson-client';
import topo from '../../data/skorea-provinces.json';  // 실제 파일명·경로 확인
import { geoCentroid } from 'd3-geo';

// TopoJSON → GeoJSON 변환
const geoJson = feature(topo, Object.values(topo.objects)[0]);

// 각 시·도의 시청(도청) 정확한 좌표 매핑
const cityCenters = {
    '서울특별시':        { lat: 37.5663214, lng: 126.9778293 },
    '부산광역시':        { lat: 35.179449,  lng: 129.075498  },
    '대구광역시':        { lat: 35.871435,  lng: 128.601445  },
    '인천광역시':        { lat: 37.456255,  lng: 126.705200  },
    '광주광역시':        { lat: 35.159545,  lng: 126.852601  },
    '대전광역시':        { lat: 36.350417,  lng: 127.384517  },
    '울산광역시':        { lat: 35.538377,  lng: 129.311397  },
    '세종특별자치시':    { lat: 36.480036,  lng: 127.289001  },
    '경기도':           { lat: 37.275058,  lng: 127.009385  }, // 경기도청(수원)
    '강원도':           { lat: 37.881315,  lng: 127.730029  }, // 강원도청(춘천)
    '충청북도':         { lat: 36.638011,  lng: 127.489377  }, // 충북도청(청주)
    '충청남도':         { lat: 36.601680,  lng: 126.660090  }, // 충남도청(홍성)
    '전라북도':         { lat: 35.820225,  lng: 127.148005  }, // 전북도청(전주)
    '전라남도':         { lat: 34.816785,  lng: 126.462709  }, // 전남도청(무안)
    '경상북도':         { lat: 36.570793,  lng: 128.726523  }, // 경북도청(안동)
    '경상남도':         { lat: 35.227035,  lng: 128.681286  }, // 경남도청(창원)
    '제주특별자치도':   { lat: 33.501014,  lng: 126.529778  }  // 제주도청(제주시)
};

export default function KoreaMap({ onRegionClick }) {
    return (
        <ComposableMap
            projection="geoMercator"
            projectionConfig={{
                center: [127.5, 36],
                scale: 5000
            }}
            style={{ width: '100%', height: '100%', minWidth: '400px' }}
        >
            <Geographies geography={geoJson}>
                {({ geographies }) =>
                    geographies.map((geo, idx) => {
                        // 속성에서 행정구역명을 가져옵니다.
                        const name =
                            geo.properties.name ||
                            geo.properties.SIG_KOR_NM ||
                            geo.properties.SIDO_KOR_NM;

                        // 시청·도청 좌표가 매핑되어 있으면 사용, 아니면 지오메트리 중심 fallback
                        const { lat, lng } = cityCenters[name] || (() => {
                            const [lng0, lat0] = geoCentroid(geo);
                            return { lat: lat0, lng: lng0 };
                        })();

                        return (
                            <Geography
                                key={`korea-geo-${idx}`}
                                geography={geo}
                                onClick={() => onRegionClick({ lat, lng })}
                                style={{
                                    default:  { fill: '#ECEFF1', stroke: '#607D8B', outline: 'none' },
                                    hover:    { fill: '#FF8A65', outline: 'none' },
                                    pressed:  { fill: '#FF5722', outline: 'none' }
                                }}
                            />
                        );
                    })
                }
            </Geographies>
        </ComposableMap>
    );
}
