import React, { useEffect, useState } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 37.496486063,
  lng: 127.028361548,
};

function GoogleSaveMap({ saveData, setSaveData }) {
  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setSaveData({
            ...saveData,
            lat: coords.latitude,
            lng: coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          // 위치 권한 거부 등 에러 시 기본값 유지
        },
      );
    }
  }, []);

  // 맵 클릭 핸들러: 클릭 좌표로 상태 업데이트
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSaveData({ ...saveData, lat, lng });
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={12}
      onClick={handleMapClick}
    >
      {/* 마커 렌더링 */}
      <MarkerF position={{ lat: saveData.lat, lng: saveData.lng }} />
    </GoogleMap>
  );
}

export default GoogleSaveMap;
