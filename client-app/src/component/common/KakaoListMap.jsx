// src/component/common/KakaoListMap.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const containerStyle = { width: '100%', height: '600px' };

export default function KakaoListMap({ serverData, position, setPosition }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markers = useRef([]);
    const overlays = useRef([]);
    const navigate = useNavigate();

    // 1) 맵은 딱 한 번만 초기화
    useEffect(() => {
        if (!window.kakao || !mapRef.current) return;
        window.kakao.maps.load(() => {
            const kakao = window.kakao;
            mapInstance.current = new kakao.maps.Map(mapRef.current, {
                center: new kakao.maps.LatLng(position.lat, position.lng),
                level: 3,
            });
            // 드래그 끝나면 중심 좌표만 업데이트
            kakao.maps.event.addListener(
                mapInstance.current,
                'dragend',
                () => {
                    const c = mapInstance.current.getCenter();
                    setPosition({ lat: c.getLat(), lng: c.getLng() });
                }
            );
        });
    }, []);

    // 2) position이 바뀌면 map.setCenter만 호출
    useEffect(() => {
        if (mapInstance.current && window.kakao) {
            const kakao = window.kakao;
            mapInstance.current.setCenter(
                new kakao.maps.LatLng(position.lat, position.lng)
            );
        }
    }, [position]);

    // 3) serverData 바뀔 때만, 마커/오버레이만 지우고 새로 그리기
    useEffect(() => {
        if (!mapInstance.current || !window.kakao) return;
        const kakao = window.kakao;
        const map = mapInstance.current;

        // 기존 마커/오버레이 삭제
        markers.current.forEach(m => m.setMap(null));
        overlays.current.forEach(o => o.setMap(null));
        markers.current = [];
        overlays.current = [];

        serverData.forEach(item => {
            if (!item.lat || !item.lng) return;
            const pos = new kakao.maps.LatLng(
                Number(item.lat),
                Number(item.lng)
            );

            // ▶ 마커
            const marker = new kakao.maps.Marker({ position: pos, map });
            kakao.maps.event.addListener(marker, 'click', () => {
                navigate(`/product/read/${item.id}`);
            });
            markers.current.push(marker);

            // ▶ 오버레이 컨텐츠 생성
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
            const img = document.createElement('img');
            Object.assign(img.style, {
                width: '100%',
                height: 'auto',
                borderRadius: '4px'
            });
            img.src = item.images[0] || '';
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

            wrap.addEventListener('click', () => {
                navigate(`/product/read/${item.id}`);
            });

            // ▶ 오버레이 생성
            const overlay = new kakao.maps.CustomOverlay({
                content: wrap,
                position: pos,
                xAnchor: 0.5,
                yAnchor: 1,
                offset: new kakao.maps.Point(0, -20)
            });
            overlays.current.push(overlay);

            // hide 타이머 변수(클로저)
            let hideTimeout;

            // hover 이벤트:  마커 → 오버레이
            kakao.maps.event.addListener(marker, 'mouseover', () => {
                clearTimeout(hideTimeout);
                overlay.setMap(map);
            });
            kakao.maps.event.addListener(marker, 'mouseout', () => {
                hideTimeout = setTimeout(() => overlay.setMap(null), 100);
            });

            // 오버레이 자체에 동일한 hover 로직
            wrap.addEventListener('mouseover', () => {
                clearTimeout(hideTimeout);
                overlay.setMap(map);
            });
            wrap.addEventListener('mouseout', () => {
                hideTimeout = setTimeout(() => overlay.setMap(null), 100);
            });
        });
    }, [serverData, navigate]);

    return <div ref={mapRef} style={containerStyle} />;
}
