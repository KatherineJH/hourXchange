import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const containerStyle = { width: "100%", height: "600px" };

/**
 * GoogleListMapWithInfoWindow
 * - serverData: Array of { id, lat, lng, image, title, content }
 * - 마커 호버 시 InfoWindow 표시, InfoWindow 호버 유지, 마우스 아웃 시 숨김
 * - InfoWindow 내부 클릭 시 상세 페이지로 이동
 */
function GoogleListMap({ serverData, position, setPosition }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const navigate = useNavigate();
  const mapRef = useRef(null);

  // 맵이 로드될 때 ref에 저장
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // 드래그(팬)가 끝났을 때 호출
  const onDragEnd = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter().toJSON();
      console.log(newCenter);
      setPosition(newCenter);
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={17}
      onDragEnd={onDragEnd}
      onLoad={onMapLoad}
    >
      {serverData.map((item, i) => {
        if (!item.lat || !item.lng) return null;
        const position = { lat: Number(item.lat), lng: Number(item.lng) };
        return (
          <MarkerF
            key={`marker-${i}`}
            position={position}
            onClick={() => setSelectedIdx(i)}
          />
        );
      })}

      {serverData.map((item, i) => {
        if (selectedIdx !== i || !item.lat || !item.lng) return null;
        const position = { lat: Number(item.lat), lng: Number(item.lng) };
        return (
          <InfoWindow
            key={`info-${i}`}
            position={position}
            onCloseClick={() => setSelectedIdx(null)}
          >
            <div
              style={{
                cursor: "pointer",
                width: "200px",
                textAlign: "center",
              }}
              onClick={() => navigate(`/product/read/${item.id}`)}
            >
              <img
                src={item.images[0]}
                alt={item.title}
                style={{ width: "100%", height: "auto", borderRadius: "4px" }}
              />
              <h4 style={{ margin: "8px 0 4px", fontSize: "16px" }}>
                {item.title}
              </h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                {item.description}
              </p>
            </div>
          </InfoWindow>
        );
      })}
    </GoogleMap>
  );
}

export default GoogleListMap;
