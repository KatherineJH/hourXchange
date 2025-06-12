import React, { useEffect, useRef } from 'react';
import KakaoMapLoader from './KakaoMapLoader';

const containerStyle = { width: '100%', height: '400px' };

function KakaoReadMap({ serverData }) {
    const mapRef = useRef(null);
    const markerInstance = useRef(null);

    useEffect(() => {
        if (!window.kakao || !mapRef.current) return;

        window.kakao.maps.load(() => {
            const kakao = window.kakao;
            const lat = Number(serverData.lat);
            const lng = Number(serverData.lng);
            const position = new kakao.maps.LatLng(lat, lng);

            // 지도 생성
            const map = new kakao.maps.Map(mapRef.current, {
                center: position,
                level: 3,
            });

            // 기본 마커 생성
            const marker = new kakao.maps.Marker({ position, map });
            markerInstance.current = marker;
            // kakao.maps.event.addListener(marker, 'click', () => {
            //     window.location.href = `${serverData.id}`;
            // });
        });

        return () => {
            const kakao = window.kakao;
            // 이전 마커 이벤트 해제
            if (markerInstance.current) {
                kakao.maps.event.removeListener(markerInstance.current, 'click');
            }
            // 언마운트 시점에 div 내부를 완전히 비워서
            // 이전에 생성된 map canvas 를 제거합니다.
            if (mapRef.current) {
                mapRef.current.innerHTML = '';
            }
        };
    }, [serverData]);

    return (
    <>
      <KakaoMapLoader /> 
      <div ref={mapRef} style={containerStyle} />
    </>
  );
}

export default KakaoReadMap;
