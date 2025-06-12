// src/components/common/KakaoListMap.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import KakaoMapLoader from './KakaoMapLoader';

const containerStyle = { width: '100%', height: '600px' };

export default function KakaoListMap({ serverData, center, onViewportChange }) {
    const mapRef      = useRef(null);
    const mapInstance = useRef(null);
    const markers     = useRef([]);
    const overlays    = useRef([]);
    const clusterer   = useRef(null);
    const navigate    = useNavigate();

    // 1) 맵 초기화: 컴포넌트 마운트 시 한 번만 실행
    useEffect(() => {
        if (!window.kakao || !mapRef.current) return;
        window.kakao.maps.load(() => {
            const kakao = window.kakao;
            const map = new kakao.maps.Map(mapRef.current, {
                center: new kakao.maps.LatLng(center.lat, center.lng),
                level: 3,
            });
            mapInstance.current = map;

            // 클러스터러 설정
            clusterer.current = new kakao.maps.MarkerClusterer({
                map,
                gridSize: 60,
                minLevel: 4,
                disableClickZoom: false
            });

            // 뷰포트 정보 부모로 전달
            const emitViewport = () => {
                const bounds = map.getBounds();
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();
                onViewportChange({
                    swLat: sw.getLat(),
                    swLng: sw.getLng(),
                    neLat: ne.getLat(),
                    neLng: ne.getLng()
                });
            };
            emitViewport();
            kakao.maps.event.addListener(map, 'dragend', emitViewport);
            kakao.maps.event.addListener(map, 'zoom_changed', emitViewport);
        });
    }, []);  // ← 빈 배열: 마운트 시 딱 한 번만

    // 2) center 변경 시: 기존 맵 인스턴스에만 center 이동
    useEffect(() => {
        const map = mapInstance.current;
        if (map && center) {
            map.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng));
        }
    }, [center]);

    // 3) serverData 변경 시 마커·오버레이·클러스터 갱신
    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !window.kakao) return;
        const kakao = window.kakao;
        const cl    = clusterer.current;
        const level = map.getLevel();

        // 기존 마커/오버레이 제거
        markers.current.forEach(m => m.setMap(null));
        overlays.current.forEach(o => o.setMap(null));
        if (cl) cl.clear();
        markers.current = [];
        overlays.current = [];

        serverData.forEach(item => {
            if (!item.lat || !item.lng) return;
            const pos = new kakao.maps.LatLng(Number(item.lat), Number(item.lng));

            // ▶ 마커 생성
            const marker = new kakao.maps.Marker({ position: pos });
            kakao.maps.event.addListener(marker, 'click', () => {
                navigate(`/product/read/${item.id}`);
            });
            markers.current.push(marker);

            // ▶ 오버레이 콘텐츠
            const wrap = document.createElement('div');
            Object.assign(wrap.style, {
                cursor: 'pointer',
                width: '180px',
                textAlign: 'center',
                padding: '6px',
                background: '#fff',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                pointerEvents: 'auto'
            });

            const typeEl = document.createElement('strong');
            typeEl.textContent = item.providerType === 'BUYER' ? '삽니다' : '팝니다';
            Object.assign(typeEl.style, {
                display: 'block',
                margin: '6px 0 2px',
                fontSize: '18px',
                textAlign: 'center'
            });
            wrap.appendChild(typeEl);

            const img = document.createElement('img');
            Object.assign(img.style, {
                width: '100%',
                height: 'auto',
                borderRadius: '4px'
            });
            img.src = item.images[0] || '/default.png';
            img.alt = item.title;
            wrap.appendChild(img);

            const titleEl = document.createElement('strong');
            titleEl.textContent = item.title;
            Object.assign(titleEl.style, {
                display: 'block',
                margin: '6px 0 2px',
                fontSize: '14px'
            });
            wrap.appendChild(titleEl);

            const descEl = document.createElement('p');
            descEl.textContent = item.description;
            Object.assign(descEl.style, {
                margin: 0,
                fontSize: '12px',
                color: '#555'
            });
            wrap.appendChild(descEl);

            wrap.addEventListener('click', () => navigate(`/product/read/${item.id}`));

            // ▶ 오버레이 객체 생성
            const overlay = new kakao.maps.CustomOverlay({
                content: wrap,
                position: pos,
                xAnchor: 0.5,
                yAnchor: 1,
                offset: new kakao.maps.Point(0, -20)
            });
            overlays.current.push(overlay);

            // hover 이벤트로 오버레이 토글
            let hideTimeout;
            kakao.maps.event.addListener(marker, 'mouseover', () => {
                clearTimeout(hideTimeout);
                overlay.setMap(map);
            });
            kakao.maps.event.addListener(marker, 'mouseout', () => {
                hideTimeout = setTimeout(() => overlay.setMap(null), 100);
            });
            wrap.addEventListener('mouseover', () => {
                clearTimeout(hideTimeout);
                overlay.setMap(map);
            });
            wrap.addEventListener('mouseout', () => {
                hideTimeout = setTimeout(() => overlay.setMap(null), 100);
            });
        });

        // 클러스터링 또는 개별 마커 렌더링
        if (level >= 4 && cl) {
            cl.addMarkers(markers.current);
        } else {
            markers.current.forEach(m => m.setMap(map));
        }
    }, [serverData]);

    return (
    <>
      <KakaoMapLoader /> 
      <div ref={mapRef} style={containerStyle} />
    </>
  );
}
