// src/components/common/KakaoListMap.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const containerStyle = { width: '100%', height: '600px' };

export default function KakaoListMap({
                                         serverData,
                                         setPosition // 이제 { swLat, swLng, neLat, neLng, level } 형태로 받습니다
                                     }) {
    const mapRef      = useRef(null);
    const mapInstance = useRef(null);
    const markers     = useRef([]);
    const overlays    = useRef([]);
    const clusterer   = useRef(null);
    const navigate    = useNavigate();

    // 맵 초기화 + 클러스터러, 이벤트 리스너 한 번 등록
    useEffect(() => {
        if (!window.kakao || !mapRef.current) return;
        window.kakao.maps.load(() => {
            const kakao = window.kakao;
            const map   = new kakao.maps.Map(mapRef.current, {
                center: new kakao.maps.LatLng(37.5663, 126.9778),
                level: 3,
            });
            mapInstance.current = map;

            // 클러스터러 설정 (level >= 4 일 때 클러스터링)
            clusterer.current = new kakao.maps.MarkerClusterer({
                map,
                gridSize: 100,
                minLevel: 4,
                disableClickZoom: false
            });

            // 뷰포트 정보 전달 함수
            const emitViewport = () => {
                const bounds = map.getBounds();
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();
                setPosition({
                    swLat: sw.getLat(),
                    swLng: sw.getLng(),
                    neLat: ne.getLat(),
                    neLng: ne.getLng(),
                    level: map.getLevel()
                });
            };

            // 초기 한 번
            emitViewport();

            // 드래그, 줌 변경 시 뷰포트 재전달
            kakao.maps.event.addListener(map, 'dragend', emitViewport);
            kakao.maps.event.addListener(map, 'zoom_changed', emitViewport);
        });
    }, [setPosition]);

    // serverData 또는 레벨 변경 시 마커/클러스터 갱신
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

            // ▶ 마커 생성 (지도에 직접 올리지는 않고 클러스터러로 관리)
            const marker = new kakao.maps.Marker({ position: pos });
            kakao.maps.event.addListener(marker, 'click', () => {
                navigate(`/product/read/${item.id}`);
            });
            markers.current.push(marker);

            // ▶ 오버레이 컨텐츠 (hover 시 표시)
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

            wrap.innerHTML = `
        <strong style="display:block;margin:6px 0 2px;font-size:18px">
          ${item.providerType==='BUYER'?'삽니다':'팝니다'}
        </strong>
        <img src="${item.images[0]||'/default.png'}" 
             alt="${item.title}" 
             style="width:100%;height:auto;border-radius:4px" />
        <strong style="display:block;margin:6px 0;font-size:14px">
          ${item.title}
        </strong>
        <p style="margin:0;font-size:12px;color:#555">
          ${item.description}
        </p>
      `;
            wrap.addEventListener('click', () => navigate(`/product/read/${item.id}`));

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
    }, [serverData, setPosition]);

    return <div ref={mapRef} style={containerStyle} />;
}
