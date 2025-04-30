import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

function AddressForm({saveData, setSaveData}) {

    // 팝업 오픈 여부
    const [isOpen, setIsOpen] = useState(false);

    // 팝업에서 주소 선택 완료 시 호출
    const handleComplete = (data) => {
        setSaveData({...saveData,
            address: {
            zonecode: data.zonecode,
            roadAddress: data.roadAddress,
            jibunAddress: data.jibunAddress,
            detailAddress: ''
            }
        });
        setIsOpen(false);
    };

    return (
        <div>
            {/* 1) 버튼으로 팝업 토글 */}
            <button type="button" onClick={() => setIsOpen(true)}>
                주소 검색
            </button>

            {/* 2) DaumPostcode 팝업 */}
            {isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 2000
                }}>
                    <div style={{
                        width: 500, height: 600, margin: '50px auto', background: '#fff', position: 'relative'
                    }}>
                        <DaumPostcode
                            onComplete={handleComplete}
                            style={{ width: '100%', height: '100%' }}
                            autoClose={false}  // 직접 닫기 버튼으로 닫도록
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ position: 'absolute', right: 10, top: 10 }}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 3) 선택된 주소 보여주기 */}
            <div style={{ marginTop: 16 }}>
                <div>
                    <label>우편번호</label><br/>
                    <input value={saveData.address.zonecode} readOnly />
                </div>
                <div>
                    <label>도로명주소</label><br/>
                    <input value={saveData.address.roadAddress} readOnly />
                </div>
                <div>
                    <label>지번주소</label><br/>
                    <input value={saveData.address.jibunAddress} readOnly />
                </div>
                <div>
                    <label>상세주소</label><br/>
                    <input
                        value={saveData.address.detailAddress}
                        onChange={e => setSaveData(prev => ({ ...prev, address:{...prev.address, detailAddress: e.target.value} }))}
                        placeholder="상세주소 입력"
                    />
                </div>
            </div>
        </div>
    );
}
export default AddressForm