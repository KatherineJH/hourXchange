// src/components/KakaoSaveMap.jsx
import React, { useEffect, useRef } from 'react';

const containerStyle = { width: '100%', height: '400px' };
const defaultCenter = { lat: 37.496486063, lng: 127.028361548 };

function KakaoSaveMap({ saveData, setSaveData }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const geocoderRef = useRef(null);

    useEffect(() => {
        // SDK와 maps 모듈, load 함수 준비 여부 확인
        if (
            !window.kakao ||
            !window.kakao.maps ||
            typeof window.kakao.maps.load !== 'function'
        ) {
            return;
        }

        // autoload=false 상태에서 maps 모듈 로드
        window.kakao.maps.load(() => {
            const maps = window.kakao.maps;

            // 1) 맵 생성
            const map = new maps.Map(mapRef.current, {
                center: new maps.LatLng(defaultCenter.lat, defaultCenter.lng),
                level: 4,
            });
            mapInstance.current = map;

            // 2) 마커·지오코더 생성
            const marker = new maps.Marker({ map });
            const geocoder = new maps.services.Geocoder();

            markerRef.current = marker;
            geocoderRef.current = geocoder;

            // 3) 클릭 이벤트 핸들러
            maps.event.addListener(map, 'click', (e) => {
                const lat = e.latLng.getLat();
                const lng = e.latLng.getLng();
                marker.setPosition(e.latLng);

                geocoder.coord2Address(
                    lng,
                    lat,
                    (res, status) => {
                        console.log(status)
                        if (status === maps.services.Status.OK) {
                            const road  = res[0].road_address;
                            const jibun = res[0].address;
                            console.log(road, jibun)
                            setSaveData(prev => ({
                                ...prev,
                                lat: lat,
                                lng: lng,
                                address: {
                                    zonecode:      road?.zone_no        || '',
                                    roadAddress:   road?.address_name  || '',
                                    jibunAddress:  jibun?.address_name || '',
                                    detailAddress: road?.building_name  || '',
                                }
                            }));
                        }
                    }
                );
            });

            // 4) (옵션) 현재 위치 설정
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    ({ coords }) => {
                        const pos = new maps.LatLng(coords.latitude, coords.longitude);
                        marker.setPosition(pos);
                        map.setCenter(pos);

                        geocoder.coord2Address(
                            coords.longitude,
                            coords.latitude,
                            (res, status) => {
                                if (status === maps.services.Status.OK) {
                                    const road  = res[0].road_address;
                                    const jibun = res[0].address;
                                    console.log(road, jibun)
                                    setSaveData(prev => ({
                                        ...prev,
                                        lat: coords.latitude,
                                        lng: coords.longitude,
                                        address: {
                                            zonecode:      road?.zone_no        || '',
                                            roadAddress:   road?.address_name  || '',
                                            jibunAddress:  jibun?.address_name || '',
                                            detailAddress: road?.building_name  || '',
                                        }
                                    }));
                                }
                            }
                        );
                    },
                    console.warn,
                    { enableHighAccuracy: true }
                );
            }
        });
    }, []);

    // 2) saveData.lat, saveData.lng 변경 시 마커/센터 동기화
    useEffect(() => {
           const map = mapInstance.current;
           const marker = markerRef.current;
           if (map && marker && typeof saveData.lat === 'number' && typeof saveData.lng === 'number') {
                   const newPos = new window.kakao.maps.LatLng(saveData.lat, saveData.lng);
                   marker.setPosition(newPos);
                   map.setCenter(newPos);
               }
       }, [saveData.lat, saveData.lng]);

    return <div ref={mapRef} style={containerStyle} />;
}

export default KakaoSaveMap;
