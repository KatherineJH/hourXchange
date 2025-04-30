import React, { useState } from "react";
import { GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.496486063, lng: 127.028361548 };

/**
 * GoogleListMapWithInfoWindow
 * - serverData: Array of { id, lat, lng, image, title, content }
 * - 마커 호버 시 InfoWindow 표시, InfoWindow 호버 유지, 마우스 아웃 시 숨김
 * - InfoWindow 내부 클릭 시 상세 페이지로 이동
 */
function GoogleReadMap({ serverData }) {
  const position = { lat: Number(serverData.lat), lng: Number(serverData.lng) };

  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(true);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={15}
    >
      <MarkerF
        position={position}
        onClick={() => setIsInfoWindowOpen(true)} // 🔥 마커 클릭 시 InfoWindow 열기
      />
      {isInfoWindowOpen && (
        <InfoWindow
          position={position}
          onCloseClick={() => setIsInfoWindowOpen(false)} // 🔥 x 누르면 닫기
          options={{
            disableAutoPan: true,
          }}
        >
          <div
            style={{
              cursor: "pointer",
              width: "200px",
              textAlign: "center",
            }}
          >
            <img
              src={serverData.images[0]}
              alt={serverData.title}
              style={{ width: "100%", height: "auto", borderRadius: "4px" }}
            />
            <h4 style={{ margin: "8px 0 4px", fontSize: "16px" }}>
              {serverData.title}
            </h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
              {serverData.description}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default GoogleReadMap;
