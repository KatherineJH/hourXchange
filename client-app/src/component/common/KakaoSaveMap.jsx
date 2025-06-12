// src/components/KakaoSaveMap.jsx
import React, { useEffect, useRef } from 'react';
import KakaoMapLoader from './KakaoMapLoader';

// 맵이 처음 로드될 때 사용할 기본 좌표 (서울 강남구 논현동)
// 출처: 카카오 지도 API 공식 문서 – 기본 좌표 설정 예시
const defaultCenter = { lat: 37.496486063, lng: 127.028361548 };

function KakaoSaveMap({ saveData, setSaveData }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const geocoderRef = useRef(null);

    useEffect(() => {
        // 1) kakao.maps 객체가 준비되지 않았다면 종료
        if (
            !window.kakao ||
            !window.kakao.maps ||
            typeof window.kakao.maps.load !== 'function'
        ) {
            return;
        }

        // 2) autoload=false 상태에서 maps 모듈을 불러오기
        window.kakao.maps.load(() => {
            const maps = window.kakao.maps;

            // 3) 초기 중심 좌표 계산
            //    - 수정 모드라면 saveData.lat/ lng 사용
            //    - 아니면 defaultCenter 사용 (Geolocation은 이후에서 처리)
            const initialLat =
                typeof saveData.lat === 'number' ? saveData.lat : defaultCenter.lat;
            const initialLng =
                typeof saveData.lng === 'number' ? saveData.lng : defaultCenter.lng;

            // 4) 맵 객체 생성 (center: initialLatLng, level: 4)
            const map = new maps.Map(mapRef.current, {
                center: new maps.LatLng(initialLat, initialLng),
                level: 4,
            });
            mapInstance.current = map;

            // 5) 마커 객체 생성 (초기 위치는 나중에 세팅)
            const marker = new maps.Marker({ map });
            markerRef.current = marker;

            // 6) 지오코더 객체 생성
            const geocoder = new maps.services.Geocoder();
            geocoderRef.current = geocoder;

            // 7) “편집 모드”인지 확인하여 초기 마커/센터 설정
            if (
                typeof saveData.lat === 'number' &&
                typeof saveData.lng === 'number'
            ) {
                // 편집 모드: saveData에 있는 좌표로 바로 마커 위치 및 지도 센터 설정
                const editPos = new maps.LatLng(saveData.lat, saveData.lng);
                marker.setPosition(editPos);
                map.setCenter(editPos);
            } else {
                // 생성 모드: Geolocation 허용 여부에 따라 처리
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        ({ coords }) => {
                            const userPos = new maps.LatLng(
                                coords.latitude,
                                coords.longitude
                            );
                            marker.setPosition(userPos);
                            map.setCenter(userPos);

                            // 지오코더로 주소 조회 (출처: https://apis.map.kakao.com/web/documentation/#/local_Geocoder/coordToAddress)
                            geocoder.coord2Address(
                                coords.longitude,
                                coords.latitude,
                                (res, status) => {
                                    if (status === maps.services.Status.OK) {
                                        setSaveData(prev => ({
                                            ...prev,
                                            lat: coords.latitude,
                                            lng: coords.longitude,
                                        }));
                                    }
                                }
                            );
                        },
                        // 위치 요청 거부 또는 에러 시 기본 center로 설정
                        () => {
                            const defPos = new maps.LatLng(
                                defaultCenter.lat,
                                defaultCenter.lng
                            );
                            marker.setPosition(defPos);
                            map.setCenter(defPos);
                        },
                        { enableHighAccuracy: true }
                    );
                } else {
                    // Geolocation을 지원하지 않을 때
                    const defPos = new maps.LatLng(
                        defaultCenter.lat,
                        defaultCenter.lng
                    );
                    marker.setPosition(defPos);
                    map.setCenter(defPos);
                }
            }

            // 8) 맵 클릭 이벤트: 클릭한 위치로 마커 이동 + 주소 조회
            maps.event.addListener(map, 'click', e => {
                const lat = e.latLng.getLat();
                const lng = e.latLng.getLng();
                const clickPos = new maps.LatLng(lat, lng);

                marker.setPosition(clickPos);

                geocoder.coord2Address(lng, lat, (res, status) => {
                    if (status === maps.services.Status.OK) {
                        setSaveData(prev => ({
                            ...prev,
                            lat: lat,
                            lng: lng,
                        }));
                    }
                });
            });
        });
        // 빈 배열로 설정하면 이 useEffect는 컴포넌트 마운트 시 한 번만 실행됩니다.
        // saveData를 의존성에 넣지 않는 이유는, 초기 렌더링 시 이미 가진 saveData를 바탕으로 맵을 세팅하기 위함입니다.
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 9) saveData가 변경될 때마다 (수정 모드나 클릭 시) 마커와 센터 동기화
    useEffect(() => {
        const map = mapInstance.current;
        const marker = markerRef.current;
        if (map && marker && typeof saveData.lat === 'number' && typeof saveData.lng === 'number') {
            const newPos = new window.kakao.maps.LatLng(saveData.lat, saveData.lng);
            marker.setPosition(newPos);
            map.setCenter(newPos);
        }
    }, [saveData.lat, saveData.lng]);

    return (
    <>
      <KakaoMapLoader /> 
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
    </>
  );
}

export default KakaoSaveMap;
