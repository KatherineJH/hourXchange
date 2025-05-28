import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const ShareQrButton = () => {
    const [showQr, setShowQr] = useState(false);
    const location = useLocation();
    const currentUrl = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;

    return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
            <button
                onClick={() => setShowQr(prev => !prev)}
                style={{
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    border: '1px solid #007bff',
                    backgroundColor: showQr ? '#f0f8ff' : '#007bff',
                    color: showQr ? '#007bff' : '#fff'
                }}
            >
                {showQr ? 'QR 코드 숨기기' : 'QR 코드 보기'}
            </button>

            {showQr && (
                <div style={{ marginTop: '1rem' }}>
                    <p>아래 QR 코드를 스캔하면 현재 페이지로 이동합니다.</p>
                    <QRCodeCanvas
                        value={currentUrl}
                        size={200}
                        level="H"
                        includeMargin
                    />
                    <div style={{ marginTop: '0.5rem', wordBreak: 'break-all' }}>
                        <a href={currentUrl} target="_blank" rel="noreferrer">
                            {currentUrl}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareQrButton;
