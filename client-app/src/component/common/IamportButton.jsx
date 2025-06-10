import React, { useState } from 'react';
import {postTransaction} from "../../api/paymentApi.js";
import {useSelector} from "react-redux";

const iamportKey = import.meta.env.VITE_IAMPORT_KEY;

export default function IamportButton({ productName, amount }) {
    const [loading, setLoading] = useState(false);
    const {user} = useSelector((state) => state.auth);

    const handlePayment = () => {
        const IMP = window.IMP;
        IMP.init(iamportKey); // 백엔드와 동일한 API Key

        const merchantUid = `mid_${new Date().getTime()}`;

        IMP.request_pay({
            pg: 'html5_inicis',        // 사용할 PG (예: html5_inicis, kakao, nice, uplus 등)
            pay_method: 'card',        // 결제수단
            merchant_uid: merchantUid, // 가맹점 주문번호
            name: productName,         // 상품명
            amount: amount,            // 금액
            buyer_email: user.email, // 구매자 정보(optional)
            buyer_name: user.name,
            m_redirect_url: '',        // 모바일에서 결제 후 돌아올 URL (SPA라면 공백)
        }, async (impResponse) => {
            console.log(impResponse);
            if (impResponse.success) {
                // 1) 결제 성공 → 서버에 검증 요청
                try {
                    const response = await postTransaction(impResponse);
                    console.log('검증 완료:', response.data);
                    alert('결제 성공!');
                    // TODO: 결제 완료 화면으로 이동
                } catch (err) {
                    console.error('검증 오류:', err);
                    alert('결제 검증에 실패했습니다.');
                }
            } else {
                // 2) 결제 실패
                console.error(impResponse.error_msg);
                alert(`결제 실패: ${impResponse.error_msg}`);
            }
            setLoading(false);
        });

        setLoading(true);
    };

    return (
        <button onClick={handlePayment} disabled={loading}>
            {loading ? '결제창 열기 중…' : '아임포트로 결제하기'}
        </button>
    );
}
