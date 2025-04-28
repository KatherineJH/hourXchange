import React, { useState } from 'react';
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const containerStyle = { width: '700px', height: '400px' };
const defaultCenter = { lat: 37.496486063, lng: 127.028361548 };

/**
 * GoogleListMapWithInfoWindow
 * - serverData: Array of { id, lat, lng, image, title, content }
 * - 마커 호버 시 InfoWindow 표시, InfoWindow 호버 유지, 마우스 아웃 시 숨김
 * - InfoWindow 내부 클릭 시 상세 페이지로 이동
 */
function GoogleListMap({ serverData }) {
    const [selectedIdx, setSelectedIdx] = useState(null);
    const navigate = useNavigate();

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={15}
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
                                cursor: 'pointer',
                                width: '200px',
                                textAlign: 'center'
                            }}
                            onClick={() => navigate(`/product/read/${item.id}`)}
                        >
                            <img
                                src={item.images[0]}
                                alt={item.title}
                                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                            />
                            <h4 style={{ margin: '8px 0 4px', fontSize: '16px' }}>
                                {item.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
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
